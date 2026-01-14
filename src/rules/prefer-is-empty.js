const meta = {
	type: 'problem',
	docs: {
		description: 'Require _.isEmpty instead of length comparisons',
		category: 'Best Practices',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-is-empty.md',
	},
	hasSuggestions: true,
	schema: [],
};

function create(context) {
	const sourceCode = context.getSourceCode();

	function isLengthAccess(node) {
		return (
			node
			&& node.type === 'MemberExpression'
			&& !node.computed
			&& node.property.type === 'Identifier'
			&& node.property.name === 'length'
		);
	}

	function isNumericLiteral(node) {
		return node && node.type === 'Literal' && typeof node.value === 'number';
	}

	function report(node, collectionNode, operator, value, isEmptyCheck) {
		const collectionText = sourceCode.getText(collectionNode.object);
		const replacement = isEmptyCheck
			? `_.isEmpty(${collectionText})`
			: `!_.isEmpty(${collectionText})`;

		context.report({
			node,
			message: `Use _.isEmpty(${collectionText}) instead of checking ${collectionText}.length ${operator} ${value}`,
			suggest: [
				{
					desc: `Replace with ${replacement}`,
					fix(fixer) {
						return fixer.replaceText(node, replacement);
					},
				},
			],
		});
	}

	return {
		BinaryExpression(node) {
			const {left, right, operator} = node;

			// Values.length <op> N
			if (isLengthAccess(left) && isNumericLiteral(right)) {
				const {value} = right;

				// EMPTY checks
				if (
					(operator === '===' && value === 0)
					|| (operator === '<=' && value === 0)
					|| (operator === '<' && value === 1)
				) {
					report(node, left, operator, value, true);
					return;
				}

				// NOT EMPTY checks
				if (
					(operator === '>' && value === 0)
					|| (operator === '>=' && value === 1)
					|| ((operator === '!=' || operator === '!==') && value === 0)
				) {
					report(node, left, operator, value, false);
				}
			}

			// N <op> values.length (reversed)
			if (isNumericLiteral(left) && isLengthAccess(right)) {
				const {value} = left;

				// EMPTY checks
				if (
					(operator === '===' && value === 0)
					|| (operator === '>=' && value === 0)
					|| (operator === '>' && value === 0)
				) {
					report(node, right, operator, value, true);
					return;
				}

				// NOT EMPTY checks
				if (
					(operator === '<' && value === 1)
					|| (operator === '<=' && value === 0)
				) {
					report(node, right, operator, value, false);
				}
			}
		},
	};
}

module.exports = {meta, create};
