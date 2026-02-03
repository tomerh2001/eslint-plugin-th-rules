/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const MAX_TAB_COUNT = 3;

type Options = [
	{
		maximumDestructuredVariables?: number;
		maximumLineLength?: number;
	},
];

type MessageIds = 'tooDeep' | 'tooMany' | 'tooLong' | 'tooManyCumulative';

const noDestructuring = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-destructuring.md')<Options, MessageIds>({
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
					maximumDestructuredVariables: { type: 'integer', minimum: 0 },
					maximumLineLength: { type: 'integer', minimum: 0 },
				},
				additionalProperties: false,
			},
		],
		messages: {
			tooDeep: 'Destructuring at a nesting level above {{max}} is not allowed; found {{actual}} levels of nesting.',
			tooMany: 'Destructuring of more than {{max}} variables is not allowed.',
			tooLong: 'Destructuring spanning a line exceeding {{max}} characters is not allowed.',
			tooManyCumulative: 'Destructuring of more than {{max}} variables from "{{source}}" in the same scope is not allowed; found {{total}}.',
		},
	},

	defaultOptions: [
		{
			maximumDestructuredVariables: 2,
			maximumLineLength: 100,
		},
	],

	create(context, [options]) {
		const maxVariables = options.maximumDestructuredVariables ?? 2;
		const maxLineLength = options.maximumLineLength ?? 100;

		/**
		 * Tracks total destructured properties per initializer expression text per scope node.
		 * WeakMap is used so scopes can be GC'ed and we do not leak memory across files.
		 */
		const totalsByScope = new WeakMap<TSESTree.Node, Map<string, number>>();

		function getLineText(lineNumber: number): string {
			return context.sourceCode.lines[lineNumber - 1] ?? '';
		}

		function getMaxSpannedLineLength(startLine: number, endLine: number): number {
			let max = 0;

			for (let i = startLine; i <= endLine; i++) {
				const line = getLineText(i);
				if (line.length > max) {
					max = line.length;
				}
			}

			return max;
		}

		function getIndentCountForLine(lineNumber: number): number {
			const lineText = getLineText(lineNumber);
			return lineText.search(/\S|$/);
		}

		function getScopeNode(node: TSESTree.Node): TSESTree.Node {
			const ancestors = context.sourceCode.getAncestors(node);

			for (let i = ancestors.length - 1; i >= 0; i--) {
				const a = ancestors[i];

				if (
					a.type === AST_NODE_TYPES.Program ||
					a.type === AST_NODE_TYPES.FunctionDeclaration ||
					a.type === AST_NODE_TYPES.FunctionExpression ||
					a.type === AST_NODE_TYPES.ArrowFunctionExpression ||
					a.type === AST_NODE_TYPES.TSDeclareFunction
				) {
					return a;
				}
			}

			return context.sourceCode.ast;
		}

		function getScopeMap(scopeNode: TSESTree.Node): Map<string, number> {
			const existing = totalsByScope.get(scopeNode);
			if (!_.isNil(existing)) {
				return existing;
			}

			const created = new Map<string, number>();
			totalsByScope.set(scopeNode, created);
			return created;
		}

		function reportIfNeeded(patternNode: TSESTree.Node | undefined, reportNode: TSESTree.Node = patternNode as any): void {
			if (patternNode?.type !== AST_NODE_TYPES.ObjectPattern || _.isNil(patternNode.loc)) {
				return;
			}

			const startLine = patternNode.loc.start.line;
			const endLine = patternNode.loc.end.line;

			const indentCount = getIndentCountForLine(startLine);
			const propertyCount = patternNode.properties?.length ?? 0;
			const maxSpannedLineLength = getMaxSpannedLineLength(startLine, endLine);

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

			if (propertyCount > maxVariables) {
				context.report({
					node: reportNode,
					messageId: 'tooMany',
					data: {
						max: maxVariables,
					},
				});
			}

			if (maxSpannedLineLength > maxLineLength) {
				context.report({
					node: reportNode,
					messageId: 'tooLong',
					data: {
						max: maxLineLength,
					},
				});
			}
		}

		function checkParameters(parameters: TSESTree.Parameter[]): void {
			for (const p of parameters || []) {
				if (_.isNil(p)) {
					continue;
				}

				if (p.type === AST_NODE_TYPES.AssignmentPattern) {
					reportIfNeeded(p.left, p);
					continue;
				}

				reportIfNeeded(p, p);
			}
		}

		function checkCumulativeVariableDeclarator(node: TSESTree.VariableDeclarator): void {
			if (node.id.type !== AST_NODE_TYPES.ObjectPattern) {
				return;
			}

			if (_.isNil(node.init)) {
				return;
			}

			const propertyCount = node.id.properties?.length ?? 0;

			if (propertyCount > maxVariables) {
				return;
			}

			const scopeNode = getScopeNode(node);
			const scopeMap = getScopeMap(scopeNode);

			const sourceText = context.sourceCode.getText(node.init);
			const previousTotal = scopeMap.get(sourceText) ?? 0;
			const newTotal = previousTotal + propertyCount;

			scopeMap.set(sourceText, newTotal);

			if (previousTotal > 0 && newTotal > maxVariables) {
				context.report({
					node,
					messageId: 'tooManyCumulative',
					data: {
						source: sourceText,
						max: maxVariables,
						total: newTotal,
					},
				});
			}
		}

		return {
			VariableDeclarator(node: TSESTree.VariableDeclarator) {
				reportIfNeeded(node.id, node);
				checkCumulativeVariableDeclarator(node);
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
				if (!_.isNil(node.value?.params)) {
					checkParameters(node.value.params);
				}
			},

			TSDeclareFunction(node: any) {
				if (!_.isNil(node.params)) {
					checkParameters(node.params);
				}
			},
		};
	},
});

export default noDestructuring;
