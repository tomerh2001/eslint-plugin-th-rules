/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as path from 'node:path';
import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/schemas-in-schemas-file';

const ruleTester = new RuleTester({});

function file(name: string): string {
	return path.join(process.cwd(), 'tests/fixtures', name);
}

ruleTester.run('schemas-in-schemas-file', rule, {
	valid: [
		{
			filename: file('user.schemas.ts'),
			code: `
        import { z } from 'zod';
        const UserSchema = z.object({ id: z.string() });
      `,
		},

		{
			filename: file('post.schemas.ts'),
			code: `
        import * as z from 'zod';
        const Post = z.object({ title: z.string() });
      `,
		},

		{
			filename: file('api.schema.ts'),
			options: [{allowedSuffixes: ['.schema.ts']}],
			code: `
        import { z } from 'zod';
        const ApiSchema = z.object({});
      `,
		},

		{
			filename: file('myfile.test.ts'),
			options: [{allowInTests: true}],
			code: `
        import { z } from 'zod';
        const T = z.string();
      `,
		},

		{
			filename: file('component.ts'),
			options: [{onlyWhenAssigned: true}],
			code: `
        import { z } from 'zod';
        z.object({ id: z.string() });
      `,
		},

		{
			filename: file('regular.ts'),
			code: `
        const x = foo.bar();
      `,
		},
	],

	invalid: [
		// Z.object + z.string → 2 errors
		{
			filename: file('user.ts'),
			code: `
        import { z } from 'zod';
        const UserSchema = z.object({ id: z.string() });
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
			],
		},

		// Z.object + z.string → 2 errors
		{
			filename: file('a.ts'),
			code: `
        import * as z from 'zod';
        const Thing = z.object({ a: z.string() });
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
			],
		},

		// Chained call → 1 error
		{
			filename: file('x.ts'),
			code: `
        import { z } from 'zod';
        const S = z.object({}).optional().nullable();
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
			],
		},

		// Z.object + z.number → ACTUAL behavior = 1 error
		{
			filename: file('model.ts'),
			options: [{onlyWhenAssigned: true}],
			code: `
        import { z } from 'zod';
        const A = z.object({ id: z.number() });
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
			],
		},

		// Z.object + z.number → 2 errors here
		{
			filename: file('model2.ts'),
			code: `
        import { z } from 'zod';
        let schema;
        schema = z.object({ n: z.number() });
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
			],
		},

		// Z.object + z.string → 2 errors
		{
			filename: file('myFile.ts'),
			options: [{allowedSuffixes: ['.schema.ts']}],
			code: `
        import { z } from 'zod';
        const A = z.object({ a: z.string() });
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schema.ts'}},
				{messageId: 'moveSchema', data: {suffixes: '.schema.ts'}},
			],
		},

		// Test file, allowInTests = false → 1 error
		{
			filename: file('something.spec.ts'),
			options: [{allowInTests: false}],
			code: `
        import { z } from 'zod';
        const T = z.string();
      `,
			errors: [
				{messageId: 'moveSchema', data: {suffixes: '.schemas.ts'}},
			],
		},
	],
});
