const meta = {
	type: 'problem',
	docs: {
		description:
			'Disallow implicit truthy/falsy checks on non-boolean values; require _.isNil or _.isEmpty',
		category: 'Best Practices',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-explicit-nil-or-empty-check.md',
	},
	hasSuggestions: true,
	schema: [],
};

function create(context) {
	const sourceCode = context.getSourceCode();

	function isBooleanLiteral(node) {
		return node.type === 'Literal' && typeof node.value === 'boolean';
	}

	function isUnaryNot(node) {
		return node.type === 'UnaryExpression' && node.operator === '!';
	}

	function isImplicitTruthyTarget(node) {
		return (
			node.type === 'Identifier'
			|| node.type === 'MemberExpression'
		);
	}

	function report(node, testedNode, negated) {
		const text = sourceCode.getText(testedNode);

		const isNilExpr = negated
			? `!_.isNil(${text})`
			: `_.isNil(${text})`;

		const isEmptyExpr = negated
			? `!_.isEmpty(${text})`
			: `_.isEmpty(${text})`;

		context.report({
			node,
			message:
				'Implicit truthy/falsy check on a non-boolean value is not allowed; use explicit _.isNil or _.isEmpty checks',
			suggest: [
				{
					desc: `Replace with ${isNilExpr}`,
					fix: fixer => fixer.replaceText(node, isNilExpr),
				},
				{
					desc: `Replace with ${isEmptyExpr}`,
					fix: fixer => fixer.replaceText(node, isEmptyExpr),
				},
			],
		});
	}

	function checkTestExpression(node) {
		// If (dataObject)
		if (isImplicitTruthyTarget(node)) {
			report(node, node, true);
			return;
		}

		// If (!dataObject)
		if (
			isUnaryNot(node)
			&& isImplicitTruthyTarget(node.argument)
			&& !isBooleanLiteral(node.argument)
		) {
			report(node, node.argument, false);
		}
	}

	return {
		IfStatement(node) {
			checkTestExpression(node.test);
		},

		WhileStatement(node) {
			checkTestExpression(node.test);
		},

		DoWhileStatement(node) {
			checkTestExpression(node.test);
		},

		ConditionalExpression(node) {
			checkTestExpression(node.test);
		},

		LogicalExpression(node) {
			if (node.operator === '&&' || node.operator === '||') {
				checkTestExpression(node.left);
			}
		},
	};
}

module.exports = {meta, create};
