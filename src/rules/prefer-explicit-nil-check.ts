/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import type { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import * as ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-explicit-nil-check.md');

const LODASH_MODULE = 'lodash';
const LODASH_IDENT = '_';

const preferExplicitNilCheck = createRule({
	name: 'prefer-explicit-nil-check',

	meta: {
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Disallow implicit falsy or truthy checks. Require explicit _.isNil(value).',
		},
		schema: [],
		messages: {
			useIsNil: 'Implicit truthy/falsy checks are not allowed. Use _.isNil(value) or !_.isNil(value).',
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

		function isBooleanByTS(node: TSESTree.Node): boolean {
			const tsNode = services.esTreeNodeToTSNodeMap.get(node);
			if (!tsNode) return false;

			const type = checker.getTypeAtLocation(tsNode);

			return (type.flags & ts.TypeFlags.Boolean) !== 0 || (type.flags & ts.TypeFlags.BooleanLiteral) !== 0;
		}

		function isAlreadyExplicitCheck(node: TSESTree.Node): boolean {
			return (
				node.type === AST_NODE_TYPES.CallExpression &&
				node.callee.type === AST_NODE_TYPES.MemberExpression &&
				node.callee.object.type === AST_NODE_TYPES.Identifier &&
				node.callee.object.name === LODASH_IDENT &&
				node.callee.property.type === AST_NODE_TYPES.Identifier &&
				(node.callee.property.name === 'isNil' || node.callee.property.name === 'isEmpty')
			);
		}

		function isDoubleNegation(node: TSESTree.UnaryExpression): boolean {
			return node.argument.type === AST_NODE_TYPES.UnaryExpression && node.argument.operator === '!';
		}

		function isImplicitTruthyExpression(node: TSESTree.Node): boolean {
			if (node.type === AST_NODE_TYPES.Identifier || node.type === AST_NODE_TYPES.MemberExpression) {
				return true;
			}

			return false;
		}

		return {
			UnaryExpression(node) {
				if (node.operator !== '!') return;

				if (node.parent?.type === AST_NODE_TYPES.UnaryExpression && node.parent.operator === '!') {
					return;
				}

				if (isDoubleNegation(node)) return;

				const valueNode = node.argument;

				if (isAlreadyExplicitCheck(valueNode)) return;
				if (isBooleanByTS(valueNode)) return;

				const text = context.sourceCode.getText(valueNode);
				const replacement = `${LODASH_IDENT}.isNil(${text})`;

				context.report({
					node,
					messageId: 'useIsNil',
					fix(fixer) {
						const fixes = [fixer.replaceText(node, replacement)];
						const importFix = getLodashImportFixer(fixer);
						if (importFix) fixes.push(importFix);
						return fixes;
					},
				});
			},

			IfStatement(node) {
				const { test } = node;

				if (test.type === AST_NODE_TYPES.BinaryExpression || test.type === AST_NODE_TYPES.LogicalExpression) {
					return;
				}

				if (test.type === AST_NODE_TYPES.UnaryExpression && test.operator === '!') {
					return;
				}

				if (!isImplicitTruthyExpression(test)) return;

				if (isAlreadyExplicitCheck(test)) return;

				if (isBooleanByTS(test)) return;

				const text = context.sourceCode.getText(test);
				const replacement = `!${LODASH_IDENT}.isNil(${text})`;

				context.report({
					node: test,
					messageId: 'useIsNil',
					fix(fixer) {
						const fixes = [fixer.replaceText(test, replacement)];
						const importFix = getLodashImportFixer(fixer);
						if (importFix) fixes.push(importFix);
						return fixes;
					},
				});
			},
		};
	},
});

export default preferExplicitNilCheck;
