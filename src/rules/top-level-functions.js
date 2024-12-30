/* eslint-disable unicorn/prefer-module */

const meta = {
	type: 'suggestion',
	docs: {
		description: 'Require all top-level functions to be named/regular functions.',
		category: 'Stylistic Issues',
		recommended: false,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/top-level-functions.md',
	},
	fixable: 'code',
	schema: [],
};

/**
 * Build a replacement code string for an arrow function:
 *
 * @param {string} funcName - The name of the new function.
 * @param {ArrowFunctionExpression} arrowNode - The ArrowFunctionExpression node.
 * @param {import('eslint').SourceCode} sourceCode - The ESLint SourceCode object.
 * @param {boolean} isExport - Whether or not this function is exported (e.g., `export const foo = ...`).
 * @returns {string} The replacement code.
 */
function buildArrowFunctionReplacement(functionName, arrowNode, sourceCode, isExport) {
	const asyncKeyword = arrowNode.async ? 'async ' : '';
	const exportKeyword = isExport ? 'export ' : '';

	const parametersText = arrowNode.params.map(parameter => sourceCode.getText(parameter)).join(', ');

	let bodyText;
	if (arrowNode.body.type === 'BlockStatement') {
		bodyText = sourceCode.getText(arrowNode.body);
	} else {
		const expressionText = sourceCode.getText(arrowNode.body);
		bodyText = `{ return ${expressionText}; }`;
	}

	return `${exportKeyword}${asyncKeyword}function ${functionName}(${parametersText}) ${bodyText}`;
}

/**
 * Build a replacement code string for a function expression:
 *
 * @param {string} funcName - The name of the new function.
 * @param {FunctionExpression} funcExprNode - The FunctionExpression node.
 * @param {import('eslint').SourceCode} sourceCode - The ESLint SourceCode object.
 * @param {boolean} isExport - Whether or not this function is exported.
 * @returns {string} The replacement code.
 */
function buildFunctionExpressionReplacement(functionName, functionExprNode, sourceCode, isExport) {
	const asyncKeyword = functionExprNode.async ? 'async ' : '';
	const exportKeyword = isExport ? 'export ' : '';

	const parametersText = functionExprNode.params.map(parameter => sourceCode.getText(parameter)).join(', ');
	const bodyText = sourceCode.getText(functionExprNode.body);

	return `${exportKeyword}${asyncKeyword}function ${functionName}(${parametersText}) ${bodyText}`;
}

/**
 * Build a replacement for an anonymous top-level FunctionDeclaration (including async).
 *
 * @param {import('eslint').SourceCode} sourceCode
 * @param {import('estree').FunctionDeclaration} node
 * @param {string} [funcName='defaultFunction']
 * @param {boolean} [isExport=false]
 */
function buildAnonymousFunctionDeclarationReplacement(sourceCode, node, functionName = 'defaultFunction', isExport = false) {
	const originalText = sourceCode.getText(node);
	const asyncKeyword = node.async ? 'async ' : '';
	const exportKeyword = isExport ? 'export ' : '';

	let replaced = originalText;
	const asyncFunctionRegex = /^\s*async\s+function\s*\(/;
	const functionRegex = /^\s*function\s*\(/;

	replaced = asyncFunctionRegex.test(replaced) ? replaced.replace(asyncFunctionRegex, `async function ${functionName}(`) : replaced.replace(functionRegex, `function ${functionName}(`);

	if (isExport && !replaced.trimStart().startsWith('export')) {
		replaced = `${exportKeyword}${replaced}`;
	}

	return replaced;
}

function create(context) {
	const sourceCode = context.getSourceCode();

	return {
		VariableDeclarator(node) {
			const declParent = node.parent;
			const grandParent = declParent.parent;

			const isTopLevel
				= grandParent.type === 'Program'
				|| grandParent.type === 'ExportNamedDeclaration'
				|| grandParent.type === 'ExportDefaultDeclaration';

			if (!isTopLevel) {
				return;
			}

			const isExport
				= grandParent.type === 'ExportNamedDeclaration'
				|| grandParent.type === 'ExportDefaultDeclaration';

			if (!node.init) {
				return;
			}

			const functionName = node.id && node.id.name;
			if (!functionName) {
				return;
			}

			if (node.init.type === 'ArrowFunctionExpression') {
				context.report({
					node: node.init,
					message: 'Top-level arrow functions must be named/regular functions.',
					fix(fixer) {
						const replacement = buildArrowFunctionReplacement(
							functionName,
							node.init,
							sourceCode,
							isExport,
						);

						return fixer.replaceText(
							isExport ? grandParent : declParent,
							replacement,
						);
					},
				});
			} else if (node.init.type === 'FunctionExpression') {
				context.report({
					node: node.init,
					message: 'Top-level function expressions must be named/regular functions.',
					fix(fixer) {
						const replacement = buildFunctionExpressionReplacement(
							functionName,
							node.init,
							sourceCode,
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

		FunctionDeclaration(node) {
			if (node.id) {
				return;
			}

			const parent = node.parent;

			const isTopLevel
				= parent.type === 'Program'
				|| parent.type === 'ExportNamedDeclaration'
				|| parent.type === 'ExportDefaultDeclaration';

			if (!isTopLevel) {
				return;
			}

			const isExport
				= parent.type === 'ExportNamedDeclaration'
				|| parent.type === 'ExportDefaultDeclaration';

			context.report({
				node,
				message: 'Top-level anonymous function declarations must be named.',
				fix(fixer) {
					const newName = 'defaultFunction';
					const replacement = buildAnonymousFunctionDeclarationReplacement(
						sourceCode,
						node,
						newName,
						isExport,
					);

					return fixer.replaceText(
						isExport ? parent : node,
						replacement,
					);
				},
			});
		},
	};
}

const rule = {
	meta,
	create,
};

module.exports = rule;
