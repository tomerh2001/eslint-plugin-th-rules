const meta = {
	type: 'problem',
	docs: {
		description: 'Require _.isEmpty instead of length comparisons',
		category: 'Best Practices',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-is-empty.md',
	},
	schema: [],
};

function create(context) {
	function isLengthAccess(node) {
		return (
			node
			&& node.type === 'MemberExpression'
			&& !node.computed
			&& node.property.type === 'Identifier'
			&& node.property.name === 'length'
		);
	}

	function isZeroOrOneLiteral(node) {
		return (
			node
			&& node.type === 'Literal'
			&& (node.value === 0 || node.value === 1)
		);
	}

	function report(node, collectionNode, operator, literalValue) {
		const sourceCode = context.getSourceCode();
		const collectionText = sourceCode.getText(collectionNode.object);

		context.report({
			node,
			message: `Use _.isEmpty(${collectionText}) instead of checking ${collectionText}.length ${operator} ${literalValue}`,
		});
	}

	return {
		BinaryExpression(node) {
			const {left, right, operator} = node;

			if (
				(operator === '>' || operator === '>=')
				&& isLengthAccess(left)
				&& isZeroOrOneLiteral(right)
			) {
				report(node, left, operator, right.value);
				return;
			}

			if (
				(operator === '!=' || operator === '!==')
				&& isLengthAccess(left)
				&& right?.type === 'Literal'
				&& right.value === 0
			) {
				report(node, left, operator, 0);
			}
		},
	};
}

module.exports = {meta, create};
