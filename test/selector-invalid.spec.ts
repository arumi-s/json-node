import { getTestDoc } from './doc';
import { Node, find, findFirst } from '../src';
import { SelectorTest, invalidSelectors } from './selectors';

function escapeRegex(text: string) {
	return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function runInvalidSelectorTest(name: string, root: Node, selectors: SelectorTest[]) {
	describe(`${name} invalid selectors`, () => {
		for (let i = 0; i < selectors.length; i++) {
			const s = selectors[i];
			const n = s['name'];
			const q = s['selector'];
			const e = s['expect'];

			const messageRegex = e
				? e[0] === ''
					? new RegExp(`^Unexpected end of input$`)
					: new RegExp(`^Unexpected token "${escapeRegex(e[0])}" at position ${e[1]}$`)
				: null;

			it('findFirst ' + n + ': ' + JSON.stringify(q), () => {
				const f = () => findFirst(root, q);
				expect(f).toThrow(SyntaxError);
				if (messageRegex) expect(f).toThrow(messageRegex);
			});

			it('find ' + n + ': ' + JSON.stringify(q), () => {
				const f = () => find(root, q);
				expect(f).toThrow(SyntaxError);
				if (messageRegex) expect(f).toThrow(messageRegex);
			});
		}
	});
}

runInvalidSelectorTest('Document', getTestDoc(), invalidSelectors);
