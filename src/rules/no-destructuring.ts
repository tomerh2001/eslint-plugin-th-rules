/* eslint-disable new-cap */

import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const MAX_INDENT_SPACES = 3;

type Options = [
	{
		maximumDestructuredVariables?: number;
		maximumLineLength?: number;
		directAccessIdentifiers?: string[];
	},
];

type MessageIds = 'tooDeep' | 'tooMany' | 'tooLong' | 'tooManyCumulative' | 'directAccessRequired';

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
					directAccessIdentifiers: {
						type: 'array',
						items: { type: 'string', minLength: 1 },
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			tooDeep: 'Destructuring at an indentation above {{max}} is not allowed; found {{actual}}.',
			tooMany: 'Destructuring of more than {{max}} variables is not allowed.',
			tooLong: 'Destructuring spanning a line exceeding {{max}} characters is not allowed.',
			tooManyCumulative: 'Too many destructured variables from "{{source}}" in the same scope. Max is {{max}}, total is {{total}}.',
			directAccessRequired: 'Do not destructure from "{{identifier}}". Use direct member access, for example {{identifier}}.onChangeText.',
		},
	},

	defaultOptions: [
		{
			maximumDestructuredVariables: 2,
			maximumLineLength: 100,
			directAccessIdentifiers: ['properties'],
		},
	],

	create(context, [options]) {
		const maxVariables = options.maximumDestructuredVariables ?? 2;
		const maxLineLength = options.maximumLineLength ?? 100;
		const directAccessIdentifiers = new Set(options.directAccessIdentifiers ?? ['properties']);

		const sourceTotalsByScope = new WeakMap<TSESTree.Node, Map<string, number>>();

		function getLineText(lineNumber: number): string {
			return context.sourceCode.lines[lineNumber - 1] ?? '';
		}

		function getIndentSpacesForLine(lineNumber: number): number {
			const lineText = getLineText(lineNumber);
			return lineText.search(/\S|$/);
		}

		function getMaxSpannedLineLength(startLine: number, endLine: number): number {
			let max = 0;
			for (let i = startLine; i <= endLine; i++) {
				const text = getLineText(i);
				if (text.length > max) {
					max = text.length;
				}
			}

			return max;
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

		function getOrCreateScopeMap(scope: TSESTree.Node): Map<string, number> {
			const existing = sourceTotalsByScope.get(scope);
			if (!_.isNil(existing)) {
				return existing;
			}

			const created = new Map<string, number>();
			sourceTotalsByScope.set(scope, created);
			return created;
		}

		function isDirectAccessForbiddenInitializer(init: TSESTree.Expression | null | undefined): init is TSESTree.Identifier {
			if (_.isNil(init)) {
				return false;
			}

			return init.type === AST_NODE_TYPES.Identifier && directAccessIdentifiers.has(init.name);
		}

		function reportIfNeeded(patternNode: TSESTree.Node | undefined, reportNode: TSESTree.Node, initExpression?: TSESTree.Expression | null): void {
			if (patternNode?.type !== AST_NODE_TYPES.ObjectPattern || _.isNil(patternNode.loc)) {
				return;
			}

			if (isDirectAccessForbiddenInitializer(initExpression)) {
				context.report({
					node: reportNode,
					messageId: 'directAccessRequired',
					data: { identifier: initExpression.name },
				});
				return;
			}

			const startLine = patternNode.loc.start.line;
			const endLine = patternNode.loc.end.line;

			const indentSpaces = getIndentSpacesForLine(startLine);
			const propertyCount = patternNode.properties?.length ?? 0;
			const maxSpannedLineLength = getMaxSpannedLineLength(startLine, endLine);

			if (indentSpaces > MAX_INDENT_SPACES) {
				context.report({
					node: reportNode,
					messageId: 'tooDeep',
					data: { max: MAX_INDENT_SPACES, actual: indentSpaces },
				});
			}

			if (propertyCount > maxVariables) {
				context.report({
					node: reportNode,
					messageId: 'tooMany',
					data: { max: maxVariables },
				});
			}

			if (maxSpannedLineLength > maxLineLength) {
				context.report({
					node: reportNode,
					messageId: 'tooLong',
					data: { max: maxLineLength },
				});
			}

			if (!_.isNil(initExpression)) {
				const scopeNode = getScopeNode(reportNode);
				const scopeMap = getOrCreateScopeMap(scopeNode);

				const sourceText = context.sourceCode.getText(initExpression);
				const previousTotal = scopeMap.get(sourceText) ?? 0;
				const newTotal = previousTotal + propertyCount;

				scopeMap.set(sourceText, newTotal);

				if (newTotal > maxVariables) {
					context.report({
						node: reportNode,
						messageId: 'tooManyCumulative',
						data: {
							source: sourceText,
							max: maxVariables,
							total: newTotal,
						},
					});
				}
			}
		}

		function checkParameters(parameters: TSESTree.Parameter[]): void {
			for (const p of parameters || []) {
				if (_.isNil(p)) {
					continue;
				}

				if (p.type === AST_NODE_TYPES.AssignmentPattern) {
					reportIfNeeded(p.left, p, undefined);
					continue;
				}

				reportIfNeeded(p, p, undefined);
			}
		}

		return {
			VariableDeclarator(node: TSESTree.VariableDeclarator) {
				reportIfNeeded(node.id, node, node.init);
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

			TSDeclareFunction(node: TSESTree.TSDeclareFunction) {
				if (!_.isNil(node.params)) {
					checkParameters(node.params);
				}
			},
		};
	},
});

export default noDestructuring;
