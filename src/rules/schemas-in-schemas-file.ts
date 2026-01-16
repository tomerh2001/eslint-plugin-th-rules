/* eslint-disable @typescript-eslint/naming-convention */
import {AST_NODE_TYPES, ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

const schemasInSchemasFile = ESLintUtils.RuleCreator(() =>
	'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/schemas-in-schemas-file.md')({
	name: 'schemas-in-schemas-file',

	meta: {
		type: 'problem',
		docs: {
			description:
        'Require Zod schema declarations to be placed in a .schemas.ts file.',
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
					onlyWhenAssigned: {type: 'boolean'},
					allowInTests: {type: 'boolean'},
				},
				additionalProperties: false,
			},
		],
		messages: {
			moveSchema:
        'Zod schemas must be defined in a dedicated schemas file ({{suffixes}}).',
		},
	},

	defaultOptions: [
		{
			allowedSuffixes: ['.schemas.ts'],
			onlyWhenAssigned: false,
			allowInTests: false,
		},
	],

	create(context, [options]) {
		const allowedSuffixes = options.allowedSuffixes && options.allowedSuffixes.length > 0 ? options.allowedSuffixes : ['.schemas.ts'];

		const onlyWhenAssigned = options.onlyWhenAssigned ?? false;
		const allowInTests = options.allowInTests ?? false;

		const zodIdentifiers = new Set<string>();

		function filenameAllowed(filename: string): boolean {
			if (!filename || filename === '<input>') {
				return false;
			}

			if (
				allowInTests
				&& /\.(test|spec)\.[jt]sx?$/.test(filename)
			) {
				return true;
			}

			return allowedSuffixes.some(suffix =>
				filename.endsWith(suffix));
		}

		function isZodModuleImport(node: TSESTree.ImportDeclaration): boolean {
			return (node.source.value === 'zod');
		}

		function collectZodIdentifiersFromImport(node: TSESTree.ImportDeclaration): void {
			if (!isZodModuleImport(node)) {
				return;
			}

			for (const spec of node.specifiers) {
				if (
					spec.type === AST_NODE_TYPES.ImportSpecifier
					&& spec.imported.type === AST_NODE_TYPES.Identifier
					&& spec.imported.name === 'z'
				) {
					zodIdentifiers.add(spec.local.name);
				}

				if (
					spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier
				) {
					zodIdentifiers.add(spec.local.name);
				}
			}
		}

		function isZodBuilderCall(node: TSESTree.CallExpression): boolean {
			const {callee} = node;

			if (
				callee.type !== AST_NODE_TYPES.MemberExpression
				|| callee.computed
			) {
				return false;
			}

			const {object} = callee;
			const {property} = callee;

			return (
				object.type === AST_NODE_TYPES.Identifier
				&& zodIdentifiers.has(object.name)
				&& property.type === AST_NODE_TYPES.Identifier
			);
		}

		function isZodChainedBuilderCall(node: TSESTree.CallExpression): boolean {
			const {callee} = node;

			if (
				callee.type !== AST_NODE_TYPES.MemberExpression
				|| callee.computed
			) {
				return false;
			}

			let current: TSESTree.Expression = callee.object;

			while (
				current.type === AST_NODE_TYPES.MemberExpression
				&& !current.computed
			) {
				current = current.object;
			}

			return (
				current.type === AST_NODE_TYPES.Identifier
				&& zodIdentifiers.has(current.name)
			);
		}

		function getAssignmentTargetName(callNode: TSESTree.CallExpression): string | undefined {
			const {parent} = callNode;

			if (
				parent.type === AST_NODE_TYPES.VariableDeclarator
				&& parent.id.type === AST_NODE_TYPES.Identifier
			) {
				return parent.id.name;
			}

			if (
				parent.type === AST_NODE_TYPES.AssignmentExpression
				&& parent.left.type === AST_NODE_TYPES.Identifier
			) {
				return parent.left.name;
			}
		}

		function report(node: TSESTree.CallExpression): void {
			if (filenameAllowed(context.filename)) {
				return;
			}

			const targetName = getAssignmentTargetName(node);

			if (onlyWhenAssigned && !targetName) {
				return;
			}

			context.report({
				node,
				messageId: 'moveSchema',
				data: {
					suffixes: allowedSuffixes.join(' or '),
				},
			});
		}

		return {
			ImportDeclaration(node: TSESTree.ImportDeclaration) {
				collectZodIdentifiersFromImport(node);
			},

			CallExpression(node: TSESTree.CallExpression) {
				if (zodIdentifiers.size === 0) {
					return;
				}

				if (
					isZodBuilderCall(node)
					|| isZodChainedBuilderCall(node)
				) {
					report(node);
				}
			},
		};
	},
});
export default schemasInSchemasFile;
