/**
 * @fileoverview Enforce that TypeScript type declarations exist only in .d.ts files.
 */

const meta = {
	type: 'problem',
	docs: {
		description: 'Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files',
		category: 'Best Practices',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/types-in-dts.md',
	},
	schema: [
		{
			type: 'object',
			properties: {
				allowEnums: {type: 'boolean'},
				allowDeclare: {type: 'boolean'},
			},
			additionalProperties: false,
		},
	],
	messages: {
		moveToDts:
			'Type declarations must be moved to a .d.ts file (for example "{{filename}}.d.ts").',
	},
};

/**
 * @param {import('eslint').Rule.RuleContext} context
 */
function create(context) {
	const options = context.options?.[0] ?? {};
	const allowEnums = Boolean(options.allowEnums);
	const allowDeclare = Boolean(options.allowDeclare);

	function isDtsFile(filename) {
		if (!filename || filename === '<input>') {
			return false;
		}

		return filename.endsWith('.d.ts');
	}

	function hasDeclareModifier(node) {
		if (node && node.declare === true) {
			return true;
		}

		const mods = node && Array.isArray(node.modifiers) ? node.modifiers : [];
		return mods.some(m => m && m.type === 'TSDeclareKeyword');
	}

	function reportIfNotDts(node) {
		const filename = context.getFilename();
		if (isDtsFile(filename)) {
			return;
		}

		if (allowDeclare && hasDeclareModifier(node)) {
			return;
		}

		context.report({
			node,
			messageId: 'moveToDts',
			data: {filename},
		});
	}

	return {

		TSTypeAliasDeclaration(node) {
			reportIfNotDts(node);
		},

		TSInterfaceDeclaration(node) {
			reportIfNotDts(node);
		},

		TSEnumDeclaration(node) {
			if (allowEnums) {
				return;
			}

			reportIfNotDts(node);
		},

	};
}

module.exports = {
	meta,
	create,
};
