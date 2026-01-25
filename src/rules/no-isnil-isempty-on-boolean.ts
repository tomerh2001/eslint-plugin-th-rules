/* eslint-disable no-bitwise */
/* eslint-disable new-cap */

import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import * as ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-isnil-isempty-on-boolean.md');

const LODASH_IDENT = '_';
const DISALLOWED_METHODS = new Set(['isNil', 'isEmpty']);

const noIsNilOrIsEmptyOnBoolean = createRule({
	name: 'no-isnil-isempty-on-boolean',

	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow _.isNil(...) / _.isEmpty(...) when the argument type is boolean or a union containing boolean (e.g., boolean | undefined, boolean | X).',
		},
		schema: [],
		messages: {
			noBoolean: 'Do not use _.{{method}}(...) on boolean or unions containing boolean. Use explicit boolean checks/comparisons instead.',
		},
	},

	defaultOptions: [],

	create(context) {
		const services = ESLintUtils.getParserServices(context);
		const checker = services.program.getTypeChecker();

		function unwrapChainExpression(node: TSESTree.Node): TSESTree.Node {
			return node.type === AST_NODE_TYPES.ChainExpression ? node.expression : node;
		}

		function getTypeFromSymbolAnnotation(symbol: ts.Symbol): ts.Type | null {
			const decl = symbol.valueDeclaration ?? symbol.declarations?.[0];
			if (_.isNil(decl)) return null;

			if ('type' in decl) {
				const typeNode = (decl as { type?: ts.TypeNode }).type;
				if (!_.isNil(typeNode)) {
					return checker.getTypeFromTypeNode(typeNode);
				}
			}

			return null;
		}

		function getTsTypeForCheck(node: TSESTree.Node): ts.Type | null {
			const unwrapped = unwrapChainExpression(node);
			const tsNode = services.esTreeNodeToTSNodeMap.get(unwrapped);
			if (_.isNil(tsNode)) return null;

			let type: ts.Type;

			if (unwrapped.type === AST_NODE_TYPES.Identifier) {
				const symbol = checker.getSymbolAtLocation(tsNode);

				const annotated = _.isNil(symbol) ? null : getTypeFromSymbolAnnotation(symbol);

				type = annotated ?? checker.getTypeAtLocation(tsNode);
			} else {
				type = checker.getTypeAtLocation(tsNode);
			}

			return checker.getWidenedType(type);
		}

		function isNullableFlag(flags: ts.TypeFlags): boolean {
			return (flags & ts.TypeFlags.Null) !== 0 || (flags & ts.TypeFlags.Undefined) !== 0;
		}

		function isBooleanLikeFlag(flags: ts.TypeFlags): boolean {
			return (flags & ts.TypeFlags.BooleanLike) !== 0;
		}

		/**
		 * Returns true if the type is boolean-like, or a union containing any boolean-like
		 * non-nullish constituent.
		 */
		function hasBooleanInType(node: TSESTree.Node): boolean {
			const type = getTsTypeForCheck(node);
			if (_.isNil(type)) return false;

			if (!type.isUnion()) {
				const flags = type.getFlags();
				if (isNullableFlag(flags)) return false;
				return isBooleanLikeFlag(flags);
			}

			for (const t of type.types) {
				const flags = t.getFlags();
				if (isNullableFlag(flags)) continue;
				if (isBooleanLikeFlag(flags)) return true;
			}

			return false;
		}

		function isTargetLodashCall(node: TSESTree.CallExpression): { method: 'isNil' | 'isEmpty' } | null {
			if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return null;

			const { callee } = node;

			if (callee.object.type !== AST_NODE_TYPES.Identifier) return null;
			if (callee.object.name !== LODASH_IDENT) return null;

			if (callee.property.type !== AST_NODE_TYPES.Identifier) return null;

			const method = callee.property.name;
			if (!DISALLOWED_METHODS.has(method)) return null;

			return { method: method as 'isNil' | 'isEmpty' };
		}

		return {
			CallExpression(node) {
				const target = isTargetLodashCall(node);
				if (_.isNil(target)) return;

				const [arg] = node.arguments;
				if (_.isNil(arg)) return;

				if (arg.type === AST_NODE_TYPES.SpreadElement) return;

				const expr = arg as unknown as TSESTree.Expression;

				if (!hasBooleanInType(expr)) return;

				context.report({
					node,
					messageId: 'noBoolean',
					data: { method: target.method },
				});
			},
		};
	},
});

export default noIsNilOrIsEmptyOnBoolean;
