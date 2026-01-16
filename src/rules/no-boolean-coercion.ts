import {
	ESLintUtils,
	type TSESTree,
} from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(() => 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-boolean-coercion.md');

const noBooleanCoercion = createRule({
	name: 'no-boolean-coercion',
	meta: {
		type: 'problem',
		docs: {
			description:
        'Disallow Boolean(value) or !!value. Enforce explicit checks: !_.isNil(value) for scalars and !_.isEmpty(value) for strings, arrays, and objects.',
		},
		hasSuggestions: true,
		schema: [],
		messages: {
			useIsEmpty:
        'Boolean coercion is not allowed. Use !_.isEmpty(value) for strings, arrays, and objects.',
			useIsNil:
        'Boolean coercion is not allowed. Use !_.isNil(value) for scalar values.',
		},
	},
	defaultOptions: [],
	create(context) {
		const {sourceCode} = context;
		const services = ESLintUtils.getParserServices(context);
		const checker = services?.program?.getTypeChecker?.();

		function isBooleanCall(node: TSESTree.Node): node is TSESTree.CallExpression {
			return (
				node.type === 'CallExpression'
				&& node.callee.type === 'Identifier'
				&& node.callee.name === 'Boolean'
				&& node.arguments.length === 1
			);
		}

		function isDoubleNegation(node: TSESTree.Node): node is TSESTree.UnaryExpression {
			return (
				node.type === 'UnaryExpression'
				&& node.operator === '!'
				&& node.argument.type === 'UnaryExpression'
				&& node.argument.operator === '!'
			);
		}

		function isCollectionLikeByTS(node: TSESTree.Node): boolean {
			if (!checker || !services.esTreeNodeToTSNodeMap) {
				return false;
			}

			const tsNode = services.esTreeNodeToTSNodeMap.get(node);
			if (!tsNode) {
				return false;
			}

			const type = checker.getTypeAtLocation(tsNode);
			const typeString = checker.typeToString(type);

			return (
				typeString.includes('[]')
				|| typeString === 'string'
				|| typeString === 'object'
				|| typeString.startsWith('Array<')
				|| typeString.startsWith('ReadonlyArray<')
			);
		}

		function isCollectionLikeBySyntax(node: TSESTree.Node): boolean {
			return (
				node.type === 'ArrayExpression'
				|| node.type === 'ObjectExpression'
				|| (node.type === 'Literal' && typeof node.value === 'string')
			);
		}

		function report(node: TSESTree.Node, valueNode: TSESTree.Node) {
			const isCollection
        = isCollectionLikeBySyntax(valueNode)
        	|| isCollectionLikeByTS(valueNode);

			const suggestedFn = isCollection ? '_.isEmpty' : '_.isNil';
			const replacement = `!${suggestedFn}(${sourceCode.getText(valueNode)})`;

			context.report({
				node,
				messageId: isCollection ? 'useIsEmpty' : 'useIsNil',
				suggest: [
					{
						messageId: isCollection ? 'useIsEmpty' : 'useIsNil',
						fix(fixer) {
							return fixer.replaceText(node, replacement);
						},
					},
				],
			});
		}

		return {
			CallExpression(node) {
				if (isBooleanCall(node)) {
					const arg = node.arguments[0];
					if (arg) {
						report(node, arg);
					}
				}
			},

			UnaryExpression(node) {
				if (isDoubleNegation(node)) {
					const valueNode = (node.argument as TSESTree.UnaryExpression).argument;
					if (valueNode) {
						report(node, valueNode);
					}
				}
			},
		};
	},
});
export default noBooleanCoercion;
