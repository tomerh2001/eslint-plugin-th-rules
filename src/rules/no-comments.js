/* eslint-disable unicorn/prefer-module */

const allowedPatterns = [
/todo/i, // Allow TODO (case-insensitive)
/warning/i, // Allow WARNING (case-insensitive)
/error/i, // Allow ERROR (case-insensitive)
/info/i, // Allow INFO (case-insensitive)
/^\s*eslint-(disable|enable|env|globals|ignore|directive)/, // Allow ESLint directives
];

const meta = {
type: 'problem',
docs: {
    description: 'Disallow comments except for specified allowed patterns.',
    url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-comments.md'
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
const userAllowedPatterns = (options.allow || []).map((pattern) => new RegExp(pattern));
const userDisallowedPatterns = (options.disallow || []).map((pattern) => new RegExp(pattern));

function isCommentAllowed(comment) {
    const text = comment.value.trim();

    // Check if the comment is a valid JSDoc comment
    if (comment.type === 'Block' && comment.value.startsWith('*')) {
    return true; // Allow any JSDoc-style block comment (/** ... */)
    }

    // Check if the comment matches any allowed pattern
    for (const pattern of [...allowedPatterns, ...userAllowedPatterns]) {
    if (pattern.test(text)) {
        return true;
    }
    }

    // Check if the comment matches any disallowed pattern
    for (const pattern of userDisallowedPatterns) {
    if (pattern.test(text)) {
        return false;
    }
    }

    return false; // Disallow by default if no match
}

return {
    Program() {
    const sourceCode = context.getSourceCode();
    const comments = sourceCode.getAllComments();

    comments.forEach((comment) => {
        if (!isCommentAllowed(comment)) {
        context.report({
            node: comment,
            message: 'Comment not allowed.',
            fix(fixer) {
            return fixer.remove(comment);
            },
        });
        }
    });
    },
};
}

const rule = {
meta,
create,
};

module.exports = rule;