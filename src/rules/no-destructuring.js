const MAX_TAB_COUNT = 3;

const meta = {
	type: 'problem',
	docs: {
		description: 'Disallow destructuring that does not meet certain conditions',
		category: 'Possible Errors',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-destructuring.md',
	},
	schema: [
		{
			type: 'object',
			properties: {
				maximumDestructuredVariables: {type: 'integer', minimum: 0},
				maximumLineLength: {type: 'integer', minimum: 0},
			},
			additionalProperties: false,
		},
	],
};

function create(context) {
	const MAX_VARIABLES = context?.options?.[0]?.maximumDestructuredVariables ?? 2;
	const MAX_LINE_LENGTH = context?.options?.[0]?.maximumLineLength ?? 100;

	const sourceCode = context.getSourceCode();

	function reportIfNeeded(patternNode, reportNode = patternNode) {
		if (!patternNode || patternNode.type !== 'ObjectPattern' || !patternNode.loc) {
			return;
		}

		const lineText = sourceCode.lines[patternNode.loc.start.line - 1] ?? '';
		const indentCount = lineText.search(/\S|$/);

		const propertyCount = patternNode.properties?.length ?? 0;

		const startLine = patternNode.loc.start.line;
		const endLine = patternNode.loc.end.line;
		let maxSpannedLineLength = 0;
		for (let i = startLine; i <= endLine; i++) {
			const t = sourceCode.lines[i - 1] ?? '';
			if (t.length > maxSpannedLineLength) {
				maxSpannedLineLength = t.length;
			}
		}

		if (indentCount > MAX_TAB_COUNT) {
			context.report({
				node: reportNode,
				message: `destructuring at a nesting level above ${MAX_TAB_COUNT} is not allowed, instead saw ${indentCount} levels of nesting`,
			});
		}

		if (propertyCount > MAX_VARIABLES) {
			context.report({
				node: reportNode,
				message: `destructuring of more than ${MAX_VARIABLES} variables is not allowed`,
			});
		}

		if (maxSpannedLineLength > MAX_LINE_LENGTH) {
			context.report({
				node: reportNode,
				message: `destructuring on a line exceeding ${MAX_LINE_LENGTH} characters is not allowed`,
			});
		}
	}

	function checkParameters(parameters) {
		for (const p of parameters || []) {
			if (!p) {
				continue;
			}

			if (p.type === 'AssignmentPattern') {
				reportIfNeeded(p.left, p);
				continue;
			}

			reportIfNeeded(p, p);
		}
	}

	return {

		VariableDeclarator(node) {
			reportIfNeeded(node?.id, node);
		},

		FunctionDeclaration(node) {
			checkParameters(node.params);
		},
		FunctionExpression(node) {
			checkParameters(node.params);
		},
		ArrowFunctionExpression(node) {
			checkParameters(node.params);
		},

		MethodDefinition(node) {
			if (node?.value?.params) {
				checkParameters(node.value.params);
			}
		},

		TSDeclareFunction(node) {
			checkParameters(node.params);
		},
	};
}

module.exports = {meta, create};
