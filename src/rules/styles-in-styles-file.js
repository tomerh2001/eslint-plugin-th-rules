const meta = {
	type: 'problem',
	docs: {
		description: 'Require React-Native StyleSheet.create(...) to be placed in a .styles.ts/.styles.tsx file',
		category: 'Stylistic Issues',
		recommended: false,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/styles-in-styles-file.md',
	},
	schema: [
		{
			type: 'object',
			properties: {
				/**
				 * Allowed style file suffixes. Defaults:
				 * [".styles.ts", ".styles.tsx"]
				 */
				allowedSuffixes: {
					type: 'array',
					items: {type: 'string', minLength: 1},
					minItems: 1,
				},

				/**
				 * If true, also flag `StyleSheet.compose(...)` (optional).
				 */
				includeCompose: {type: 'boolean'},
			},
			additionalProperties: false,
		},
	],
	messages: {
		moveStyles:
			'React-Native styles must be moved to a .styles.ts/.styles.tsx file (for example "{{filename}}.styles.ts").',
	},
};

function create(context) {
	const options = context.options?.[0] ?? {};
	const allowedSuffixes = options.allowedSuffixes ?? ['.styles.ts', '.styles.tsx'];
	const includeCompose = Boolean(options.includeCompose);

	function isAllowedStyleFile(filename) {
		if (!filename || filename === '<input>') {
			return false;
		}

		return allowedSuffixes.some(suffix => filename.endsWith(suffix));
	}

	function isStyleSheetMemberCall(node, memberName) {
		const callee = node?.callee;
		if (!callee || callee.type !== 'MemberExpression') {
			return false;
		}

		const object = callee.object;
		const property = callee.property;

		const isStyleSheet
			= object
			&& object.type === 'Identifier'
			&& object.name === 'StyleSheet';

		const isMember
			= !callee.computed
			&& property
			&& property.type === 'Identifier'
			&& property.name === memberName;

		return isStyleSheet && isMember;
	}

	function report(node) {
		const filename = context.getFilename();
		if (isAllowedStyleFile(filename)) {
			return;
		}

		context.report({
			node,
			messageId: 'moveStyles',
			data: {
				filename,
				suffixes: allowedSuffixes.join(' or '),
			},
		});
	}

	return {
		CallExpression(node) {
			if (isStyleSheetMemberCall(node, 'create')) {
				report(node);
				return;
			}

			if (includeCompose && isStyleSheetMemberCall(node, 'compose')) {
				report(node);
			}
		},
	};
}

module.exports = {
	meta,
	create,
};
