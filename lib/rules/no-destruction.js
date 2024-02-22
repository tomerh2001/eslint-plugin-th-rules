const MAX_TAB_COUNT = 3;

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow destructuring that does not meet certain conditions",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          maximumDestructuredVariables: {
            type: "integer",
            minimum: 0,
          },
          maximumLineLength: {
            type: "integer",
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const MAX_VARIABLES = context?.options[0]?.maximumDestructuredVariables || 2;
    const MAX_LINE_LENGTH = context?.options[0]?.maximumLineLength || 100;
    
    return {
      VariableDeclarator(node) {
        const sourceCode = context.getSourceCode();
        const line = sourceCode.lines[node.loc.start.line - 1];
        const lineLength = line.length;
        const tabCount = line.search(/\S|$/); 
        if (node?.id?.type === "ObjectPattern") {
          if (tabCount > MAX_TAB_COUNT) {
            context.report({
              node,
              message: `Destruction at a nesting level above ${MAX_TAB_COUNT} is not allowed, instead saw ${tabCount} levels of nesting`,
            });
          }
          else if (node?.id?.properties?.length > MAX_VARIABLES) {
            context.report({
              node,
              message: `Destruction of more than ${MAX_VARIABLES} variables is not allowed`,
            });
          }
          if (lineLength > MAX_LINE_LENGTH) {
            context.report({
              node,
              message: `Destruction on a line exceeding ${MAX_LINE_LENGTH} characters is not allowed`,
            });
          }
        }
      },
    };
  },
};
