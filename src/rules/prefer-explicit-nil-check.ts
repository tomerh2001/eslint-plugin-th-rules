/* eslint-disable no-bitwise */
/* eslint-disable new-cap */

import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import type { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import * as ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-explicit-nil-check.md');

const LODASH_MODULE = 'lodash';
const LODASH_IDENT = '_';

type InspectMode = 'test' | 'shortCircuit' | 'value';

const preferExplicitNilCheck = createRule({
	name: 'prefer-explicit-nil-check',

	meta: {
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Disallow implicit truthy/falsy checks in boolean-test positions. Prefer explicit _.isNil(value) or _.isEmpty(value) (depending on the value type).',
		},
		schema: [],
		messages: {
			useIsNil: 'Implicit truthy/falsy checks are not allowed. Use _.isNil(value) / !_.isNil(value) or _.isEmpty(value) / !_.isEmpty(value).',
		},
	},

	defaultOptions: [],

	create(context) {
		const services = ESLintUtils.getParserServices(context);
		const checker = services.program.getTypeChecker();

		const reported = new WeakSet<TSESTree.Node>();

		let lodashImportFixAdded = false;

		function hasLodashImport(): boolean {
			return context.sourceCode.ast.body.some((node) => node.type === AST_NODE_TYPES.ImportDeclaration && node.source.value === LODASH_MODULE);
		}

		function getLodashImportFixer(fixer: RuleFixer) {
			if (hasLodashImport()) return null;
			if (lodashImportFixAdded) return null;

			lodashImportFixAdded = true;

			const firstNode = context.sourceCode.ast.body[0];
			const importText = `import ${LODASH_IDENT} from '${LODASH_MODULE}';\n`;

			if (_.isNil(firstNode)) {
				return fixer.insertTextAfterRange([0, 0], importText);
			}

			return fixer.insertTextBefore(firstNode, importText);
		}

		function unwrapChainExpression(node: TSESTree.Node): TSESTree.Node {
			if (node.type === AST_NODE_TYPES.ChainExpression) return node.expression;
			return node;
		}

		function getTsType(node: TSESTree.Node): ts.Type | null {
			const unwrapped = unwrapChainExpression(node);
			const tsNode = services.esTreeNodeToTSNodeMap.get(unwrapped);
			if (_.isNil(tsNode)) return null;
			return checker.getTypeAtLocation(tsNode);
		}

		function isNullableFlag(flags: ts.TypeFlags): boolean {
			return (flags & ts.TypeFlags.Null) !== 0 || (flags & ts.TypeFlags.Undefined) !== 0;
		}

		function isStringLikeFlag(flags: ts.TypeFlags): boolean {
			return (flags & ts.TypeFlags.StringLike) !== 0;
		}

		function isNumberLikeFlag(flags: ts.TypeFlags): boolean {
			return (flags & ts.TypeFlags.NumberLike) !== 0;
		}

		function isBooleanLikeFlag(flags: ts.TypeFlags): boolean {
			return (flags & ts.TypeFlags.BooleanLike) !== 0;
		}

		/**
		 * Returns true iff the expression type is effectively:
		 *   string | null | undefined
		 * (i.e., all non-nullish constituents are string/string-like).
		 */
		function isStringByTS(node: TSESTree.Node): boolean {
			const type = getTsType(node);
			if (_.isNil(type)) return false;

			if (!type.isUnion()) {
				return isStringLikeFlag(type.getFlags());
			}

			let sawNonNullish = false;

			for (const t of type.types) {
				const flags = t.getFlags();
				if (isNullableFlag(flags)) continue;

				sawNonNullish = true;

				if (!isStringLikeFlag(flags)) return false;
			}

			return sawNonNullish;
		}

		/**
		 * Returns true iff the expression type is effectively:
		 *   number | null | undefined
		 *
		 * We intentionally DO NOT auto-fix numeric truthy/falsy checks because
		 * converting `if (n)` into `!_.isNil(n)` changes semantics for `0`.
		 */
		function isNumberByTS(node: TSESTree.Node): boolean {
			const type = getTsType(node);
			if (_.isNil(type)) return false;

			if (!type.isUnion()) {
				return isNumberLikeFlag(type.getFlags());
			}

			let sawNonNullish = false;

			for (const t of type.types) {
				const flags = t.getFlags();
				if (isNullableFlag(flags)) continue;

				sawNonNullish = true;

				if (!isNumberLikeFlag(flags)) return false;
			}

			return sawNonNullish;
		}

		/**
		 * Returns true iff the expression type is effectively:
		 *   boolean | null | undefined
		 * (i.e., all non-nullish constituents are boolean/boolean-literal).
		 *
		 * This ensures we do NOT rewrite checks like:
		 * - boolean | undefined
		 * - boolean | null
		 * - boolean | null | undefined
		 */
		function isBooleanByTS(node: TSESTree.Node): boolean {
			const type = getTsType(node);
			if (_.isNil(type)) return false;

			if (!type.isUnion()) {
				return isBooleanLikeFlag(type.getFlags());
			}

			let sawNonNullish = false;

			for (const t of type.types) {
				const flags = t.getFlags();
				if (isNullableFlag(flags)) continue;

				sawNonNullish = true;

				if (!isBooleanLikeFlag(flags)) return false;
			}

			return sawNonNullish;
		}

		function isAlreadyExplicitCheck(node: TSESTree.Node): boolean {
			return (
				node.type === AST_NODE_TYPES.CallExpression &&
				node.callee.type === AST_NODE_TYPES.MemberExpression &&
				node.callee.object.type === AST_NODE_TYPES.Identifier &&
				node.callee.object.name === LODASH_IDENT &&
				node.callee.property.type === AST_NODE_TYPES.Identifier &&
				(node.callee.property.name === 'isNil' || node.callee.property.name === 'isEmpty')
			);
		}

		function isImplicitOperand(node: TSESTree.Node): boolean {
			if (node.type === AST_NODE_TYPES.Identifier) return true;
			if (node.type === AST_NODE_TYPES.MemberExpression) return true;
			if (node.type === AST_NODE_TYPES.ChainExpression) {
				return node.expression.type === AST_NODE_TYPES.MemberExpression;
			}

			return false;
		}

		function reportFull(node: TSESTree.Node, replacement: string) {
			if (reported.has(node)) return;
			reported.add(node);

			context.report({
				node,
				messageId: 'useIsNil',
				fix(fixer) {
					const fixes = [fixer.replaceText(node, replacement)];
					const importFix = getLodashImportFixer(fixer);
					if (!_.isNil(importFix)) fixes.push(importFix);
					return fixes;
				},
			});
		}

		function transformTruthy(node: TSESTree.Node) {
			if (isNumberByTS(node)) return;

			const text = context.sourceCode.getText(node);

			if (isStringByTS(node)) {
				reportFull(node, `!${LODASH_IDENT}.isEmpty(${text})`);
				return;
			}

			reportFull(node, `!${LODASH_IDENT}.isNil(${text})`);
		}

		function transformFalsyUnary(node: TSESTree.UnaryExpression) {
			const arg = node.argument;

			if (isNumberByTS(arg)) return;

			const text = context.sourceCode.getText(arg);

			if (isStringByTS(arg)) {
				reportFull(node, `${LODASH_IDENT}.isEmpty(${text})`);
				return;
			}

			reportFull(node, `${LODASH_IDENT}.isNil(${text})`);
		}

		function expressionHasSideEffects(node: TSESTree.Expression): boolean {
			switch (node.type) {
				case AST_NODE_TYPES.CallExpression:
				case AST_NODE_TYPES.NewExpression:
				case AST_NODE_TYPES.AssignmentExpression:
				case AST_NODE_TYPES.UpdateExpression:
				case AST_NODE_TYPES.AwaitExpression:
				case AST_NODE_TYPES.YieldExpression:
				case AST_NODE_TYPES.ImportExpression:
				case AST_NODE_TYPES.TaggedTemplateExpression: {
					return true;
				}

				case AST_NODE_TYPES.SequenceExpression: {
					return node.expressions.some(expressionHasSideEffects);
				}

				case AST_NODE_TYPES.UnaryExpression: {
					return node.operator === 'delete';
				}

				case AST_NODE_TYPES.ConditionalExpression: {
					return expressionHasSideEffects(node.test) || expressionHasSideEffects(node.consequent) || expressionHasSideEffects(node.alternate);
				}

				case AST_NODE_TYPES.LogicalExpression: {
					return expressionHasSideEffects(node.left) || expressionHasSideEffects(node.right);
				}

				case AST_NODE_TYPES.ChainExpression: {
					return expressionHasSideEffects(node.expression);
				}

				default: {
					return false;
				}
			}
		}

		/**
		 * Inspect an expression for truthy/falsy coercions.
		 *
		 * mode:
		 * - 'test': expression is in a boolean-test position (must enforce)
		 * - 'shortCircuit': expression-statement short-circuit control flow (must enforce gating)
		 * - 'value': value context (must NOT rewrite operands)
		 */
		function inspectExpression(node: TSESTree.Expression, mode: InspectMode): void {
			if (isAlreadyExplicitCheck(node)) return;

			switch (node.type) {
				case AST_NODE_TYPES.ChainExpression: {
					inspectExpression(node.expression, mode);
					return;
				}

				case AST_NODE_TYPES.LogicalExpression: {
					if (node.operator === '??') {
						inspectExpression(node.left, 'value');
						inspectExpression(node.right, 'value');
						return;
					}

					if (node.operator === '&&' || node.operator === '||') {
						if (mode === 'test') {
							inspectExpression(node.left, 'test');
							inspectExpression(node.right, 'test');
							return;
						}

						if (mode === 'shortCircuit') {
							inspectExpression(node.left, 'test');
							inspectExpression(node.right, 'shortCircuit');
							return;
						}

						inspectExpression(node.left, 'value');
						inspectExpression(node.right, 'value');
						return;
					}

					inspectExpression(node.left, 'value');
					inspectExpression(node.right, 'value');
					return;
				}

				case AST_NODE_TYPES.UnaryExpression: {
					if (node.operator !== '!') return;

					const arg = node.argument;

					if (arg.type === AST_NODE_TYPES.UnaryExpression && arg.operator === '!') {
						return;
					}

					if (isImplicitOperand(arg)) {
						if (isBooleanByTS(arg)) return;

						if (isNumberByTS(arg)) return;

						transformFalsyUnary(node);
						return;
					}

					inspectExpression(arg, 'test');
					return;
				}

				case AST_NODE_TYPES.ConditionalExpression: {
					inspectExpression(node.test, 'test');
					return;
				}

				default: {
					if (mode === 'test' && isImplicitOperand(node)) {
						if (isBooleanByTS(node)) return;

						if (isNumberByTS(node)) return;

						transformTruthy(node);
					}
				}
			}
		}

		return {
			IfStatement(node) {
				inspectExpression(node.test, 'test');
			},

			WhileStatement(node) {
				inspectExpression(node.test, 'test');
			},

			DoWhileStatement(node) {
				inspectExpression(node.test, 'test');
			},

			ForStatement(node) {
				if (!_.isNil(node.test)) inspectExpression(node.test, 'test');
			},

			ConditionalExpression(node) {
				inspectExpression(node.test, 'test');
			},

			ExpressionStatement(node) {
				const expr = node.expression;
				if (expr.type === AST_NODE_TYPES.LogicalExpression && (expr.operator === '&&' || expr.operator === '||') && expressionHasSideEffects(expr.right)) {
					inspectExpression(expr, 'shortCircuit');
				}
			},
		};
	},
});

export default preferExplicitNilCheck;
