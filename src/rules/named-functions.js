module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce top-level functions to be named functions',
      url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/named-functions.md',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    function reportAndFix(node, name) {
      context.report({
        node,
        message: 'Top-level functions must be named function declarations.',
        fix(fixer) {
          if (node.type === 'FunctionExpression' && node.parent.type === 'VariableDeclarator') {
            // Convert to a function declaration
            const sourceCode = context.getSourceCode();
            const varName = node.parent.id.name;
            const functionBody = sourceCode.getText(node.body);
            const functionParams = sourceCode.getText(node.params);
            const asyncKeyword = node.async ? 'async ' : '';
            const generatorKeyword = node.generator ? '*' : '';

            const functionDeclaration = `${asyncKeyword}function ${generatorKeyword}${varName}(${functionParams}) ${functionBody}`;
            return fixer.replaceText(node.parent.parent, functionDeclaration);
          }

          if (node.type === 'FunctionExpression') {
            // Convert to a function declaration
            const sourceCode = context.getSourceCode();
            const functionBody = sourceCode.getText(node.body);
            const functionParams = sourceCode.getText(node.params);
            const asyncKeyword = node.async ? 'async ' : '';
            const generatorKeyword = node.generator ? '*' : '';

            const functionDeclaration = `${asyncKeyword}function ${generatorKeyword}${name}(${functionParams}) ${functionBody}`;
            return fixer.replaceText(node, functionDeclaration);
          }

          return null;
        },
      });
    }

    return {
      Program(programNode) {
        const topLevelNodes = programNode.body;

        topLevelNodes.forEach((node) => {
          if (node.type === 'FunctionDeclaration') {
            // Skip if already a named function declaration
            return;
          }

          if (
            node.type === 'FunctionExpression' ||
            (node.type === 'VariableDeclaration' && node.declarations[0].init?.type === 'FunctionExpression')
          ) {
            // Force it to be a named function declaration
            if (node.type === 'VariableDeclaration') {
              const varName = node.declarations[0].id.name;
              reportAndFix(node.declarations[0].init, varName);
            } else {
              reportAndFix(node, 'Anonymous');
            }
          }

          if (node.type === 'ExpressionStatement' && node.expression.type === 'ArrowFunctionExpression') {
            // Convert arrow functions into named function declarations
            const varName = node.expression.id ? node.expression.id.name : 'Anonymous';
            reportAndFix(node.expression, varName);
          }
        });
      },
    };
  },
};