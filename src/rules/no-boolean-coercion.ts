/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import type { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import * as ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-boolean-coercion.md');

const LODASH_MODULE = 'lodash';
const LODASH_IDENT = '_';

const noBooleanCoercion = createRule({
	name: 'no-boolean-coercion',
	meta: {
		type: 'problem',
		fixable: 'code',
		docs: {
			description:
				'Disallow Boolean(value) or !!value. Enforce explicit checks: !_.isNil(value) for scalars and !_.isEmpty(value) for strings, arrays, and objects. If the value is already boolean, remove coercion.',
		},
		schema: [],
		messages: {
			useIsEmpty: 'Boolean coercion is not allowed. Use !_.isEmpty(value) for strings, arrays, and objects.',
			useIsNil: 'Boolean coercion is not allowed. Use !_.isNil(value) for scalar values.',
		},
	},
	defaultOptions: [],
	create(context) {
		const services = ESLintUtils.getParserServices(context);
		const checker = services.program.getTypeChecker();

		function hasLodashImport(): boolean {
			return context.sourceCode.ast.body.some((node) => node.type === AST_NODE_TYPES.ImportDeclaration && node.source.value === LODASH_MODULE);
		}

		function getLodashImportFixer(fixer: RuleFixer) {
			if (hasLodashImport()) {
				return null;
			}

			const firstNode = context.sourceCode.ast.body[0];
			const importText = `import ${LODASH_IDENT} from '${LODASH_MODULE}';\n`;

			if (!firstNode) {
				return fixer.insertTextAfterRange([0, 0], importText);
			}

			return fixer.insertTextBefore(firstNode, importText);
		}

		function isBooleanCall(node: TSESTree.Node): node is TSESTree.CallExpression {
			return node.type === AST_NODE_TYPES.CallExpression && node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === 'Boolean' && node.arguments.length === 1;
		}

		function isDoubleNegation(node: TSESTree.Node): node is TSESTree.UnaryExpression {
			return node.type === AST_NODE_TYPES.UnaryExpression && node.operator === '!' && node.argument.type === AST_NODE_TYPES.UnaryExpression && node.argument.operator === '!';
		}

		function isBooleanByTS(node: TSESTree.Node): boolean {
			const tsNode = services.esTreeNodeToTSNodeMap.get(node);
			if (!tsNode) {
				return false;
			}

			const type = checker.getTypeAtLocation(tsNode);

			return (type.flags & ts.TypeFlags.Boolean) !== 0 || (type.flags & ts.TypeFlags.BooleanLiteral) !== 0; // eslint-disable-line no-bitwise
		}

		function isCollectionLikeByTS(node: TSESTree.Node): boolean {
			const tsNode = services.esTreeNodeToTSNodeMap.get(node);
			if (!tsNode) {
				return false;
			}

			const type = checker.getTypeAtLocation(tsNode);
			const typeString = checker.typeToString(type);

			return typeString === 'string' || typeString === 'object' || typeString.includes('[]') || typeString.startsWith('Array<') || typeString.startsWith('ReadonlyArray<');
		}

		function isCollectionLikeBySyntax(node: TSESTree.Node): boolean {
			return node.type === AST_NODE_TYPES.ArrayExpression || node.type === AST_NODE_TYPES.ObjectExpression || (node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string');
		}

		function report(node: TSESTree.Node, valueNode: TSESTree.Node) {
			if (isBooleanByTS(valueNode)) {
				context.report({
					node,
					messageId: 'useIsNil',
					fix(fixer) {
						return fixer.replaceText(node, context.sourceCode.getText(valueNode));
					},
				});
				return;
			}

			const isCollection = isCollectionLikeBySyntax(valueNode) || isCollectionLikeByTS(valueNode);
			const fnName = isCollection ? 'isEmpty' : 'isNil';
			const replacement = `!${LODASH_IDENT}.${fnName}(${context.sourceCode.getText(valueNode)})`;

			context.report({
				node,
				messageId: isCollection ? 'useIsEmpty' : 'useIsNil',
				fix(fixer) {
					const fixes = [fixer.replaceText(node, replacement)];

					const importFix = getLodashImportFixer(fixer);
					if (importFix) {
						fixes.push(importFix);
					}

					return fixes;
				},
			});
		}

		return {
			CallExpression(node) {
				if (isBooleanCall(node)) {
					report(node, node.arguments[0]);
				}
			},

			UnaryExpression(node) {
				if (isDoubleNegation(node)) {
					const valueNode = (node.argument as TSESTree.UnaryExpression).argument;
					report(node, valueNode);
				}
			},
		};
	},
});

export default noBooleanCoercion;
