import { isHex, isSpace, isReplacer } from './tokens';

export function unescape(text: string): string {
	const length = text.length;
	let result = '';
	let cursor = 0;
	while (cursor < length) {
		let char = text.charAt(cursor++);
		if (char === '\\') {
			let hex = '';
			while (isHex((char = text.charAt(cursor)).charCodeAt(0))) {
				hex += char;
				++cursor;
			}
			if (hex === '') {
				result += char;
				++cursor;
			} else {
				result += String.fromCharCode(parseInt(hex, 16));
				if (isSpace(char.charCodeAt(0))) ++cursor;
			}
		} else if (isReplacer(char.charCodeAt(0))) {
			result += '\0';
		} else {
			result += char;
		}
	}
	return result;
}
