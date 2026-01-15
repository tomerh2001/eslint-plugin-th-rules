import {ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

const MAX_TAB_COUNT = 3;

export default ESLintUtils.RuleCreator(() =>
	'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-destructuring.md')({
	name: 'no-destructuring',

	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow destructuring that does not meet certain conditions.',
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
		messages: {
			tooDeep:
        'Destructuring at a nesting level above {{max}} is not allowed; found {{actual}} levels of nesting.',
			tooMany:
        'Destructuring of more than {{max}} variables is not allowed.',
			tooLong:
        'Destructuring spanning a line exceeding {{max}} characters is not allowed.',
		},
	},

	defaultOptions: [
		{
			maximumDestructuredVariables: 2,
			maximumLineLength: 100,
		},
	],

	create(context, [options]) {
		const MAX_VARIABLES = options.maximumDestructuredVariables ?? 2;

		const MAX_LINE_LENGTH = options.maximumLineLength ?? 100;

		const sourceCode = context.getSourceCode();

		function reportIfNeeded(
			patternNode: TSESTree.Node | undefined,
			reportNode: TSESTree.Node = patternNode as any,
		): void {
			if (
				patternNode?.type !== 'ObjectPattern'
				|| !patternNode.loc
			) {
				return;
			}

			const startLine = patternNode.loc.start.line;
			const endLine = patternNode.loc.end.line;

			const lineText
        = sourceCode.lines[startLine - 1] ?? '';

			const indentCount = lineText.search(/\S|$/);

			const propertyCount
        = (patternNode).properties
        	?.length ?? 0;

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
					messageId: 'tooDeep',
					data: {
						max: MAX_TAB_COUNT,
						actual: indentCount,
					},
				});
			}

			if (propertyCount > MAX_VARIABLES) {
				context.report({
					node: reportNode,
					messageId: 'tooMany',
					data: {
						max: MAX_VARIABLES,
					},
				});
			}

			if (maxSpannedLineLength > MAX_LINE_LENGTH) {
				context.report({
					node: reportNode,
					messageId: 'tooLong',
					data: {
						max: MAX_LINE_LENGTH,
					},
				});
			}
		}

		function checkParameters(parameters: TSESTree.Parameter[]): void {
			for (const p of parameters || []) {
				if (!p) {
					continue;
				}

				// (...args = {}) pattern
				if (p.type === 'AssignmentPattern') {
					reportIfNeeded(p.left, p);
					continue;
				}

				reportIfNeeded(p, p);
			}
		}

		return {
			VariableDeclarator(node: TSESTree.VariableDeclarator) {
				reportIfNeeded(node.id, node);
			},

			FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
				checkParameters(node.params);
			},

			FunctionExpression(node: TSESTree.FunctionExpression) {
				checkParameters(node.params);
			},

			ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression) {
				checkParameters(node.params);
			},

			MethodDefinition(node: TSESTree.MethodDefinition) {
				if (node.value?.params) {
					checkParameters(node.value.params);
				}
			},

			TSDeclareFunction(node: any) {
				if (node.params) {
					checkParameters(node.params);
				}
			},
		};
	},
});
