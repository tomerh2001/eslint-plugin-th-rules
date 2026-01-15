/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as path from 'node:path';
import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/types-in-dts';

const ruleTester = new RuleTester({});

function file(name: string): string {
	return path.join(process.cwd(), 'tests/fixtures', name);
}

ruleTester.run('types-in-dts', rule, {
	valid: [
		//
		// ---------------------------------------------------------------------
		// VALID CASES
		// ---------------------------------------------------------------------
		//

		// All declarations inside .d.ts → valid
		{
			filename: file('good.d.ts'),
			code: `
        export interface User { id: string }
        export type X = number;
        export enum E { A = 1 }
      `,
		},

		// AllowEnums = true → enums allowed in .ts
		{
			filename: file('enum-ok.ts'),
			options: [{allowEnums: true}],
			code: `
        export enum Status {
          A = "A",
          B = "B"
        }
      `,
		},

		// AllowDeclare = true → declared interface allowed
		{
			filename: file('declared-interface.ts'),
			options: [{allowDeclare: true}],
			code: `
        declare interface Foo {
          x: number;
        }
      `,
		},

		// AllowDeclare = true → declared type allowed
		{
			filename: file('declared-type.ts'),
			options: [{allowDeclare: true}],
			code: `
        declare type Z = string;
      `,
		},

		// AllowDeclare = true → declared enum allowed (important fix)
		{
			filename: file('declare-enum.ts'),
			options: [{allowDeclare: true}],
			code: `
        declare enum K { A = 1 }
      `,
		},

		// No declarations → no errors
		{
			filename: file('no-decls.ts'),
			code: `
        const x = 5;
        function f(a: string): void {}
      `,
		},
	],

	invalid: [
		//
		// ---------------------------------------------------------------------
		// INVALID CASES
		// ---------------------------------------------------------------------
		//

		// Type alias in .ts → 1 error
		{
			filename: file('type.ts'),
			code: `
        export type A = string;
      `,
			errors: [{messageId: 'moveToDts'}],
		},

		// Interface in .ts → 1 error
		{
			filename: file('iface.ts'),
			code: `
        interface User {
          id: number;
        }
      `,
			errors: [{messageId: 'moveToDts'}],
		},

		// Enum in .ts when allowEnums = false → 1 error
		{
			filename: file('enum.ts'),
			code: `
        enum X { A, B }
      `,
			errors: [{messageId: 'moveToDts'}],
		},

		// Multiple declarations → 3 errors
		{
			filename: file('multi.ts'),
			code: `
        type A = number;
        interface B { x: string }
        enum C { A = 1 }
      `,
			errors: [
				{messageId: 'moveToDts'},
				{messageId: 'moveToDts'},
				{messageId: 'moveToDts'},
			],
		},

		// AllowDeclare=false → declared type still invalid
		{
			filename: file('declared-type-not-allowed.ts'),
			options: [{allowDeclare: false}],
			code: `
        declare type Z = number;
      `,
			errors: [{messageId: 'moveToDts'}],
		},

		// AllowEnums=true → enum allowed, but type not allowed
		{
			filename: file('enum-allowed-but-type-error.ts'),
			options: [{allowEnums: true}],
			code: `
        enum A { X = 1 }
        type T = string;
      `,
			errors: [{messageId: 'moveToDts'}],
		},

		// AllowDeclare=true → declared interface allowed
		// BUT enum still not allowed (allowEnums default = false)
		{
			filename: file('mixed.ts'),
			options: [{allowDeclare: true}],
			code: `
        declare interface Foo { a: string }
        type Nope = number;
        enum E { A = 1 }
      `,
			errors: [
				{messageId: 'moveToDts'}, // Type
				{messageId: 'moveToDts'}, // Enum
			],
		},
	],
});
