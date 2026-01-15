import {readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rulesDir = join(__dirname, 'rules');
const ruleFiles = readdirSync(rulesDir).filter(file => file.endsWith('.js'));

export const rules = Object.fromEntries(await Promise.all(ruleFiles.map(async file => {
	const ruleName = file.replace('.js', '');
	const ruleModule = await import(`./rules/${file}`);
	return [ruleName, ruleModule.default];
})));

export const plugin = {rules};

export default plugin;
