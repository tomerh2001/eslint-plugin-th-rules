/* eslint-disable th-rules/types-in-dts */
/* eslint-disable new-cap */
/* eslint-disable complexity */

import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESTree, type TSESLint } from '@typescript-eslint/utils';

type Fixer = TSESLint.RuleFixer;

const preferIsEmpty = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-is-empty.md')({
	name: 'prefer-is-empty',

	meta: {
		type: 'problem',
		docs: {
			description: 'Require _.isEmpty instead of length comparisons or boolean checks on .length.',
		},
		fixable: 'code',
		schema: [],
		messages: {
			useIsEmpty: 'Use _.isEmpty({{collection}}) instead of checking {{collection}}.length {{operator}} {{value}}.',
			useIsEmptyUnary: 'Use _.isEmpty({{collection}}) instead of negating {{collection}}.length.',
			useIsEmptyBoolean: 'Use _.isEmpty({{collection}}) instead of boolean checking {{collection}}.length.',
		},
	},

	defaultOptions: [],

	create(context) {
		const { sourceCode } = context;

		function ensureLodashImport(fixer: Fixer) {
			const imports = sourceCode.ast.body.filter((node): node is TSESTree.ImportDeclaration => node.type === AST_NODE_TYPES.ImportDeclaration);

			const hasLodash = imports.some(
				(imp) => imp.source.value === 'lodash' && imp.specifiers.some((s) => s.type === AST_NODE_TYPES.ImportDefaultSpecifier || s.type === AST_NODE_TYPES.ImportNamespaceSpecifier),
			);

			if (hasLodash) return null;

			const firstImport = imports[0];
			return firstImport ? fixer.insertTextBefore(firstImport, `import _ from 'lodash';\n`) : fixer.insertTextBeforeRange([0, 0], `import _ from 'lodash';\n`);
		}

		function unwrapChain(node: TSESTree.Node | undefined): TSESTree.Node | undefined {
			return node?.type === AST_NODE_TYPES.ChainExpression ? node.expression : node;
		}

		function isLengthAccess(node: TSESTree.Node | undefined): node is TSESTree.MemberExpression {
			const unwrapped = unwrapChain(node);
			return (
				!_.isNil(unwrapped) &&
				unwrapped.type === AST_NODE_TYPES.MemberExpression &&
				unwrapped.property.type === AST_NODE_TYPES.Identifier &&
				unwrapped.property.name === 'length' &&
				!unwrapped.computed
			);
		}

		function getLengthMember(node: TSESTree.Node): TSESTree.MemberExpression {
			return unwrapChain(node) as TSESTree.MemberExpression;
		}

		function isNumericLiteral(node: TSESTree.Node | undefined): node is TSESTree.Literal & { value: number } {
			return !_.isNil(node) && node.type === AST_NODE_TYPES.Literal && typeof node.value === 'number';
		}

		function isDoubleNegationLength(node: TSESTree.UnaryExpression): boolean {
			return node.operator === '!' && node.argument.type === AST_NODE_TYPES.UnaryExpression && node.argument.operator === '!' && isLengthAccess(node.argument.argument);
		}

		function isBooleanContext(node: TSESTree.Node): boolean {
			const { parent } = node;
			if (!parent) return false;

			switch (parent.type) {
				case AST_NODE_TYPES.IfStatement:
				case AST_NODE_TYPES.WhileStatement:
				case AST_NODE_TYPES.DoWhileStatement:
				case AST_NODE_TYPES.ForStatement: {
					return parent.test === node;
				}

				case AST_NODE_TYPES.UnaryExpression: {
					return parent.operator === '!';
				}

				case AST_NODE_TYPES.LogicalExpression: {
					return parent.operator === '&&' || parent.operator === '||';
				}

				case AST_NODE_TYPES.ConditionalExpression: {
					return parent.test === node;
				}

				case AST_NODE_TYPES.CallExpression: {
					return parent.callee.type === AST_NODE_TYPES.Identifier && parent.callee.name === 'Boolean' && parent.arguments.length === 1 && parent.arguments[0] === node;
				}

				default: {
					return false;
				}
			}
		}

		function reportBinary(node: TSESTree.BinaryExpression, lengthNode: TSESTree.MemberExpression, operator: string, value: number, isEmptyCheck: boolean) {
			const collection = sourceCode.getText(lengthNode.object);
			const replacement = isEmptyCheck ? `_.isEmpty(${collection})` : `!_.isEmpty(${collection})`;

			context.report({
				node,
				messageId: 'useIsEmpty',
				data: { collection, operator, value },
				fix(fixer) {
					const fixes = [fixer.replaceText(node, replacement)];
					const importFix = ensureLodashImport(fixer);
					if (importFix) fixes.push(importFix);
					return fixes;
				},
			});
		}

		function reportUnary(node: TSESTree.UnaryExpression, lengthNode: TSESTree.MemberExpression) {
			const collection = sourceCode.getText(lengthNode.object);

			context.report({
				node,
				messageId: 'useIsEmptyUnary',
				data: { collection },
				fix(fixer) {
					const fixes = [fixer.replaceText(node, `_.isEmpty(${collection})`)];
					const importFix = ensureLodashImport(fixer);
					if (importFix) fixes.push(importFix);
					return fixes;
				},
			});
		}

		function reportBoolean(node: TSESTree.Node, lengthNode: TSESTree.MemberExpression) {
			const collection = sourceCode.getText(lengthNode.object);

			context.report({
				node,
				messageId: 'useIsEmptyBoolean',
				data: { collection },
				fix(fixer) {
					const fixes = [fixer.replaceText(node, `!_.isEmpty(${collection})`)];
					const importFix = ensureLodashImport(fixer);
					if (importFix) fixes.push(importFix);
					return fixes;
				},
			});
		}

		return {
			BinaryExpression(node) {
				if (isLengthAccess(node.left) && isNumericLiteral(node.right)) {
					const right = node.right.value;

					if ((node.operator === '===' && right === 0) || (node.operator === '<=' && right === 0) || (node.operator === '<' && right === 1)) {
						reportBinary(node, getLengthMember(node.left), node.operator, right, true);
						return;
					}

					if ((node.operator === '>' && right === 0) || (node.operator === '>=' && right === 1) || ((node.operator === '!=' || node.operator === '!==') && right === 0)) {
						reportBinary(node, getLengthMember(node.left), node.operator, right, false);
						return;
					}
				}

				if (isNumericLiteral(node.left) && isLengthAccess(node.right)) {
					const left = node.left.value;

					if ((node.operator === '===' && left === 0) || (node.operator === '>=' && left === 0) || (node.operator === '<=' && left === 0)) {
						reportBinary(node, getLengthMember(node.right), node.operator, left, true);
						return;
					}

					if (node.operator === '<' && left === 0) {
						reportBinary(node, getLengthMember(node.right), node.operator, left, false);
					}
				}
			},

			UnaryExpression(node) {
				if (node.parent?.type === AST_NODE_TYPES.UnaryExpression && node.parent.operator === '!' && isLengthAccess(node.argument)) {
					return;
				}

				if (isDoubleNegationLength(node)) {
					const inner = node.argument as TSESTree.UnaryExpression;
					const lengthNode = getLengthMember(inner.argument);
					reportBoolean(node, lengthNode);
					return;
				}

				const arg = unwrapChain(node.argument);
				if (!isLengthAccess(arg)) return;

				if (isBooleanContext(node)) {
					reportBoolean(node, getLengthMember(arg));
					return;
				}

				if (node.operator === '!') {
					reportUnary(node, getLengthMember(arg));
				}
			},

			ConditionalExpression(node) {
				if (isLengthAccess(node.test) && isBooleanContext(node.test)) {
					reportBoolean(node.test, getLengthMember(node.test));
				}
			},

			LogicalExpression(node) {
				if ((node.operator === '&&' || node.operator === '||') && isLengthAccess(node.left)) {
					reportBoolean(node.left, getLengthMember(node.left));
				}
			},

			IfStatement(node) {
				if (isLengthAccess(node.test)) {
					reportBoolean(node.test, getLengthMember(node.test));
				}
			},
		};
	},
});

export default preferIsEmpty;
