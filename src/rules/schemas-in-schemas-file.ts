/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable new-cap */
import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

const schemasInSchemasFile = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/schemas-in-schemas-file.md')({
	name: 'schemas-in-schemas-file',

	meta: {
		type: 'problem',
		docs: {
			description: 'Require Zod schema declarations to be placed in a .schemas.ts file.',
		},

		schema: [
			{
				type: 'object',
				properties: {
					allowedSuffixes: {
						type: 'array',
						items: { type: 'string', minLength: 1 },
					},
					onlyWhenAssigned: { type: 'boolean' },
					allowInTests: { type: 'boolean' },
				},
				additionalProperties: false,
			},
		],

		messages: {
			moveSchema: 'Zod schemas must be defined in a dedicated schemas file ({{suffixes}}).',
		},
	},

	defaultOptions: [
		{
			allowedSuffixes: ['.schemas.ts'],
			onlyWhenAssigned: false,
			allowInTests: false,
		},
	],

	create(context, [rawOptions]) {
		const options = {
			allowedSuffixes: rawOptions?.allowedSuffixes ?? ['.schemas.ts'],
			onlyWhenAssigned: rawOptions?.onlyWhenAssigned ?? false,
			allowInTests: rawOptions?.allowInTests ?? false,
		};

		const zodIdentifiers = new Set<string>();

		function filenameAllowed(filename: string): boolean {
			if (!filename || filename === '<input>') {
				return false;
			}

			if (options.allowInTests && /\.(test|spec)\.[jt]sx?$/.test(filename)) {
				return true;
			}

			return options.allowedSuffixes.some((suffix) => filename.endsWith(suffix));
		}

		function collectZodIdentifiersFromImport(node: TSESTree.ImportDeclaration): void {
			if (node.source.value !== 'zod') {
				return;
			}

			for (const spec of node.specifiers) {
				if (spec.type === AST_NODE_TYPES.ImportSpecifier && spec.imported.type === AST_NODE_TYPES.Identifier && spec.imported.name === 'z') {
					zodIdentifiers.add(spec.local.name);
				}

				if (spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
					zodIdentifiers.add(spec.local.name);
				}
			}
		}

		function isZodBuilderCall(node: TSESTree.CallExpression): boolean {
			const { callee } = node;

			return callee.type === AST_NODE_TYPES.MemberExpression && !callee.computed && callee.object.type === AST_NODE_TYPES.Identifier && zodIdentifiers.has(callee.object.name);
		}

		function isZodChainedBuilderCall(node: TSESTree.CallExpression): boolean {
			let current: TSESTree.Expression | null = node.callee;

			while (current?.type === AST_NODE_TYPES.MemberExpression && !current.computed) {
				current = current.object;
			}

			return current?.type === AST_NODE_TYPES.Identifier && zodIdentifiers.has(current.name);
		}

		function getAssignmentTarget(node: TSESTree.CallExpression): boolean {
			const { parent } = node;

			return (
				(parent?.type === AST_NODE_TYPES.VariableDeclarator && parent.id.type === AST_NODE_TYPES.Identifier) ||
				(parent?.type === AST_NODE_TYPES.AssignmentExpression && parent.left.type === AST_NODE_TYPES.Identifier)
			);
		}

		function report(node: TSESTree.CallExpression): void {
			if (filenameAllowed(context.filename)) {
				return;
			}

			if (options.onlyWhenAssigned && !getAssignmentTarget(node)) {
				return;
			}

			context.report({
				node,
				messageId: 'moveSchema',
				data: {
					suffixes: options.allowedSuffixes.join(' or ') || '.schemas.ts',
				},
			});
		}

		return {
			ImportDeclaration: collectZodIdentifiersFromImport,

			CallExpression(node: TSESTree.CallExpression) {
				if (zodIdentifiers.size === 0) {
					return;
				}

				if (isZodBuilderCall(node) || isZodChainedBuilderCall(node)) {
					report(node);
				}
			},
		};
	},
});

export default schemasInSchemasFile;
