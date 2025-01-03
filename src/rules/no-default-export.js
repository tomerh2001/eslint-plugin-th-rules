/* eslint-disable unicorn/prefer-module */

const path = require('node:path');

const meta = {
	type: 'problem',
	docs: {
		description: 'Convert unnamed default exports to named default exports based on the file name.',
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-default-export.md',
	},
	fixable: 'code',
	schema: [],
};

function create(context) {
	function generateExportNameFromFileName(fileName) {
		return fileName.replaceAll(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
			if (match === ' ') {
				return '';
			}

			if (index === 0) {
				return match.toLowerCase();
			}

			return match.toUpperCase();
		})
			.replaceAll(/[-_<>\\. ]/g, '');
	}

	return {
		ExportDefaultDeclaration(node) {
			if (node.declaration.type === 'Identifier') {
				return;
			}

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
