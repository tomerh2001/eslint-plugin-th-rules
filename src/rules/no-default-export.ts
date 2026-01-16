import * as path from 'node:path';
import {ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

const noDefaultExport = ESLintUtils.RuleCreator(() =>
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
			const cleaned = fileName.replaceAll(/[^a-zA-Z\d]+/g, ' ');

			const parts = cleaned
				.trim()
				.split(/\s+/g)
				.filter(Boolean);

			if (parts.length === 0) {
				return 'defaultExport';
			}

			const [first, ...rest] = parts;

			return (
				first.charAt(0).toLowerCase() + first.slice(1)
			) + rest
				.map(p => p.charAt(0).toUpperCase() + p.slice(1))
				.join('');
		}

		return {
			ExportDefaultDeclaration(node: TSESTree.ExportDefaultDeclaration) {
				if (node.declaration.type === 'Identifier') {
					return;
				}

				if ('id' in node.declaration && node.declaration.id != null) {
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
export default noDefaultExport;

