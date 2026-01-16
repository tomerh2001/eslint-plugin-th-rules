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

		function isLengthAccess(node: TSESTree.Node | undefined): node is TSESTree.MemberExpression {
			return !_.isNil(node) && node.type === AST_NODE_TYPES.MemberExpression && node.property.type === AST_NODE_TYPES.Identifier && node.property.name === 'length' && !node.computed;
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
					if ((node.operator === '===' && node.right.value === 0) || (node.operator === '<=' && node.right.value === 0) || (node.operator === '<' && node.right.value === 1)) {
						reportBinary(node, node.left, node.operator, node.right.value, true);
						return;
					}

					if (
						(node.operator === '>' && node.right.value === 0) ||
						(node.operator === '>=' && node.right.value === 1) ||
						((node.operator === '!=' || node.operator === '!==') && node.right.value === 0)
					) {
						reportBinary(node, node.left, node.operator, node.right.value, false);
					}
				}

				if (isNumericLiteral(node.left) && isLengthAccess(node.right)) {
					if ((node.operator === '===' && node.left.value === 0) || (node.operator === '>=' && node.left.value === 0) || (node.operator === '>' && node.left.value === 0)) {
						reportBinary(node, node.right, node.operator, node.left.value, true);
						return;
					}

					if ((node.operator === '<' && node.left.value === 1) || (node.operator === '<=' && node.left.value === 0)) {
						reportBinary(node, node.right, node.operator, node.left.value, false);
					}
				}
			},

			UnaryExpression(node) {
				if (node.operator !== '!') return;
				if (isLengthAccess(node.argument)) {
					reportUnary(node, node.argument);
				}
			},
		};
	},
});

export default preferIsEmpty;
