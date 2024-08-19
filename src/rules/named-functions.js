module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce top-level functions to be named function declarations',
      url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/named-functions.md',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    function reportAndFix(node, varName) {
      context.report({
        node,
        message: 'Top-level functions must be named function declarations.',
        fix(fixer) {
          const sourceCode = context.getSourceCode();

          if (node.type === 'ArrowFunctionExpression') {
            // Convert arrow function to a named function declaration
            const functionBody = sourceCode.getText(node.body);
            const functionParams = sourceCode.getText(node.params);
            const asyncKeyword = node.async ? 'async ' : '';

            let functionDeclaration;

            if (node.body.type === 'BlockStatement') {
              functionDeclaration = `${asyncKeyword}function ${varName}(${functionParams}) ${functionBody}`;
            } else {
              // For concise body (single expression)
              functionDeclaration = `${asyncKeyword}function ${varName}(${functionParams}) { return ${functionBody}; }`;
            }

            return fixer.replaceText(node.parent, functionDeclaration);
          }

          if (node.type === 'FunctionExpression') {
            // Convert anonymous function expression to named function declaration
            const functionBody = sourceCode.getText(node.body);
            const functionParams = sourceCode.getText(node.params);
            const asyncKeyword = node.async ? 'async ' : '';
            const generatorKeyword = node.generator ? '*' : '';

            const functionDeclaration = `${asyncKeyword}function ${generatorKeyword}${varName}(${functionParams}) ${functionBody}`;
            return fixer.replaceText(node.parent, functionDeclaration);
          }

          return null;
        },
      });
    }

    return {
      Program(programNode) {
        programNode.body.forEach((node) => {
          // Handle VariableDeclaration (e.g. const function_ = () => {})
          if (node.type === 'VariableDeclaration') {
            node.declarations.forEach((declaration) => {
              // Ensure that declaration.init is defined and that it's a function expression or arrow function
              if (
                declaration.init &&
                (declaration.init.type === 'ArrowFunctionExpression' || declaration.init.type === 'FunctionExpression')
              ) {
                const varName = declaration.id.name;
                reportAndFix(declaration.init, varName);
              }
            });
          }

          // Handle anonymous top-level function declarations
          if (node.type === 'FunctionDeclaration' && !node.id) {
            reportAndFix(node, 'Anonymous');
          }

          // Handle ExpressionStatement for top-level arrow function (though uncommon)
          if (node.type === 'ExpressionStatement' && node.expression.type === 'ArrowFunctionExpression') {
            reportAndFix(node.expression, 'Anonymous');
          }
        });
      },
    };
  },
};