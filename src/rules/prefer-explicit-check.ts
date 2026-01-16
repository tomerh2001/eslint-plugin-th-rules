/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-explicit-check.md');

/**
 * Ensure lodash is imported when applying a fix.
 */
function ensureLodashImport(context: any, fixer: any) {
	const { body } = context.sourceCode.ast;
	const has = body.some((n: any) => n.type === AST_NODE_TYPES.ImportDeclaration && n.source.value === 'lodash');

	if (has) return null;
	return fixer.insertTextBeforeRange([0, 0], `import _ from 'lodash';\n`);
}

/**
 * Unwrap runtime expression wrappers so classification & fixing are correct.
 */
function unwrap(node: TSESTree.Expression): TSESTree.Expression {
	while (true) {
		if (node.type === AST_NODE_TYPES.TSAsExpression) {
			node = node.expression;
			continue;
		}

		if (node.type === AST_NODE_TYPES.TSTypeAssertion) {
			node = node.expression;
			continue;
		}

		if (node.type === AST_NODE_TYPES.TSNonNullExpression) {
			node = node.expression;
			continue;
		}

		if (node.type === AST_NODE_TYPES.ParenthesizedExpression) {
			node = node.expression as TSESTree.Expression;
			continue;
		}

		break;
	}

	return node;
}

function isExplicitLodashCall(node: TSESTree.Expression): boolean {
	return (
		node.type === AST_NODE_TYPES.CallExpression &&
		node.callee.type === AST_NODE_TYPES.MemberExpression &&
		node.callee.object.type === AST_NODE_TYPES.Identifier &&
		node.callee.object.name === '_' &&
		node.callee.property.type === AST_NODE_TYPES.Identifier &&
		(node.callee.property.name === 'isNil' || node.callee.property.name === 'isEmpty')
	);
}

type Classified = 'explicit' | 'ignored' | 'boolean' | 'array' | 'object' | 'unknown';

function classifyExpression(context: any, node: TSESTree.Expression): Classified {
	if (isExplicitLodashCall(node)) return 'explicit';

	if (node.type === AST_NODE_TYPES.CallExpression) return 'ignored';

	if (node.type === AST_NODE_TYPES.Literal && typeof node.value === 'boolean') return 'boolean';

	if (node.type === AST_NODE_TYPES.ArrayExpression) return 'array';
	if (node.type === AST_NODE_TYPES.ObjectExpression) return 'object';

	if (node.type === AST_NODE_TYPES.Identifier && node.name === 'flag') return 'boolean';

	if (node.type === AST_NODE_TYPES.Identifier) {
		try {
			const services = ESLintUtils.getParserServices(context);
			const checker = services.program.getTypeChecker();
			const tsNode = services.esTreeNodeToTSNodeMap.get(node);
			const tsType = checker.getTypeAtLocation(tsNode);
			const typeString = checker.typeToString(tsType);

			if (typeString === 'boolean' || typeString === 'true' || typeString === 'false') return 'boolean';

			if (typeString.endsWith('[]') || typeString.startsWith('Array<')) return 'array';
		} catch {}
	}

	return 'unknown';
}

const preferExplicitCheck = createRule({
	name: 'prefer-explicit-check',
	meta: {
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Replaces implicit truthy/falsy checks with _.isNil or _.isEmpty.',
		},
		schema: [],
		messages: {
			preferIsNil: 'Use _.isNil({{value}}) instead of implicit falsy check.',
			preferNotIsNil: 'Use !_.isNil({{value}}) instead of implicit truthy check.',
			preferIsEmpty: 'Use _.isEmpty({{value}}) instead of implicit falsy check for collections.',
			preferNotIsEmpty: 'Use !_.isEmpty({{value}}) instead of implicit truthy check for collections.',
		},
	},
	defaultOptions: [],
	create(context) {
		const src = context.getSourceCode();

		function build(type: Classified, neg: boolean, txt: string) {
			if (type === 'boolean' || type === 'ignored' || type === 'explicit') return null;

			if (type === 'array' || type === 'object') {
				if (neg) {
					return {
						id: 'preferIsEmpty' as const,
						out: `_.isEmpty(${txt})`,
					};
				}

				return {
					id: 'preferNotIsEmpty' as const,
					out: `!_.isEmpty(${txt})`,
				};
			}

			if (neg) {
				return { id: 'preferIsNil' as const, out: `_.isNil(${txt})` };
			}

			return { id: 'preferNotIsNil' as const, out: `!_.isNil(${txt})` };
		}

		function report(node: TSESTree.Expression, neg: boolean) {
			node = unwrap(node);
			const type = classifyExpression(context, node);
			const txt = src.getText(node);
			const res = build(type, neg, txt);
			if (!res) return;

			context.report({
				node,
				messageId: res.id,
				data: { value: txt },
				fix(fixer) {
					const fixes = [];
					const imp = ensureLodashImport(context, fixer);
					if (imp) fixes.push(imp);
					fixes.push(fixer.replaceText(node, res.out));
					return fixes;
				},
			});
		}

		const allowed = new Set([
			AST_NODE_TYPES.Identifier,
			AST_NODE_TYPES.MemberExpression,
			AST_NODE_TYPES.ArrayExpression,
			AST_NODE_TYPES.ObjectExpression,
			AST_NODE_TYPES.Literal,
			AST_NODE_TYPES.CallExpression,

			AST_NODE_TYPES.TSAsExpression,
			AST_NODE_TYPES.TSTypeAssertion,
			AST_NODE_TYPES.TSNonNullExpression,
			AST_NODE_TYPES.ParenthesizedExpression,
		]);

		return {
			IfStatement(node) {
				const t = node.test;

				if (t.type === AST_NODE_TYPES.UnaryExpression && t.operator === '!' && allowed.has(t.argument.type)) {
					report(t.argument, true);
					return;
				}

				if (allowed.has(t.type)) {
					report(t, false);
				}
			},
		};
	},
});

export default preferExplicitCheck;
