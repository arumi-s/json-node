import { Selector } from '../src';

describe('Selector check interface', () => {
	it('has function parseSelector', () => {
		expect(typeof Selector.parse).toStrictEqual('function');
	});

	it('has function unescape', () => {
		expect(typeof Selector.unescape).toStrictEqual('function');
	});
});
