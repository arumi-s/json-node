import { isDigit, isHex, isIdentChar, isIdentStart, isReplacer, isSpace, isUnicode, isUnicodeStrict } from '../src/selector/tokens';

function checkCodes(name: string, fn: (code: number) => boolean, expects: string) {
	it(`${name}`, () => {
		for (let code = 0; code < 128; code++) {
			expect(fn(code)).toStrictEqual(expects.includes(String.fromCharCode(code)));
		}
		for (let index = 0; index < expects.length; index++) {
			const code = expects.charCodeAt(index);
			if (code >= 128) {
				expect(fn(code)).toStrictEqual(true);
			}
		}
	});
}

describe('Selector tokens', () => {
	checkCodes('isSpace', isSpace, ' \t\r\n\f');
	checkCodes('isDigit', isDigit, '0123456789');
	checkCodes('isReplacer', isReplacer, '�');
	checkCodes('isHex', isHex, '0123456789abcdefABCDEF');
	checkCodes('isUnicode', isUnicode, '中文');
	checkCodes('isUnicodeStrict', isUnicodeStrict, '中文');
	checkCodes('isIdentStart', isIdentStart, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_\\中文');
	checkCodes('isIdentChar', isIdentChar, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_\\中文');
});
