import {ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

type Options = [
  {
  	allow?: string[];
  	disallow?: string[];
  }?,
];

type MessageIds = 'commentNotAllowed';

const DEFAULT_ALLOWED_PATTERNS: RegExp[] = [
	/todo/i, // Allow TODO (case-insensitive)
	/warning/i, // Allow WARNING (case-insensitive)
	/error/i, // Allow ERROR (case-insensitive)
	/info/i, // Allow INFO (case-insensitive)
	/^\s*eslint-(disable|enable|env|globals|ignore|directive)/,
];

const noComments = ESLintUtils.RuleCreator(() =>
	'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-comments.md')<Options, MessageIds>({
	name: 'no-comments',

	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow comments except for specified allowed patterns.',
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					allow: {
						type: 'array',
						items: {type: 'string'},
						description: 'Additional patterns to allow in comments.',
					},
					disallow: {
						type: 'array',
						items: {type: 'string'},
						description: 'Additional patterns to disallow in comments.',
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			commentNotAllowed: 'Comment not allowed.',
		},
	},

	defaultOptions: [],

	create(context) {
		const option = context.options[0] ?? {};
		const userAllowedPatterns = (option.allow ?? []).map(pattern => new RegExp(pattern));
		const userDisallowedPatterns = (option.disallow ?? []).map(pattern => new RegExp(pattern));

		function isCommentAllowed(comment: TSESTree.Comment): boolean {
			const text = comment.value.trim();

			if (comment.type === 'Block' && comment.value.startsWith('*')) {
				return true;
			}

			for (const pattern of [
				...DEFAULT_ALLOWED_PATTERNS,
				...userAllowedPatterns,
			]) {
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
							messageId: 'commentNotAllowed',
							fix(fixer) {
								return fixer.remove(comment);
							},
						});
					}
				}
			},
		};
	},
});
export default noComments;
