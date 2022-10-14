import { Selector } from '../src';
import { unescape } from '../src/selector/unescape';
import { escapeSelectors } from './selectors';

describe('Selector check unescape', () => {
	const convertType = 'unescape';

	for (let i = 0; i < escapeSelectors.length; i++) {
		const s = escapeSelectors[i];
		const n = s['name'];
		const q = s['selector'];
		const e = s['expect'];
		const exclude = s['exclude'] ?? [];

		if (!exclude.includes(convertType)) {
			it(`unescape ${n}: ${JSON.stringify(e)} to ${JSON.stringify(q)}`, () => {
				expect(Selector.unescape(e)).toStrictEqual(q);
				expect(unescape(e)).toStrictEqual(q);
			});
		}
	}
});
