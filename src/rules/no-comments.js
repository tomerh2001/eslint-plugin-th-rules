/* eslint-disable unicorn/prefer-module */

const allowedPatterns = [
	/todo/i, // Allow TODO (case-insensitive)
	/warning/i, // Allow WARNING (case-insensitive)
	/error/i, // Allow ERROR (case-insensitive)
	/info/i, // Allow INFO (case-insensitive)
	/^\s*eslint-(disable|enable|env|globals|ignore|directive)/,
];

const meta = {
	type: 'problem',
	docs: {
		description: 'Disallow comments except for specified allowed patterns.',
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-comments.md',
	},
	fixable: 'code',
	schema: [
		{
			type: 'object',
			properties: {
				allow: {
					type: 'array',
					items: {
						type: 'string',
					},
					description: 'Additional patterns to allow in comments.',
				},
				disallow: {
					type: 'array',
					items: {
						type: 'string',
					},
					description: 'Additional patterns to disallow in comments.',
				},
			},
			additionalProperties: false,
		},
	],
};

function create(context) {
	const options = context.options[0] || {};
	const userAllowedPatterns = (options.allow || []).map(pattern => new RegExp(pattern));
	const userDisallowedPatterns = (options.disallow || []).map(pattern => new RegExp(pattern));

	function isCommentAllowed(comment) {
		const text = comment.value.trim();

		if (comment.type === 'Block' && comment.value.startsWith('*')) {
			return true;
		}

		for (const pattern of [...allowedPatterns, ...userAllowedPatterns]) {
			if (pattern.test(text)) {
				return true;
			}
		}

		for (const pattern of userDisallowedPatterns) {
			if (pattern.test(text)) {
				return false;
			}
		}

		return false;
	}

	return {
		Program() {
			const sourceCode = context.getSourceCode();
			const comments = sourceCode.getAllComments();

			for (const comment of comments) {
				if (!isCommentAllowed(comment)) {
					context.report({
						node: comment,
						message: 'Comment not allowed.',
						fix(fixer) {
							return fixer.remove(comment);
						},
					});
				}
			}
		},
	};
}

const rule = {
	meta,
	create,
};

module.exports = rule;
