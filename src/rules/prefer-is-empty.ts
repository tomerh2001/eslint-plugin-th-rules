import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

export default ESLintUtils.RuleCreator(
  () =>
    "https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/prefer-is-empty.md"
)({
  name: "prefer-is-empty",

  meta: {
    type: "problem",
    docs: {
      description: "Require _.isEmpty instead of length comparisons."
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      useIsEmpty:
        "Use _.isEmpty({{collection}}) instead of checking {{collection}}.length {{operator}} {{value}}."
    }
  },

  defaultOptions: [],

  create(context) {
    const sourceCode = context.getSourceCode();

    function isLengthAccess(
      node: TSESTree.Node | null | undefined
    ): node is TSESTree.MemberExpression {
      return (
        !!node &&
        node.type === "MemberExpression" &&
        node.property.type === "Identifier" &&
        node.property.name === "length" &&
        node.computed === false
      );
    }

    function isNumericLiteral(
      node: TSESTree.Node | null | undefined
    ): node is TSESTree.Literal & { value: number } {
      return (
        !!node &&
        node.type === "Literal" &&
        typeof node.value === "number"
      );
    }

    function report(
      node: TSESTree.BinaryExpression,
      collectionNode: TSESTree.MemberExpression,
      operator: string,
      value: number,
      isEmptyCheck: boolean
    ) {
      const collectionText = sourceCode.getText(collectionNode.object);
      const replacement = isEmptyCheck
        ? `_.isEmpty(${collectionText})`
        : `!_.isEmpty(${collectionText})`;

      context.report({
        node,
        messageId: "useIsEmpty",
        data: {
          collection: collectionText,
          operator,
          value
        },
        suggest: [
          {
            messageId: "useIsEmpty",
            data: {
              collection: collectionText,
              operator,
              value
            },
            fix(fixer) {
              return fixer.replaceText(node, replacement);
            }
          }
        ]
      });
    }

    return {
      BinaryExpression(node: TSESTree.BinaryExpression) {
        const { left, right, operator } = node;

        //
        // Case 1: values.length <op> N
        //
        if (isLengthAccess(left) && isNumericLiteral(right)) {
          const value = right.value;

          // EMPTY checks
          if (
            (operator === "===" && value === 0) ||
            (operator === "<=" && value === 0) ||
            (operator === "<" && value === 1)
          ) {
            report(node, left, operator, value, true);
            return;
          }

          // NOT EMPTY checks
          if (
            (operator === ">" && value === 0) ||
            (operator === ">=" && value === 1) ||
            ((operator === "!=" || operator === "!==") && value === 0)
          ) {
            report(node, left, operator, value, false);
          }
        }

        //
        // Case 2: N <op> values.length (reverse order)
        //
        if (isNumericLiteral(left) && isLengthAccess(right)) {
          const value = left.value;

          // EMPTY checks
          if (
            (operator === "===" && value === 0) ||
            (operator === ">=" && value === 0) ||
            (operator === ">" && value === 0)
          ) {
            report(node, right, operator, value, true);
            return;
          }

          // NOT EMPTY checks
          if (
            (operator === "<" && value === 1) ||
            (operator === "<=" && value === 0)
          ) {
            report(node, right, operator, value, false);
          }
        }
      }
    };
  }
});