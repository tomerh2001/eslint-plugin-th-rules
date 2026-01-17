/* eslint-disable no-bitwise */
/* eslint-disable new-cap */

import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import type { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import * as ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-explicit-nil-check.md');

const LODASH_MODULE = 'lodash';
const LODASH_IDENT = '_';

const preferExplicitNilCheck = createRule({
	name: 'prefer-explicit-nil-check',

	meta: {
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Disallow implicit truthy/falsy checks anywhere. Require explicit _.isNil(value).',
		},
		schema: [],
		messages: {
			useIsNil: 'Implicit truthy/falsy checks are not allowed. Use _.isNil(value) or !_.isNil(value).',
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

		function isBooleanByTS(node: TSESTree.Node): boolean {
			const tsNode = services.esTreeNodeToTSNodeMap.get(node);
			if (_.isNil(tsNode)) return false;

			const type = checker.getTypeAtLocation(tsNode);
			return (type.flags & ts.TypeFlags.Boolean) !== 0 || (type.flags & ts.TypeFlags.BooleanLiteral) !== 0;
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
			return node.type === AST_NODE_TYPES.Identifier || node.type === AST_NODE_TYPES.MemberExpression;
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
			const text = context.sourceCode.getText(node);
			reportFull(node, `!${LODASH_IDENT}.isNil(${text})`);
		}

		function transformFalsyUnary(node: TSESTree.UnaryExpression) {
			const arg = node.argument;
			const text = context.sourceCode.getText(arg);
			reportFull(node, `${LODASH_IDENT}.isNil(${text})`);
		}

		/**
		 * Inspect an expression for *truthy/falsy* coercions.
		 *
		 * @param isTestPosition When true, this expression is being converted to boolean by the language
		 * (e.g. if/while/?: test). When false, the expression is not itself a condition, but may contain
		 * sub-expressions that are conditions (e.g. the right side of `a && expr` in an expression statement).
		 */
		function inspectExpression(node: TSESTree.Expression, isTestPosition: boolean): void {
			if (isAlreadyExplicitCheck(node)) return;

			switch (node.type) {
				case AST_NODE_TYPES.LogicalExpression: {
					if (node.operator === '??') {
						inspectExpression(node.left, false);
						inspectExpression(node.right, false);
						return;
					}

					if (node.operator === '&&' || node.operator === '||') {
						inspectExpression(node.left, true);

						inspectExpression(node.right, isTestPosition);
						return;
					}

					inspectExpression(node.left, false);
					inspectExpression(node.right, false);
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
						transformFalsyUnary(node);
						return;
					}

					inspectExpression(arg, true);
					return;
				}

				case AST_NODE_TYPES.ConditionalExpression: {
					inspectExpression(node.test, true);
					return;
				}

				default: {
					if (isTestPosition && isImplicitOperand(node)) {
						if (isBooleanByTS(node)) return;
						transformTruthy(node);
					}
				}
			}
		}

		return {
			IfStatement(node) {
				inspectExpression(node.test, true);
			},

			WhileStatement(node) {
				inspectExpression(node.test, true);
			},

			DoWhileStatement(node) {
				inspectExpression(node.test, true);
			},

			ForStatement(node) {
				if (!_.isNil(node.test)) inspectExpression(node.test, true);
			},

			ConditionalExpression(node) {
				inspectExpression(node.test, true);
			},

			LogicalExpression(node) {
				inspectExpression(node, false);
			},

			ExpressionStatement(node) {
				if (node.expression.type === AST_NODE_TYPES.LogicalExpression) {
					inspectExpression(node.expression, false);
				}
			},
		};
	},
});

export default preferExplicitNilCheck;
