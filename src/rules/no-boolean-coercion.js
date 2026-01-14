const meta = {
	type: 'problem',
	docs: {
		description:
			'Disallow Boolean(variable) or !!variable and enforce explicit _.isNil / _.isEmpty checks',
		category: 'Best Practices',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-boolean-coercion.md',
	},
	hasSuggestions: true,
	schema: [],
};

function create(context) {
	const sourceCode = context.getSourceCode();
	const services = context.parserServices;
	const checker = services?.program?.getTypeChecker?.();

	function isBooleanCall(node) {
		return (
			node.type === 'CallExpression'
			&& node.callee.type === 'Identifier'
			&& node.callee.name === 'Boolean'
			&& node.arguments.length === 1
		);
	}

	function isDoubleNegation(node) {
		return (
			node.type === 'UnaryExpression'
			&& node.operator === '!'
			&& node.argument?.type === 'UnaryExpression'
			&& node.argument.operator === '!'
		);
	}

	function isCollectionLikeByTS(node) {
		if (!checker || !services?.esTreeNodeToTSNodeMap) {
			return false;
		}

		const tsNode = services.esTreeNodeToTSNodeMap.get(node);
		if (!tsNode) {
			return false;
		}

		const type = checker.getTypeAtLocation(tsNode);

		const typeString = checker.typeToString(type);

		return (
			typeString.includes('[]')
			|| typeString === 'string'
			|| typeString === 'object'
			|| typeString.startsWith('Array<')
			|| typeString.startsWith('ReadonlyArray<')
		);
	}

	function isCollectionLikeBySyntax(node) {
		return (
			node.type === 'ArrayExpression'
			|| node.type === 'ObjectExpression'
			|| node.type === 'Literal' && typeof node.value === 'string'
		);
	}

	function report(node, valueNode) {
		const isCollection
			= isCollectionLikeBySyntax(valueNode)
				|| isCollectionLikeByTS(valueNode);

		const suggestedFn = isCollection ? '_.isEmpty' : '_.isNil';
		const replacement = `${suggestedFn}(${sourceCode.getText(valueNode)})`;

		context.report({
			node,
			message:
				'Boolean coercion is not allowed. Use an explicit null/empty check instead.',
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
		CallExpression(node) {
			if (!isBooleanCall(node)) {
				return;
			}

			const arg = node.arguments[0];
			if (!arg) {
				return;
			}

			report(node, arg);
		},

		UnaryExpression(node) {
			if (!isDoubleNegation(node)) {
				return;
			}

			const valueNode = node.argument.argument;
			if (!valueNode) {
				return;
			}

			report(node, valueNode);
		},
	};
}

module.exports = {meta, create};
