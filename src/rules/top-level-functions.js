const meta = {
	type: 'suggestion',
	docs: {
		description: 'Require all top-level functions to be named/regular functions.',
		category: 'Stylistic Issues',
		recommended: false,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/top-level-functions.md',
	},
	fixable: 'code',
	schema: [],
};

function create(context) {
	return {
		VariableDeclarator(node) {
			if (node.parent.parent.type !== 'Program') {
				return;
			}

			const sourceCode = context.getSourceCode();

			if (node.init && node.init.type === 'ArrowFunctionExpression') {
				const functionName = node.id.name;
				const functionText = sourceCode.getText(node.init);

				context.report({
					node: node.init,
					message: 'Top-level functions must be named/regular functions.',
					fix(fixer) {
						const isSingleExpression = node.init.body.type !== 'BlockStatement';
						const functionBody = isSingleExpression
							? `{ return ${functionText.slice(functionText.indexOf('=>') + 3)}; }`
							: functionText.slice(functionText.indexOf('{'));
						const functionParameters = functionText.slice(0, functionText.indexOf('=>')).trim();

						const fixedCode = `function ${functionName}${functionParameters} ${functionBody}`;
						return fixer.replaceText(node.parent, fixedCode);
					},
				});
			}

			if (node.init && node.init.type === 'FunctionExpression') {
				const functionName = node.id.name;
				const functionText = sourceCode.getText(node.init);

				context.report({
					node: node.init,
					message: 'Top-level functions must be named/regular functions.',
					fix(fixer) {
						const fixedCode = `function ${functionName}${functionText.slice(functionText.indexOf('('))}`;
						return fixer.replaceText(node.parent, fixedCode);
					},
				});
			}
		},

		FunctionDeclaration(node) {
			if (node.id) {
				return;
			}

			if (node.parent.type === 'Program') {
				context.report({
					node,
					message: 'Top-level functions must be named.',
					fix(fixer) {
						const functionName = 'defaultFunction';
						const sourceCode = context.getSourceCode();
						const functionText = sourceCode.getText(node);
						const fixedCode = functionText.replace('function (', `function ${functionName}(`);

						return fixer.replaceText(node, fixedCode);
					},
				});
			}
		},
	};
}

const rule = {
	meta,
	create,
};

module.exports = rule;
