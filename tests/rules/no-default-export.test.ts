/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-default-export';

const ruleTester = new RuleTester({});

ruleTester.run('no-default-export', rule, {
	valid: [
		// Named default export – allowed
		{
			code: `
				const MyFile = {};
				export default MyFile;
			`,
			filename: '/project/my-file.ts',
		},

		// Named function – allowed
		{
			code: `
				export default function MyFile() {}
			`,
			filename: '/project/my-file.ts',
		},

		// Named class – allowed
		{
			code: `
				export default class MyFile {}
			`,
			filename: '/project/my-file.ts',
		},

		// No default export at all
		{
			code: `
				export const test = 123;
			`,
			filename: '/project/test.ts',
		},
	],

	invalid: [
		// Anonymous function default export
		{
			filename: '/project/my-file.ts',
			code: `
				export default function () { return 1; }
			`,
			errors: [{messageId: 'unnamed'}],
			output: `
				const myFile = function () { return 1; };
export default myFile;
			`,
		},

		// Anonymous class default export
		{
			filename: '/project/some_component.ts',
			code: `
				export default class {}
			`,
			errors: [{messageId: 'unnamed'}],
			output: `
				const someComponent = class {};
export default someComponent;
			`,
		},

		// Default export of an inline arrow function
		{
			filename: '/project/data-loader.js',
			code: `
				export default () => 42;
			`,
			errors: [{messageId: 'unnamed'}],
			output: `
				const dataLoader = () => 42;
export default dataLoader;
			`,
		},

		// Object literal export
		{
			filename: '/src/utils/http-client.ts',
			code: `
				export default {
					get() {},
					post() {}
				};
			`,
			errors: [{messageId: 'unnamed'}],
			output: `
				const httpClient = {
					get() {},
					post() {}
				};
export default httpClient;
			`,
		},

		// Complex name-generation check
		{
			filename: '/project/components/My<Special>-File.component.tsx',
			code: `
				export default { a: 1 };
			`,
			errors: [{messageId: 'unnamed'}],
			// Name generation removes `< > - .` and applies the camelization logic
			output: `
				const mySpecialFileComponent = { a: 1 };
export default mySpecialFileComponent;
			`,
		},
	],
});
