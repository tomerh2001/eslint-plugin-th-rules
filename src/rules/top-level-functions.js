/* eslint-disable unicorn/prefer-module */

/**
 * @type {Object}
 * @property {string} type - The type of the rule, in this case, 'suggestion'.
 * @property {Object} docs - Documentation related to the rule.
 * @property {string} docs.description - A brief description of the rule.
 * @property {string} docs.category - The category of the rule, 'Stylistic Issues'.
 * @property {boolean} docs.recommended - Indicates if the rule is recommended.
 * @property {string} docs.url - The URL to the documentation of the rule.
 * @property {string} fixable - Indicates if the rule is fixable, 'code'.
 * @property {Array} schema - The schema for the rule options.
 */
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
 * @param {boolean} isExport - Whether or not this function is exported.
 * @returns {string} The replacement code.
 */
function buildArrowFunctionReplacement(functionName, arrowNode, sourceCode, isExport) {
	const parametersText = arrowNode.params.map(parameter => sourceCode.getText(parameter)).join(', ');

	let bodyText;
	if (arrowNode.body.type === 'BlockStatement') {
		bodyText = sourceCode.getText(arrowNode.body);
	} else {
		const expressionText = sourceCode.getText(arrowNode.body);
		bodyText = `{ return ${expressionText}; }`;
	}

	const exportKeyword = isExport ? 'export ' : '';
	return `${exportKeyword}function ${functionName}(${parametersText}) ${bodyText}`;
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
	const parametersText = functionExprNode.params.map(parameter => sourceCode.getText(parameter)).join(', ');
	const bodyText = sourceCode.getText(functionExprNode.body);

	const exportKeyword = isExport ? 'export ' : '';
	return `${exportKeyword}function ${functionName}(${parametersText}) ${bodyText}`;
}

/**
 * Build a replacement for an anonymous top-level FunctionDeclaration.
 *
 * @param {import('eslint').SourceCode} sourceCode
 * @param {import('estree').FunctionDeclaration} node
 * @param {string} [funcName='defaultFunction']
 */
function buildAnonymousFunctionDeclarationReplacement(sourceCode, node, functionName = 'defaultFunction') {
	const originalText = sourceCode.getText(node);

	const fixedText = originalText.replace(
		/^(\s*function\s*)\(/,
		`$1${functionName}(`,
	);
	return fixedText;
}

/**
 * ESLint rule to enforce naming conventions for top-level functions.
 *
 * @param {Object} context - The rule context provided by ESLint.
 * @returns {Object} An object containing visitor methods for AST nodes.
 */
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

						return fixer.replaceText(grandParent.type === 'Program' ? declParent : grandParent, replacement);
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
						return fixer.replaceText(grandParent.type === 'Program' ? declParent : grandParent, replacement);
					},
				});
			}
		},

		FunctionDeclaration(node) {
			if (node.id) {
				return;
			}

			const parent = node.parent;

			const isTopLevel = parent.type === 'Program'
				|| parent.type === 'ExportNamedDeclaration'
				|| parent.type === 'ExportDefaultDeclaration';

			if (!isTopLevel) {
				return;
			}

			context.report({
				node,
				message: 'Top-level anonymous function declarations must be named.',
				fix(fixer) {
					const newName = 'defaultFunction';
					const replacement = buildAnonymousFunctionDeclarationReplacement(sourceCode, node, newName);

					return fixer.replaceText(
						parent.type === 'Program' ? node : parent,
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
