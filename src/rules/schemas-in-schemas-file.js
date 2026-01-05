const meta = {
	type: 'problem',
	docs: {
		description: 'Require Zod schema declarations to be placed in a .schemas.ts file',
		category: 'Stylistic Issues',
		recommended: false,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/schemas-in-schemas-file.md',
	},
	schema: [
		{
			type: 'object',
			properties: {
				allowedSuffixes: {
					type: 'array',
					items: {type: 'string', minLength: 1},
					minItems: 1,
				},
				/**
				 * If true, only report when the Zod call is assigned to a variable
				 * (e.g. const userSchema = z.object(...)).
				 * If false, report any Zod schema-building call expression.
				 */
				onlyWhenAssigned: {type: 'boolean'},

				/**
				 * If true, allow Zod calls inside *.test.* / *.spec.* files.
				 */
				allowInTests: {type: 'boolean'},
			},
			additionalProperties: false,
		},
	],
	messages: {
		moveSchema:
			'Zod schemas must be defined in a dedicated schemas file ({{suffixes}}).',
	},
};

function create(context) {
	const options = context.options?.[0] ?? {};
	const allowedSuffixes = options.allowedSuffixes ?? ['.schemas.ts'];
	const onlyWhenAssigned = Boolean(options.onlyWhenAssigned);
	const allowInTests = Boolean(options.allowInTests);

	/** @type {Set<string>} */
	const zodIdentifiers = new Set();

	function filenameAllowed(filename) {
		if (!filename || filename === '<input>') {
			return false;
		}

		if (allowInTests
			&& /\.(test|spec)\.[jt]sx?$/.test(filename)) {
			return true;
		}

		return allowedSuffixes.some(suffix => filename.endsWith(suffix));
	}

	function isZodModuleImport(node) {
		return node?.source?.type === 'Literal' && node.source.value === 'zod';
	}

	function collectZodIdentifiersFromImport(node) {
		if (!isZodModuleImport(node)) {
			return;
		}

		for (const spec of node.specifiers ?? []) {
			if (spec.type === 'ImportSpecifier') {
				const imported = spec.imported;
				const local = spec.local;

				if (imported?.type === 'Identifier' && imported.name === 'z' && local?.type === 'Identifier') {
					zodIdentifiers.add(local.name);
				}
			}

			if (spec.type === 'ImportNamespaceSpecifier' && spec.local?.type === 'Identifier') {
				zodIdentifiers.add(spec.local.name);
			}
		}
	}

	function isZodBuilderCall(node) {
		const callee = node?.callee;
		if (!callee || callee.type !== 'MemberExpression') {
			return false;
		}

		if (callee.computed) {
			return false;
		}

		const object = callee.object;
		const property = callee.property;

		if (object?.type !== 'Identifier') {
			return false;
		}

		if (!zodIdentifiers.has(object.name)) {
			return false;
		}

		return property?.type === 'Identifier';
	}

	function isZodChainedBuilderCall(node) {
		const callee = node?.callee;
		if (!callee || callee.type !== 'MemberExpression') {
			return false;
		}

		if (callee.computed) {
			return false;
		}

		let current = callee.object;
		while (current && current.type === 'MemberExpression' && !current.computed) {
			current = current.object;
		}

		return current?.type === 'Identifier' && zodIdentifiers.has(current.name);
	}

	function getAssignmentTargetName(callNode) {
		const p = callNode.parent;

		if (p?.type === 'VariableDeclarator') {
			if (p.id?.type === 'Identifier') {
				return p.id.name;
			}

			return null;
		}

		if (p?.type === 'AssignmentExpression') {
			if (p.left?.type === 'Identifier') {
				return p.left.name;
			}

			return null;
		}

		return null;
	}

	function report(node) {
		const filename = context.getFilename();
		if (filenameAllowed(filename)) {
			return;
		}

		const targetName = getAssignmentTargetName(node);
		if (onlyWhenAssigned && !targetName) {
			return;
		}

		const target = targetName ? ` "${targetName}"` : '';

		context.report({
			node,
			messageId: 'moveSchema',
			data: {
				filename,
				suffixes: allowedSuffixes.join(' or '),
				target,
			},
		});
	}

	return {
		ImportDeclaration(node) {
			collectZodIdentifiersFromImport(node);
		},

		CallExpression(node) {
			if (zodIdentifiers.size === 0) {
				return;
			}

			if (isZodBuilderCall(node) || isZodChainedBuilderCall(node)) {
				report(node);
			}
		},
	};
}

module.exports = {meta, create};
