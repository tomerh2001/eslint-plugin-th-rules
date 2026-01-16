/* eslint-disable @typescript-eslint/no-unnecessary-condition */
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
			description: 'Require _.isEmpty instead of length comparisons or !x.length checks.',
		},
		fixable: 'code',
		schema: [],
		messages: {
			useIsEmpty: 'Use _.isEmpty({{collection}}) instead of checking {{collection}}.length {{operator}} {{value}}.',
			useIsEmptyUnary: 'Use _.isEmpty({{collection}}) instead of negating {{collection}}.length.',
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

		return {
			BinaryExpression(node) {
				if (isLengthAccess(node.left) && isNumericLiteral(node.right)) {
					const rightValue = node.right.value;

					if ((node.operator === '===' && rightValue === 0) || (node.operator === '<=' && rightValue === 0) || (node.operator === '<' && rightValue === 1)) {
						reportBinary(node, getLengthMember(node.left), node.operator, rightValue, true);
						return;
					}

					if ((node.operator === '>' && rightValue === 0) || (node.operator === '>=' && rightValue === 1) || ((node.operator === '!=' || node.operator === '!==') && rightValue === 0)) {
						reportBinary(node, getLengthMember(node.left), node.operator, rightValue, false);
						return;
					}
				}

				if (isNumericLiteral(node.left) && isLengthAccess(node.right)) {
					const leftValue = node.left.value;

					if ((node.operator === '===' && leftValue === 0) || (node.operator === '>=' && leftValue === 0) || (node.operator === '>' && leftValue === 0)) {
						reportBinary(node, getLengthMember(node.right), node.operator, leftValue, true);
						return;
					}

					if ((node.operator === '<' && leftValue === 1) || (node.operator === '<=' && leftValue === 0)) {
						reportBinary(node, getLengthMember(node.right), node.operator, leftValue, false);
					}
				}
			},

			UnaryExpression(node) {
				if (node.operator !== '!') return;

				if (node.parent.type === AST_NODE_TYPES.LogicalExpression && node.parent.operator === '??') {
					return;
				}

				if (node.parent.type === AST_NODE_TYPES.ConditionalExpression && node.parent.test === node) {
					return;
				}

				const arg = unwrapChain(node.argument);
				if (isLengthAccess(arg)) {
					reportUnary(node, getLengthMember(arg));
				}
			},

			LogicalExpression(node) {
				if (node.operator !== '??') return;

				if (isLengthAccess(node.left)) {
					const lengthNode = getLengthMember(node.left);
					const collection = sourceCode.getText(lengthNode.object);

					context.report({
						node: node.left,
						messageId: 'useIsEmpty',
						data: { collection, operator: '??', value: 0 },
						fix(fixer) {
							const fixes = [fixer.replaceText(node.left, `!_.isEmpty(${collection})`)];
							const importFix = ensureLodashImport(fixer);
							if (importFix) fixes.push(importFix);
							return fixes;
						},
					});
				}

				if (node.left.type === AST_NODE_TYPES.UnaryExpression && node.left.operator === '!' && isLengthAccess(node.left.argument)) {
					const lengthNode = getLengthMember(node.left.argument);
					const collection = sourceCode.getText(lengthNode.object);

					context.report({
						node: node.left,
						messageId: 'useIsEmptyUnary',
						data: { collection },
						fix(fixer) {
							const fixes = [fixer.replaceText(node.left, `_.isEmpty(${collection})`)];
							const importFix = ensureLodashImport(fixer);
							if (importFix) fixes.push(importFix);
							return fixes;
						},
					});
				}
			},

			ConditionalExpression(node) {
				if (isLengthAccess(node.test)) {
					const lengthNode = getLengthMember(node.test);
					const collection = sourceCode.getText(lengthNode.object);

					context.report({
						node: node.test,
						messageId: 'useIsEmpty',
						data: { collection, operator: '?', value: 0 },
						fix(fixer) {
							const fixes = [fixer.replaceText(node.test, `!_.isEmpty(${collection})`)];
							const importFix = ensureLodashImport(fixer);
							if (importFix) fixes.push(importFix);
							return fixes;
						},
					});
				}

				if (node.test.type === AST_NODE_TYPES.UnaryExpression && node.test.operator === '!' && isLengthAccess(node.test.argument)) {
					const lengthNode = getLengthMember(node.test.argument);
					const collection = sourceCode.getText(lengthNode.object);

					context.report({
						node: node.test,
						messageId: 'useIsEmptyUnary',
						data: { collection },
						fix(fixer) {
							const fixes = [fixer.replaceText(node.test, `_.isEmpty(${collection})`)];
							const importFix = ensureLodashImport(fixer);
							if (importFix) fixes.push(importFix);
							return fixes;
						},
					});
				}
			},
		};
	},
});

export default preferIsEmpty;
