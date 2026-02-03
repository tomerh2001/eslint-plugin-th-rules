/* eslint-disable th-rules/types-in-dts */
/* eslint-disable new-cap */
/* eslint-disable complexity */

import _ from 'lodash';
import { AST_NODE_TYPES, ESLintUtils, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

type Fixer = TSESLint.RuleFixer;

type FunctionLike = TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression;

type ExtractedPath = { kind: 'member'; keyText: string; keyIsIdentifier: boolean } | { kind: 'get'; pathText: string; pathIsStaticString: boolean };

type PredicateClause = { path: ExtractedPath; valueExpr: TSESTree.Expression };

export const PREDICATE_METHOD_NAMES = [
	'find',
	'findLast',
	'findIndex',
	'findLastIndex',
	'filter',
	'reject',
	'some',
	'every',
	'partition',
	'dropWhile',
	'takeWhile',
	'remove',
	'findKey',
	'findLastKey',
] as const;

export const ITERATEE_METHOD_NAMES = [
	'map',
	'flatMap',
	'flatMapDeep',
	'flatMapDepth',
	'forEach',
	'each',
	'groupBy',
	'keyBy',
	'countBy',
	'sortBy',
	'orderBy',
	'minBy',
	'maxBy',
	'sumBy',
	'meanBy',
	'uniqBy',
	'differenceBy',
	'intersectionBy',
	'unionBy',
	'xorBy',
	'sortedUniqBy',
] as const;

type PredicateMethodName = (typeof PREDICATE_METHOD_NAMES)[number];
type IterateeMethodName = (typeof ITERATEE_METHOD_NAMES)[number];

const PREDICATE_METHODS = new Set<string>(PREDICATE_METHOD_NAMES satisfies readonly PredicateMethodName[]);
const ITERATEE_METHODS = new Set<string>(ITERATEE_METHOD_NAMES satisfies readonly IterateeMethodName[]);

const RULE_NAME = 'prefer-lodash-iteratee-shorthand';

const preferLodashIterateeShorthand = ESLintUtils.RuleCreator(() => `https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/${RULE_NAME}.md`)({
	name: RULE_NAME,

	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Prefer Lodash iteratee shorthands. Example: _.find(collection, (x) => x.Y === z) -> _.find(collection, {Y: z}). Also prefers property shorthands like _.map(collection, (x) => _.get(x, path)) -> _.map(collection, path).',
		},
		fixable: 'code',
		schema: [],
		messages: {
			useMatchesObject: 'Prefer Lodash iteratee shorthand. Use {{replacement}}.',
			usePropertyShorthand: 'Prefer Lodash iteratee shorthand. Use {{replacement}}.',
			useLodashFind: 'Prefer Lodash iteratee shorthand. Use {{replacement}}.',
		},
	},

	defaultOptions: [],

	create(context) {
		const { sourceCode } = context;

		function ensureLodashImport(fixer: Fixer) {
			const imports = sourceCode.ast.body.filter((node): node is TSESTree.ImportDeclaration => node.type === AST_NODE_TYPES.ImportDeclaration);

			const hasLodash = imports.some(
				(imp) => imp.source.value === 'lodash' && imp.specifiers.some((s) => s.type === AST_NODE_TYPES.ImportDefaultSpecifier || s.type === AST_NODE_TYPES.ImportNamespaceSpecifier),
			);

			if (hasLodash) return null;

			const firstImport = imports[0];
			return _.isNil(firstImport) ? fixer.insertTextBeforeRange([0, 0], `import _ from 'lodash';\n`) : fixer.insertTextBefore(firstImport, `import _ from 'lodash';\n`);
		}

		function unwrapChain(node: TSESTree.Node | undefined): TSESTree.Node | undefined {
			return node?.type === AST_NODE_TYPES.ChainExpression ? node.expression : node;
		}

		function unwrapChainExpr(node: TSESTree.Expression | undefined): TSESTree.Expression | undefined {
			const unwrapped = unwrapChain(node);
			return !_.isNil(unwrapped) && !_.isEmpty(unwrapped.type) ? (unwrapped as TSESTree.Expression) : undefined;
		}

		function isIdentifier(node: TSESTree.Node | undefined, name: string): node is TSESTree.Identifier {
			return !_.isNil(node) && node.type === AST_NODE_TYPES.Identifier && node.name === name;
		}

		function isStringLiteral(node: TSESTree.Node | undefined): node is TSESTree.Literal & { value: string } {
			return !_.isNil(node) && node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string';
		}

		function isTemplateLiteralWithoutExpressions(node: TSESTree.Node | undefined): node is TSESTree.TemplateLiteral {
			return !_.isNil(node) && node.type === AST_NODE_TYPES.TemplateLiteral && _.isEmpty(node.expressions) && node.quasis.length === 1;
		}

		function isLodashIdentifier(node: TSESTree.Node | undefined): node is TSESTree.Identifier {
			return isIdentifier(node, '_');
		}

		function isLodashMember(node: TSESTree.Node | undefined, methodName: string): node is TSESTree.MemberExpression {
			const unwrapped = unwrapChain(node);
			return (
				!_.isNil(unwrapped) &&
				unwrapped.type === AST_NODE_TYPES.MemberExpression &&
				!unwrapped.computed &&
				unwrapped.property.type === AST_NODE_TYPES.Identifier &&
				unwrapped.property.name === methodName &&
				isLodashIdentifier(unwrapped.object)
			);
		}

		function isLodashStaticCall(node: TSESTree.CallExpression, methodName: string): boolean {
			return isLodashMember(node.callee, methodName);
		}

		function isLodashWrapperCallExpression(node: TSESTree.Node | undefined): node is TSESTree.CallExpression {
			const unwrapped = unwrapChain(node);
			return !_.isNil(unwrapped) && unwrapped.type === AST_NODE_TYPES.CallExpression && unwrapped.callee.type === AST_NODE_TYPES.Identifier && unwrapped.callee.name === '_';
		}

		function isLodashWrapperMethodCall(node: TSESTree.CallExpression, methodName: string): boolean {
			const callee = unwrapChain(node.callee);
			if (_.isNil(callee) || callee.type !== AST_NODE_TYPES.MemberExpression) return false;

			if (callee.computed) return false;
			if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;
			if (callee.property.name !== methodName) return false;

			return isLodashWrapperCallExpression(callee.object);
		}

		function getFunctionParameterName(fn: FunctionLike): string | null {
			if (fn.params.length !== 1) return null;
			const parameter = fn.params[0];
			return parameter.type === AST_NODE_TYPES.Identifier ? parameter.name : null;
		}

		function getReturnedExpression(fn: FunctionLike): TSESTree.Expression | null {
			if (fn.body.type === AST_NODE_TYPES.BlockStatement) {
				if (fn.body.body.length !== 1) return null;
				const only = fn.body.body[0];
				if (only.type !== AST_NODE_TYPES.ReturnStatement) return null;
				return only.argument ?? null;
			}

			return fn.body;
		}

		function isFunctionLike(node: TSESTree.Node | undefined): node is FunctionLike {
			return !_.isNil(node) && (node.type === AST_NODE_TYPES.ArrowFunctionExpression || node.type === AST_NODE_TYPES.FunctionExpression);
		}

		function isGetCallOnParameter(expr: TSESTree.Expression, parameterName: string): ExtractedPath | null {
			const unwrapped = unwrapChain(expr);
			if (_.isNil(unwrapped) || unwrapped.type !== AST_NODE_TYPES.CallExpression) return null;

			const callee = unwrapChain(unwrapped.callee);
			if (!isLodashMember(callee, 'get')) return null;

			if (unwrapped.arguments.length < 2) return null;

			const arg0 = unwrapped.arguments[0];
			const arg1 = unwrapped.arguments[1];

			if (_.isNil(arg0) || arg0.type === AST_NODE_TYPES.SpreadElement) return null;
			if (_.isNil(arg1) || arg1.type === AST_NODE_TYPES.SpreadElement) return null;

			const object = unwrapChain(arg0);
			if (_.isNil(object) || object.type !== AST_NODE_TYPES.Identifier || object.name !== parameterName) return null;

			if (isStringLiteral(arg1)) {
				return { kind: 'get', pathText: sourceCode.getText(arg1), pathIsStaticString: true };
			}

			if (isTemplateLiteralWithoutExpressions(arg1)) {
				return { kind: 'get', pathText: sourceCode.getText(arg1), pathIsStaticString: true };
			}

			if (arg1.type === AST_NODE_TYPES.Identifier) {
				return { kind: 'get', pathText: arg1.name, pathIsStaticString: false };
			}

			return null;
		}

		function isMemberAccessOnParameter(expr: TSESTree.Expression, parameterName: string): ExtractedPath | null {
			const unwrapped = unwrapChain(expr);
			if (_.isNil(unwrapped) || unwrapped.type !== AST_NODE_TYPES.MemberExpression) return null;

			const object = unwrapChain(unwrapped.object);
			if (_.isNil(object) || object.type !== AST_NODE_TYPES.Identifier || object.name !== parameterName) return null;

			if (!unwrapped.computed && unwrapped.property.type === AST_NODE_TYPES.Identifier) {
				const key = unwrapped.property.name;
				return { kind: 'member', keyText: key, keyIsIdentifier: true };
			}

			if (unwrapped.computed && unwrapped.property.type === AST_NODE_TYPES.Literal && typeof unwrapped.property.value === 'string') {
				return { kind: 'member', keyText: sourceCode.getText(unwrapped.property), keyIsIdentifier: false };
			}

			if (unwrapped.computed && unwrapped.property.type === AST_NODE_TYPES.Identifier) {
				return { kind: 'member', keyText: unwrapped.property.name, keyIsIdentifier: false };
			}

			return null;
		}

		function extractPathFromExpression(expr: TSESTree.Expression, parameterName: string): ExtractedPath | null {
			return isMemberAccessOnParameter(expr, parameterName) ?? isGetCallOnParameter(expr, parameterName);
		}

		function normalizeStaticPathText(pathText: string): string {
			const trimmed = pathText.trim();
			if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
				return trimmed.slice(1, -1);
			}

			if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
				return trimmed.slice(1, -1);
			}

			return trimmed;
		}

		function isValidIdentifierName(name: string): boolean {
			return /^[A-Za-z_$][\w$]*$/.test(name);
		}

		function toSingleQuotedStringLiteral(value: string): string {
			const escaped = value.replaceAll('\\', '\\\\').replaceAll("'", String.raw`\'`);
			return `'${escaped}'`;
		}

		function containsIdentifier(node: TSESTree.Node, name: string): boolean {
			const { visitorKeys } = sourceCode;
			const seen = new Set<TSESTree.Node>();
			const stack: TSESTree.Node[] = [node];

			while (!_.isEmpty(stack)) {
				const current = stack.pop();
				if (_.isNil(current)) continue;
				if (seen.has(current)) continue;
				seen.add(current);

				if (current.type === AST_NODE_TYPES.Identifier && current.name === name) return true;

				const keys = visitorKeys[current.type] ?? [];
				for (const key of keys) {
					const value = (current as unknown as Record<string, unknown>)[key];

					if (_.isNil(value)) continue;

					if (Array.isArray(value)) {
						for (const item of value) {
							if (!item || typeof item !== 'object') continue;
							stack.push(item as TSESTree.Node);
						}

						continue;
					}

					if (typeof value === 'object') {
						stack.push(value as TSESTree.Node);
					}
				}
			}

			return false;
		}

		function parseLodashPathSegments(path: string): Array<string | number> | null {
			const segments: Array<string | number> = [];
			let i = 0;

			const { length } = path;

			const skipDot = () => {
				if (path[i] === '.') i += 1;
			};

			const readIdent = (): string | null => {
				const start = i;
				if (start >= length) return null;

				const first = path[start];
				if (_.isEmpty(first) || !/[A-Za-z_$]/.test(first)) return null;

				i += 1;
				while (i < length && /[\w$]/.test(path[i] ?? '')) i += 1;

				return path.slice(start, i);
			};

			const readBracketIndex = (): number | null => {
				if (path[i] !== '[') return null;
				i += 1;

				const start = i;
				while (i < length && /\d/.test(path[i] ?? '')) i += 1;

				if (start === i) return null;
				if (path[i] !== ']') return null;

				const number_ = Number(path.slice(start, i));
				i += 1;
				return Number.isFinite(number_) ? number_ : null;
			};

			while (i < length) {
				skipDot();

				if (i >= length) break;

				if (path[i] === '[') {
					const idx = readBracketIndex();
					if (_.isNil(idx)) return null;
					segments.push(idx);
					skipDot();
					continue;
				}

				const ident = readIdent();
				if (_.isNil(ident)) return null;

				segments.push(ident);
				skipDot();
			}

			return segments;
		}

		function buildNestedLiteralFromSegments(segments: Array<string | number>, valueText: string): string | null {
			if (_.isEmpty(segments)) return null;

			const build = (idx: number): string | null => {
				const seg = segments[idx];
				if (_.isNil(seg)) return null;

				const tail = idx === segments.length - 1 ? valueText : build(idx + 1);
				if (_.isNil(tail)) return null;

				if (typeof seg === 'number') {
					const holes = new Array(seg).fill('').join(',');
					const prefix = seg === 0 ? '' : holes;
					const comma = seg === 0 ? '' : ',';
					return `[${prefix}${comma}${tail}]`;
				}

				const key = isValidIdentifierName(seg) ? seg : toSingleQuotedStringLiteral(seg);
				return `{${key}: ${tail}}`;
			};

			return build(0);
		}

		function mergeObjectLiteralsIntoOne(literals: string[]): string | null {
			const trimmed = literals.map((s) => s.trim());

			const allArrays = trimmed.every((s) => s.startsWith('['));
			const anyArrays = trimmed.some((s) => s.startsWith('['));
			if (anyArrays && !allArrays) return null;

			if (allArrays) {
				return trimmed.length === 1 ? trimmed[0] : null;
			}

			const props: string[] = [];
			for (const lit of trimmed) {
				if (!lit.startsWith('{') || !lit.endsWith('}')) return null;
				const inner = lit.slice(1, -1).trim();
				if (_.isEmpty(inner)) continue;
				props.push(inner);
			}

			if (_.isEmpty(props)) return '{}';
			return `{${props.join(', ')}}`;
		}

		function extractPredicateClausesFromExpression(expr: TSESTree.Expression, parameterName: string): PredicateClause[] | null {
			const unwrapped = unwrapChainExpr(expr);
			if (_.isNil(unwrapped)) return null;

			const flattenAnd = (e: TSESTree.Expression): TSESTree.Expression[] => {
				const u = unwrapChainExpr(e) ?? e;
				if (u.type === AST_NODE_TYPES.LogicalExpression && u.operator === '&&') {
					return [...flattenAnd(u.left), ...flattenAnd(u.right)];
				}

				return [u];
			};

			const parts = flattenAnd(unwrapped);
			const clauses: PredicateClause[] = [];

			for (const part of parts) {
				const u = unwrapChainExpr(part) ?? part;
				if (u.type !== AST_NODE_TYPES.BinaryExpression) return null;
				if (u.operator !== '===' && u.operator !== '==') return null;

				const left = unwrapChainExpr(u.left) ?? u.left;
				const right = unwrapChainExpr(u.right) ?? u.right;

				const leftPath = extractPathFromExpression(left, parameterName);
				const rightPath = extractPathFromExpression(right, parameterName);

				if (!_.isNil(leftPath) && _.isNil(rightPath)) {
					if (containsIdentifier(right, parameterName)) return null;
					clauses.push({ path: leftPath, valueExpr: right });
					continue;
				}

				if (_.isNil(leftPath) && !_.isNil(rightPath)) {
					if (containsIdentifier(left, parameterName)) return null;
					clauses.push({ path: rightPath, valueExpr: left });
					continue;
				}

				return null;
			}

			return clauses;
		}

		function buildObjectKeyTextForMemberPath(path: ExtractedPath & { kind: 'member' }): string | null {
			if (path.keyIsIdentifier) {
				return path.keyText;
			}

			if (isValidIdentifierName(path.keyText)) {
				return null;
			}

			const normalized = normalizeStaticPathText(path.keyText);
			return toSingleQuotedStringLiteral(normalized);
		}

		function buildMatchesObjectFromClauses(clauses: PredicateClause[]): string | null {
			const literals: string[] = [];

			for (const clause of clauses) {
				const valueText = sourceCode.getText(clause.valueExpr);

				if (clause.path.kind === 'member') {
					const keyText = buildObjectKeyTextForMemberPath(clause.path);
					if (_.isNil(keyText)) return null;

					literals.push(`{${keyText}: ${valueText}}`);
					continue;
				}

				if (!clause.path.pathIsStaticString) {
					return null;
				}

				const rawPath = normalizeStaticPathText(clause.path.pathText);
				const segments = parseLodashPathSegments(rawPath);
				if (_.isNil(segments)) return null;

				const nested = buildNestedLiteralFromSegments(segments, valueText);
				if (_.isNil(nested)) return null;

				literals.push(nested);
			}

			return mergeObjectLiteralsIntoOne(literals);
		}

		function extractPropertyIterateeRewrite(fn: FunctionLike): string | null {
			const parameterName = getFunctionParameterName(fn);
			if (_.isNil(parameterName)) return null;

			const expr = getReturnedExpression(fn);
			if (_.isNil(expr)) return null;

			const unwrapped = unwrapChainExpr(expr) ?? expr;

			const member = isMemberAccessOnParameter(unwrapped, parameterName);
			if (!_.isNil(member) && member.kind === 'member') {
				if (!member.keyIsIdentifier && isValidIdentifierName(member.keyText)) {
					return member.keyText;
				}

				if (member.keyIsIdentifier) {
					return toSingleQuotedStringLiteral(member.keyText);
				}

				const normalized = normalizeStaticPathText(member.keyText);
				return toSingleQuotedStringLiteral(normalized);
			}

			const get = isGetCallOnParameter(unwrapped, parameterName);
			if (!_.isNil(get) && get.kind === 'get') {
				return get.pathText;
			}

			return null;
		}

		function getMethodNameFromMemberCallee(callee: TSESTree.Node | undefined): string | null {
			const unwrapped = unwrapChain(callee);
			if (_.isNil(unwrapped) || unwrapped.type !== AST_NODE_TYPES.MemberExpression) return null;

			if (unwrapped.computed) return null;
			if (unwrapped.property.type !== AST_NODE_TYPES.Identifier) return null;

			return unwrapped.property.name;
		}

		function isNativeArrayFindCall(node: TSESTree.CallExpression): { collectionText: string } | null {
			const callee = unwrapChain(node.callee);
			if (_.isNil(callee) || callee.type !== AST_NODE_TYPES.MemberExpression) return null;

			const method = getMethodNameFromMemberCallee(callee);
			if (method !== 'find') return null;

			if (isLodashIdentifier(callee.object)) return null;
			if (isLodashWrapperCallExpression(callee.object)) return null;

			const collectionText = sourceCode.getText(callee.object);
			return { collectionText };
		}

		function isLodashMethodCall(node: TSESTree.CallExpression): { mode: 'static' | 'wrapper'; methodName: string } | null {
			const method = getMethodNameFromMemberCallee(node.callee);
			if (_.isNil(method)) return null;

			if (isLodashStaticCall(node, method)) return { mode: 'static', methodName: method };
			if (isLodashWrapperMethodCall(node, method)) return { mode: 'wrapper', methodName: method };

			return null;
		}

		function reportAndFixReplaceCallWithLodashFind(callNode: TSESTree.CallExpression, collectionText: string, replacementIterateeText: string, fixer: Fixer) {
			const replacement = `_.find(${collectionText}, ${replacementIterateeText})`;
			const target = callNode.parent?.type === AST_NODE_TYPES.ChainExpression ? callNode.parent : callNode;

			const fixes = [fixer.replaceText(target, replacement)];
			const importFix = ensureLodashImport(fixer);
			if (!_.isNil(importFix)) fixes.push(importFix);
			return fixes;
		}

		function reportAndFixReplaceArgument(nodeToFix: TSESTree.Node, replacementText: string, fixer: Fixer) {
			const fixes = [fixer.replaceText(nodeToFix, replacementText)];
			const importFix = ensureLodashImport(fixer);
			if (!_.isNil(importFix)) fixes.push(importFix);
			return fixes;
		}

		return {
			CallExpression(node) {
				const nativeFind = isNativeArrayFindCall(node);
				if (!_.isNil(nativeFind)) {
					const predicateArg = node.arguments[0];
					if (_.isNil(predicateArg) || predicateArg.type === AST_NODE_TYPES.SpreadElement) return;
					if (!isFunctionLike(predicateArg)) return;

					const expr = getReturnedExpression(predicateArg);
					if (_.isNil(expr)) return;

					const parameterName = getFunctionParameterName(predicateArg);
					if (_.isNil(parameterName)) return;

					const clauses = extractPredicateClausesFromExpression(expr, parameterName);
					if (_.isNil(clauses) || _.isEmpty(clauses)) return;

					const matchesObject = buildMatchesObjectFromClauses(clauses);
					if (_.isNil(matchesObject)) return;

					const replacement = `_.find(${nativeFind.collectionText}, ${matchesObject})`;

					context.report({
						node,
						messageId: 'useLodashFind',
						data: { replacement },
						fix(fixer) {
							return reportAndFixReplaceCallWithLodashFind(node, nativeFind.collectionText, matchesObject, fixer);
						},
					});

					return;
				}

				const lodashCall = isLodashMethodCall(node);
				if (_.isNil(lodashCall)) return;

				if (PREDICATE_METHODS.has(lodashCall.methodName)) {
					const predicateIndex = lodashCall.mode === 'static' ? 1 : 0;
					const predicateArg = node.arguments[predicateIndex];
					if (_.isNil(predicateArg) || predicateArg.type === AST_NODE_TYPES.SpreadElement) return;

					if (isFunctionLike(predicateArg)) {
						const expr = getReturnedExpression(predicateArg);
						if (_.isNil(expr)) return;

						const parameterName = getFunctionParameterName(predicateArg);
						if (_.isNil(parameterName)) return;

						const clauses = extractPredicateClausesFromExpression(expr, parameterName);
						if (_.isNil(clauses) || _.isEmpty(clauses)) return;

						const matchesObject = buildMatchesObjectFromClauses(clauses);
						if (_.isNil(matchesObject)) return;

						context.report({
							node: predicateArg,
							messageId: 'useMatchesObject',
							data: { replacement: matchesObject },
							fix(fixer) {
								return reportAndFixReplaceArgument(predicateArg, matchesObject, fixer);
							},
						});

						return;
					}
				}

				if (ITERATEE_METHODS.has(lodashCall.methodName)) {
					const iterateeIndex = lodashCall.mode === 'static' ? 1 : 0;
					const iterateeArg = node.arguments[iterateeIndex];
					if (_.isNil(iterateeArg) || iterateeArg.type === AST_NODE_TYPES.SpreadElement) return;

					if (iterateeArg.type === AST_NODE_TYPES.ArrayExpression && (lodashCall.methodName === 'sortBy' || lodashCall.methodName === 'orderBy')) {
						const rewrites: Array<{ element: TSESTree.Expression; replacement: string }> = [];

						for (const element of iterateeArg.elements) {
							if (_.isNil(element) || element.type === AST_NODE_TYPES.SpreadElement) continue;
							if (!isFunctionLike(element)) continue;

							const replacement = extractPropertyIterateeRewrite(element);
							if (!_.isNil(replacement)) rewrites.push({ element, replacement });
						}

						if (_.isEmpty(rewrites)) return;

						context.report({
							node: iterateeArg,
							messageId: 'usePropertyShorthand',
							data: { replacement: sourceCode.getText(iterateeArg) },
							fix(fixer) {
								const fixes = rewrites.map(({ element, replacement }) => fixer.replaceText(element, replacement));
								const importFix = ensureLodashImport(fixer);
								if (!_.isNil(importFix)) fixes.push(importFix);
								return fixes;
							},
						});

						return;
					}

					if (isFunctionLike(iterateeArg)) {
						const replacement = extractPropertyIterateeRewrite(iterateeArg);
						if (_.isNil(replacement)) return;

						context.report({
							node: iterateeArg,
							messageId: 'usePropertyShorthand',
							data: { replacement },
							fix(fixer) {
								return reportAndFixReplaceArgument(iterateeArg, replacement, fixer);
							},
						});
					}
				}
			},
		};
	},
});

export default preferLodashIterateeShorthand;
