import path from 'node:path';
import {ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator(() =>
	'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-default-export.md')({
	name: 'no-default-export',
	meta: {
		type: 'problem',
		docs: {
			description: 'Convert unnamed default exports to named default exports based on the file name.',
		},
		fixable: 'code',
		schema: [],
		messages: {
			unnamed: 'Unnamed default export should be named based on the file name.',
		},
	},

	defaultOptions: [],

	create(context) {
		function generateExportNameFromFileName(fileName: string): string {
			return fileName
				.replaceAll(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
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
			ExportDefaultDeclaration(node: TSESTree.ExportDefaultDeclaration) {
				// 1. If already an identifier default export → skip
				if (node.declaration.type === 'Identifier') {
					return;
				}

				// 2. If the declaration already has a name → skip
				// (e.g. function Foo() {})
				if (
					'id' in node.declaration
					&& node.declaration.id != null
				) {
					return;
				}

				const fileName = context.getFilename();
				const base = path.basename(fileName, path.extname(fileName));
				const exportName = generateExportNameFromFileName(base);

				context.report({
					node,
					messageId: 'unnamed',

					fix(fixer) {
						const sourceCode = context.getSourceCode();
						const declText = sourceCode.getText(node.declaration);

						const replacement = `const ${exportName} = ${declText};\nexport default ${exportName};`;

						return fixer.replaceText(node, replacement);
					},
				});
			},
		};
	},
});
