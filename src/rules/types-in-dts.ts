/* eslint-disable new-cap */
import _ from 'lodash';
import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const typesInDts = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/types-in-dts.md')({
	name: 'types-in-dts',

	meta: {
		type: 'problem',
		docs: {
			description: 'Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files.',
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowEnums: { type: 'boolean' },
					allowDeclare: { type: 'boolean' },
				},
				additionalProperties: false,
			},
		],
		messages: {
			moveToDts: 'Type declarations must be defined in a .d.ts file.',
		},
	},

	defaultOptions: [
		{
			allowEnums: false,
			allowDeclare: false,
		},
	],

	create(context, [options]) {
		function isDtsFile(filename: string): boolean {
			if (_.isNil(filename) || filename === '<input>') {
				return false;
			}

			return filename.endsWith('.d.ts');
		}

		function hasDeclareModifier(node: TSESTree.TSTypeAliasDeclaration | TSESTree.TSInterfaceDeclaration | TSESTree.TSEnumDeclaration): boolean {
			if ('declare' in node && node.declare) {
				return true;
			}

			const modifiers = 'modifiers' in node && Array.isArray(node.modifiers) ? node.modifiers : [];

			return modifiers.some((m) => m?.type === 'TSDeclareKeyword');
		}

		function reportIfNotDts(node: TSESTree.TSTypeAliasDeclaration | TSESTree.TSInterfaceDeclaration | TSESTree.TSEnumDeclaration): void {
			if (isDtsFile(context.filename)) {
				return;
			}

			if (options.allowDeclare && hasDeclareModifier(node)) {
				return;
			}

			context.report({
				node,
				messageId: 'moveToDts',
			});
		}

		return {
			TSTypeAliasDeclaration(node: TSESTree.TSTypeAliasDeclaration) {
				reportIfNotDts(node);
			},

			TSInterfaceDeclaration(node: TSESTree.TSInterfaceDeclaration) {
				reportIfNotDts(node);
			},

			TSEnumDeclaration(node: TSESTree.TSEnumDeclaration) {
				if (options.allowEnums) {
					return;
				}

				reportIfNotDts(node);
			},
		};
	},
});
export default typesInDts;
