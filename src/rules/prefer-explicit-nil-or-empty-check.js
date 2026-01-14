'use strict';

const ts = require('typescript');

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
	requiresTypeChecking: true,
};

function create(context) {
	const sourceCode = context.getSourceCode();
	const {parserServices} = context;

	// Safety: rule is disabled if type info is unavailable
	if (!parserServices?.program || !parserServices.esTreeNodeToTSNodeMap) {
		return {};
	}

	const checker = parserServices.program.getTypeChecker();

	function isImplicitTruthyTarget(node) {
		return (
			node.type === 'Identifier'
			|| node.type === 'MemberExpression'
		);
	}

	function isBooleanType(node) {
		const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
		if (!tsNode) {
			return false;
		}

		const type = checker.getTypeAtLocation(tsNode);

		return (
			(type.flags & ts.TypeFlags.Boolean) !== 0
			|| (type.flags & ts.TypeFlags.BooleanLiteral) !== 0
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
				'Avoid implicit truthy/falsy checks on non-boolean values; use _.isNil or _.isEmpty instead',
			suggest: [
				{
					desc: `Replace with ${isNilExpr}`,
					fix(fixer) {
						return fixer.replaceText(node, isNilExpr);
					},
				},
				{
					desc: `Replace with ${isEmptyExpr}`,
					fix(fixer) {
						return fixer.replaceText(node, isEmptyExpr);
					},
				},
			],
		});
	}

	return {
		IfStatement(node) {
			const {test} = node;

			// If (!value)
			if (test.type === 'UnaryExpression' && test.operator === '!') {
				const arg = test.argument;

				if (!isImplicitTruthyTarget(arg)) {
					return;
				}

				if (isBooleanType(arg)) {
					return;
				}

				report(test, arg, true);
				return;
			}

			// If (value)
			if (isImplicitTruthyTarget(test)) {
				if (isBooleanType(test)) {
					return;
				}

				report(test, test, false);
			}
		},
	};
}

module.exports = {meta, create};
