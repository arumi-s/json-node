import { Selector } from '../src';

describe('Selector check interface', () => {
	it('has static method parseSelector', () => {
		expect(Selector).toHaveProperty('parseSelector');
		expect(typeof Selector.parseSelector).toStrictEqual('function');
	});

	it('has method unescape', () => {
		expect(Selector).toHaveProperty('unescape');
		expect(typeof Selector.unescape).toStrictEqual('function');
	});
});
