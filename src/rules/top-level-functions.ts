import {ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator(() =>
	'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/top-level-functions.md')({
	name: 'top-level-functions',

	meta: {
		type: 'suggestion',
		docs: {
			description:
        'Require all top-level functions to be named regular functions.',
		},
		fixable: 'code',
		schema: [],
		messages: {
			arrow:
        'Top-level arrow functions must be named regular functions.',
			funcExpr:
        'Top-level function expressions must be named regular functions.',
			anonDecl:
        'Top-level anonymous function declarations must be named.',
		},
	},

	defaultOptions: [],

	create(context) {
		const sourceCode = context.getSourceCode();

		//
		// Helpers
		//
		function buildArrowFunctionReplacement(
			functionName: string,
			arrow: TSESTree.ArrowFunctionExpression,
			isExport: boolean,
		): string {
			const asyncKeyword = arrow.async ? 'async ' : '';
			const exportKeyword = isExport ? 'export ' : '';

			const parametersText = arrow.params
				.map(parameter => sourceCode.getText(parameter))
				.join(', ');

			let bodyText: string;

			if (arrow.body.type === 'BlockStatement') {
				bodyText = sourceCode.getText(arrow.body);
			} else {
				// Expression → convert to return
				const expressionText = sourceCode.getText(arrow.body);
				bodyText = `{ return ${expressionText}; }`;
			}

			return `${exportKeyword}${asyncKeyword}function ${functionName}(${parametersText}) ${bodyText}`;
		}

		function buildFunctionExpressionReplacement(
			functionName: string,
			funcExpr: TSESTree.FunctionExpression,
			isExport: boolean,
		): string {
			const asyncKeyword = funcExpr.async ? 'async ' : '';
			const exportKeyword = isExport ? 'export ' : '';

			const parametersText = funcExpr.params
				.map(parameter => sourceCode.getText(parameter))
				.join(', ');

			const bodyText = sourceCode.getText(funcExpr.body);

			return `${exportKeyword}${asyncKeyword}function ${functionName}(${parametersText}) ${bodyText}`;
		}

		function buildAnonymousFunctionDeclarationReplacement(
			node: TSESTree.FunctionDeclaration,
			functionName = 'defaultFunction',
			isExport = false,
		): string {
			const originalText = sourceCode.getText(node);
			const exportKeyword = isExport ? 'export ' : '';

			const asyncFunctionRegex = /^\s*async\s+function\s*\(/;
			const functionRegex = /^\s*function\s*\(/;

			let replaced = originalText;

			if (asyncFunctionRegex.test(replaced)) {
				replaced = replaced.replace(
					asyncFunctionRegex,
					`async function ${functionName}(`,
				);
			} else {
				replaced = replaced.replace(
					functionRegex,
					`function ${functionName}(`,
				);
			}

			if (isExport && !replaced.trimStart().startsWith('export')) {
				replaced = `${exportKeyword}${replaced}`;
			}

			return replaced;
		}

		//
		// Utility
		//
		function isTopLevel(node: TSESTree.Node): boolean {
			const {parent} = node;
			return (
				parent?.type === 'Program'
				|| parent?.type === 'ExportNamedDeclaration'
				|| parent?.type === 'ExportDefaultDeclaration'
			);
		}

		function isExportContext(node: TSESTree.Node): boolean {
			const p = node.parent;
			return (
				p?.type === 'ExportNamedDeclaration'
				|| p?.type === 'ExportDefaultDeclaration'
			);
		}

		//
		// Rule
		//
		return {
			VariableDeclarator(node: TSESTree.VariableDeclarator) {
				const declParent = node.parent;
				const grandParent = declParent?.parent;

				if (!grandParent) {
					return;
				}

				const topLevel
          = grandParent.type === 'Program'
          	|| grandParent.type === 'ExportNamedDeclaration'
          	|| grandParent.type === 'ExportDefaultDeclaration';

				if (!topLevel) {
					return;
				}

				const isExport
          = grandParent.type === 'ExportNamedDeclaration'
          	|| grandParent.type === 'ExportDefaultDeclaration';

				if (!node.init) {
					return;
				}

				const functionName
          = node.id.type === 'Identifier' ? node.id.name : null;

				if (!functionName) {
					return;
				}

				//
				// Arrow functions
				//
				if (node.init.type === 'ArrowFunctionExpression') {
					const arrowFunc = node.init;
					context.report({
						node: arrowFunc,
						messageId: 'arrow',
						fix(fixer) {
							const replacement = buildArrowFunctionReplacement(
								functionName,
								arrowFunc,
								isExport,
							);

							return fixer.replaceText(
								isExport ? grandParent : declParent,
								replacement,
							);
						},
					});
				}

				//
				// Function expressions
				//
				if (node.init.type === 'FunctionExpression') {
					const funcExpr = node.init;
					context.report({
						node: funcExpr,
						messageId: 'funcExpr',
						fix(fixer) {
							const replacement = buildFunctionExpressionReplacement(
								functionName,
								funcExpr,
								isExport,
							);

							return fixer.replaceText(
								isExport ? grandParent : declParent,
								replacement,
							);
						},
					});
				}
			},

			FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
				if (node.id) {
					return;
				} // Already named

				if (!isTopLevel(node)) {
					return;
				}

				const isExport = isExportContext(node);

				context.report({
					node,
					messageId: 'anonDecl',
					fix(fixer) {
						const replacement
              = buildAnonymousFunctionDeclarationReplacement(
              	node,
              	'defaultFunction',
              	isExport,
              );

						return fixer.replaceText(
							isExport ? node.parent : node,
							replacement,
						);
					},
				});
			},
		};
	},
});
