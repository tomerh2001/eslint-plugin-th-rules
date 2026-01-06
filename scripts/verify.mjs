import {ESLint} from 'eslint';
import thRules from '../src/index.js';

const run = async (name, config) => {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});

	const results = await eslint.lintText('const x = 1;\n', {filePath: 'fixtures/test.js'});
	console.log(`OK: ${name} (${results[0].messages.length} messages)`);
};

await run('recommended', thRules.configs.recommended);
await run('recommended-typescript', thRules.configs['recommended-typescript']);
await run('recommended-react', thRules.configs['recommended-react']);
