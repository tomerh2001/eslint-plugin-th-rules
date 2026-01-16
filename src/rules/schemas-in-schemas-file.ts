import {ESLintUtils, type TSESTree} from '@typescript-eslint/utils';

type Options = [
  {
  	allowedSuffixes?: string[];
  	onlyWhenAssigned?: boolean;
  	allowInTests?: boolean;
  }?,
];

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
		const allowedSuffixes
      = options.allowedSuffixes ?? ['.schemas.ts'];

		const onlyWhenAssigned = Boolean(options.onlyWhenAssigned);
		const allowInTests = Boolean(options.allowInTests);

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
			return (
				node.source.type === 'Literal'
				&& node.source.value === 'zod'
			);
		}

		function collectZodIdentifiersFromImport(node: TSESTree.ImportDeclaration): void {
			if (!isZodModuleImport(node)) {
				return;
			}

			for (const spec of node.specifiers) {
				if (
					spec.type === 'ImportSpecifier'
					&& spec.imported.type === 'Identifier'
					&& spec.imported.name === 'z'
					&& spec.local.type === 'Identifier'
				) {
					zodIdentifiers.add(spec.local.name);
				}

				if (
					spec.type === 'ImportNamespaceSpecifier'
					&& spec.local.type === 'Identifier'
				) {
					zodIdentifiers.add(spec.local.name);
				}
			}
		}

		function isZodBuilderCall(node: TSESTree.CallExpression): boolean {
			const {callee} = node;

			if (
				callee.type !== 'MemberExpression'
				|| callee.computed
			) {
				return false;
			}

			const {object} = callee;
			const {property} = callee;

			return (
				object.type === 'Identifier'
				&& zodIdentifiers.has(object.name)
				&& property.type === 'Identifier'
			);
		}

		function isZodChainedBuilderCall(node: TSESTree.CallExpression): boolean {
			const {callee} = node;

			if (
				callee.type !== 'MemberExpression'
				|| callee.computed
			) {
				return false;
			}

			let current: TSESTree.Expression = callee.object;

			while (
				current.type === 'MemberExpression'
				&& !current.computed
			) {
				current = current.object;
			}

			return (
				current.type === 'Identifier'
				&& zodIdentifiers.has(current.name)
			);
		}

		function getAssignmentTargetName(callNode: TSESTree.CallExpression): string | undefined {
			const {parent} = callNode;

			if (
				parent?.type === 'VariableDeclarator'
				&& parent.id.type === 'Identifier'
			) {
				return parent.id.name;
			}

			if (
				parent?.type === 'AssignmentExpression'
				&& parent.left.type === 'Identifier'
			) {
				return parent.left.name;
			}

			return null;
		}

		function report(node: TSESTree.CallExpression): void {
			const filename = context.getFilename();

			if (filenameAllowed(filename)) {
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
