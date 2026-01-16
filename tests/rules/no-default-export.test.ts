/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-default-export';

const ruleTester = new RuleTester({});

ruleTester.run('no-default-export', rule, {
	valid: [
		{
			code: `
				const MyFile = {};
				export default MyFile;
			`,
			filename: '/project/my-file.ts',
		},

		{
			code: `
				export default function MyFile() {}
			`,
			filename: '/project/my-file.ts',
		},

		{
			code: `
				export default class MyFile {}
			`,
			filename: '/project/my-file.ts',
		},

		{
			code: `
				export const test = 123;
			`,
			filename: '/project/test.ts',
		},
	],

	invalid: [
		{
			filename: '/project/my-file.ts',
			code: `
				export default function () { return 1; }
			`,
			errors: [{ messageId: 'unnamed' }],
			output: `
				const myFile = function () { return 1; };
export default myFile;
			`,
		},

		{
			filename: '/project/some_component.ts',
			code: `
				export default class {}
			`,
			errors: [{ messageId: 'unnamed' }],
			output: `
				const someComponent = class {};
export default someComponent;
			`,
		},

		{
			filename: '/project/data-loader.js',
			code: `
				export default () => 42;
			`,
			errors: [{ messageId: 'unnamed' }],
			output: `
				const dataLoader = () => 42;
export default dataLoader;
			`,
		},

		{
			filename: '/src/utils/http-client.ts',
			code: `
				export default {
					get() {},
					post() {}
				};
			`,
			errors: [{ messageId: 'unnamed' }],
			output: `
				const httpClient = {
					get() {},
					post() {}
				};
export default httpClient;
			`,
		},

		{
			filename: '/project/components/My<Special>-File.component.tsx',
			code: `
				export default { a: 1 };
			`,
			errors: [{ messageId: 'unnamed' }],

			output: `
				const mySpecialFileComponent = { a: 1 };
export default mySpecialFileComponent;
			`,
		},
	],
});
