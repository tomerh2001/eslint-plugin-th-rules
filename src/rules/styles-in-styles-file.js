const meta = {
	type: 'problem',
	docs: {
		description: 'Require React-Native StyleSheet.create(...) to be placed in a .styles.ts file',
		category: 'Stylistic Issues',
		recommended: false,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/styles-in-styles-file.md',
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
				includeCompose: {type: 'boolean'},
			},
			additionalProperties: false,
		},
	],
	messages: {
		moveStyles:
			'React-Native styles must be defined in a dedicated styles file ({{suffixes}}).',
	},
};

function create(context) {
	const options = context.options?.[0] ?? {};
	const allowedSuffixes = options.allowedSuffixes ?? ['.styles.ts'];
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

		return (
			object?.type === 'Identifier'
			&& object.name === 'StyleSheet'
			&& !callee.computed
			&& property?.type === 'Identifier'
			&& property.name === memberName
		);
	}

	/**
	 * Try to infer the “name” of the style object, e.g.:
	 *   const styles = StyleSheet.create(...)      -> "styles"
	 *   styles = StyleSheet.create(...)            -> "styles"
	 *   exports.styles = StyleSheet.create(...)    -> "exports.styles"
	 */
	function getAssignmentTargetName(callNode) {
		const p = callNode.parent;

		if (p?.type === 'VariableDeclarator') {
			const id = p.id;
			if (id?.type === 'Identifier') {
				return id.name;
			}

			return null;
		}

		if (p?.type === 'AssignmentExpression') {
			const left = p.left;

			if (left?.type === 'Identifier') {
				return left.name;
			}

			if (left?.type === 'MemberExpression' && !left.computed) {
				const object = left.object;
				const property = left.property;

				const objectName
					= object?.type === 'Identifier'
						? object.name
						: (object?.type === 'ThisExpression'
							? 'this'
							: null);

				const propertyName = property?.type === 'Identifier' ? property.name : null;

				if (objectName && propertyName) {
					return `${objectName}.${propertyName}`;
				}
			}

			return null;
		}

		return null;
	}

	function report(node) {
		const filename = context.getFilename();
		if (isAllowedStyleFile(filename)) {
			return;
		}

		const targetName = getAssignmentTargetName(node);
		const target = targetName ? ` "${targetName}"` : '';

		context.report({
			node,
			messageId: 'moveStyles',
			data: {
				filename,
				suffixes: allowedSuffixes.join(' or '),
				target,
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

module.exports = {meta, create};
