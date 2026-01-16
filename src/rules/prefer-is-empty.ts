/* eslint-disable new-cap */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import {AST_NODE_TYPES, ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

const preferIsEmpty = ESLintUtils.RuleCreator(() =>
	'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-is-empty.md')({
	name: 'prefer-is-empty',

	meta: {
		type: 'problem',
		docs: {
			description: 'Require _.isEmpty instead of length comparisons.',
		},
		hasSuggestions: true,
		schema: [],
		messages: {
			useIsEmpty:
        'Use _.isEmpty({{collection}}) instead of checking {{collection}}.length {{operator}} {{value}}.',
		},
	},

	defaultOptions: [],

	create(context) {
		function isLengthAccess(node: TSESTree.Node | undefined | undefined): node is TSESTree.MemberExpression {
			return (
				node?.type === AST_NODE_TYPES.MemberExpression
				&& node.property.type === AST_NODE_TYPES.Identifier
				&& node.property.name === 'length'
				&& !node.computed
			);
		}

		function isNumericLiteral(node: TSESTree.Node | undefined | undefined): node is TSESTree.Literal & {value: number} {
			return (
				node?.type === AST_NODE_TYPES.Literal
				&& typeof node.value === 'number'
			);
		}

		function report(
			node: TSESTree.BinaryExpression,
			collectionNode: TSESTree.MemberExpression,
			operator: string,
			value: number,
			isEmptyCheck: boolean,
		) {
			const collectionText = context.sourceCode.getText(collectionNode.object);
			const replacement = isEmptyCheck
				? `_.isEmpty(${collectionText})`
				: `!_.isEmpty(${collectionText})`;

			context.report({
				node,
				messageId: 'useIsEmpty',
				data: {
					collection: collectionText,
					operator,
					value,
				},
				suggest: [
					{
						messageId: 'useIsEmpty',
						data: {
							collection: collectionText,
							operator,
							value,
						},
						fix(fixer) {
							return fixer.replaceText(node, replacement);
						},
					},
				],
			});
		}

		return {
			BinaryExpression(node: TSESTree.BinaryExpression) {
				if (isLengthAccess(node.left) && isNumericLiteral(node.right)) {
					if (
						(node.operator === '===' && node.right.value === 0)
						|| (node.operator === '<=' && node.right.value === 0)
						|| (node.operator === '<' && node.right.value === 1)
					) {
						report(node, node.left, node.operator, node.right.value, true);
						return;
					}

					if (
						(node.operator === '>' && node.right.value === 0)
						|| (node.operator === '>=' && node.right.value === 1)
						|| ((node.operator === '!=' || node.operator === '!==') && node.right.value === 0)
					) {
						report(node, node.left, node.operator, node.right.value, false);
					}
				}

				if (isNumericLiteral(node.left) && isLengthAccess(node.right)) {
					if (
						(node.operator === '===' && node.left.value === 0)
						|| (node.operator === '>=' && node.left.value === 0)
						|| (node.operator === '>' && node.left.value === 0)
					) {
						report(node, node.right, node.operator, node.left.value, true);
						return;
					}

					if (
						(node.operator === '<' && node.left.value === 1)
						|| (node.operator === '<=' && node.left.value === 0)
					) {
						report(node, node.right, node.operator, node.left.value, false);
					}
				}
			},
		};
	},
});
export default preferIsEmpty;
