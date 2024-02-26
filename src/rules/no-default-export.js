/* eslint-disable unicorn/prefer-module */

const path = require('node:path');

const meta = {
	type: 'suggestion',
	docs: {
		description: 'Convert unnamed default exports to named default exports based on the file name.',
	},
	fixable: 'code',
	schema: [],
};

function create(context) {
	function generateExportNameFromFileName(fileName) {
		return fileName.replaceAll(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
			if (match === ' ') {
				return '';
			} // Remove spaces

			if (index === 0) {
				return match.toLowerCase();
			} // Lowercase the first character

			return match.toUpperCase();
		})
			.replaceAll(/[-_<>\\. ]/g, '');
	}

	return {
		ExportDefaultDeclaration(node) {
			// If the export declaration is an identifier (e.g., a variable name), it's considered named.
			if (node.declaration.type === 'Identifier') {
				return;
			}

			// Existing check for function or class declarations that are named
			if (node.declaration.id) {
				return;
			}

			const fileName = context.getFilename();
			const exportName = generateExportNameFromFileName(path.basename(fileName, path.extname(fileName)));

			context.report({
				node,
				message: 'Unnamed default export should be named based on the file name.',
				fix(fixer) {
					const sourceCode = context.getSourceCode();
					const declarationText = sourceCode.getText(node.declaration);
					const fixedCode = `const ${exportName} = ${declarationText};\nexport default ${exportName};`;

					return fixer.replaceText(node, fixedCode);
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
