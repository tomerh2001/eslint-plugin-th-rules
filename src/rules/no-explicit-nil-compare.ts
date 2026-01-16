/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-explicit-nil-compare.md');

const noExplicitNilCompare = createRule({
	name: 'no-explicit-nil-compare',
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow direct comparisons to null or undefined. Use _.isNull(x) / _.isUndefined(x) instead.',
		},
		hasSuggestions: true,
		schema: [],
		messages: {
			useIsNull: 'Use _.isNull({{value}}) instead of comparing directly to null.',
			useIsUndefined: 'Use _.isUndefined({{value}}) instead of comparing directly to undefined.',
		},
	},
	defaultOptions: [],
	create(context) {
		/** Ensures lodash import exists */
		function ensureLodashImport(fixer: any) {
			const existingImport = context.sourceCode.ast.body.find((node: TSESTree.Node) => node.type === AST_NODE_TYPES.ImportDeclaration && node.source.value === 'lodash');

			if (existingImport) return null;

			return fixer.insertTextBeforeRange([0, 0], `import _ from 'lodash';\n`);
		}

		function isNullLiteral(node: TSESTree.Node): node is TSESTree.Literal {
			return node.type === AST_NODE_TYPES.Literal && node.value === null;
		}

		function isUndefinedIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
			return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
		}

		function reportComparison(node: TSESTree.BinaryExpression, left: TSESTree.Node, right: TSESTree.Node) {
			let targetNode: TSESTree.Expression | undefined;
			let isNull = false;

			const isNegated = node.operator === '!=' || node.operator === '!==';

			if (isNullLiteral(right)) {
				targetNode = left as TSESTree.Expression;
				isNull = true;
			} else if (isNullLiteral(left)) {
				targetNode = right as TSESTree.Expression;
				isNull = true;
			} else if (isUndefinedIdentifier(right)) {
				targetNode = left as TSESTree.Expression;
			} else if (isUndefinedIdentifier(left)) {
				targetNode = right as TSESTree.Expression;
			}

			if (!targetNode) return;

			const text = context.sourceCode.getText(targetNode);

			const positive = isNull ? `_.isNull(${text})` : `_.isUndefined(${text})`;
			const replacement = isNegated ? `!${positive}` : positive;

			context.report({
				node,
				messageId: isNull ? 'useIsNull' : 'useIsUndefined',
				data: { value: text },
				suggest: [
					{
						messageId: isNull ? 'useIsNull' : 'useIsUndefined',
						data: { value: text },
						fix(fixer) {
							const fixes = [];

							const importFix = ensureLodashImport(fixer);
							if (importFix) fixes.push(importFix);

							fixes.push(fixer.replaceText(node, replacement));

							return fixes;
						},
					},
				],
			});
		}

		return {
			BinaryExpression(node: TSESTree.BinaryExpression) {
				if (!['==', '===', '!=', '!=='].includes(node.operator)) return;

				reportComparison(node, node.left, node.right);
			},
		};
	},
});

export default noExplicitNilCompare;
