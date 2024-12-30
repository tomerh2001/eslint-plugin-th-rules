/**
 * @type {Object}
 * @property {string} type - The type of the rule, in this case 'suggestion'.
 * @property {Object} docs - Documentation related to the rule.
 * @property {string} docs.description - A brief description of the rule.
 * @property {string} docs.category - The category of the rule, here 'Stylistic Issues'.
 * @property {boolean} docs.recommended - Indicates whether the rule is recommended.
 * @property {string} docs.url - The URL to the documentation of the rule.
 * @property {string} fixable - Indicates if the rule is fixable, in this case 'code'.
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
 * ESLint rule to enforce naming of top-level functions.
 *
 * @param {Object} context - The ESLint rule context.
 * @returns {Object} An object containing the rule's visitor methods.
 */
function create(context) {
	return {

		VariableDeclaration(node) {
			if (node.parent.type !== 'Program') {
				return;
			}

			for (const declaration of node.declarations) {
				if (
					declaration.init
					&& (declaration.init.type === 'ArrowFunctionExpression'
						|| declaration.init.type === 'FunctionExpression')
				) {
					context.report({
						node: declaration,
						message: 'Top-level functions must be named/regular functions.',
						fix(fixer) {
							const sourceCode = context.getSourceCode();
							const functionText = sourceCode.getText(declaration.init);
							const functionName = declaration.id.name;
							const fixedCode = `function ${functionName}${functionText.slice(functionText.indexOf('('))}`;
							return fixer.replaceText(declaration, fixedCode);
						},
					});
				}
			}
		},

		FunctionDeclaration(node) {
			if (node.id) {
				return;
			}

			if (node.parent.type === 'Program') {
				context.report({
					node,
					message: 'Top-level functions must be named.',
					fix(fixer) {
						const sourceCode = context.getSourceCode();
						const functionName = 'defaultFunction';
						const functionText = sourceCode.getText(node);

						const fixedCode = functionText.replace('function (', `function ${functionName}(`);

						return fixer.replaceText(node, fixedCode);
					},
				});
			}
		},
	};
}

const rule = {
	meta,
	create,
};

module.exports = rule;
