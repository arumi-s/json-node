export interface Token {
	text: string;
	type: number;
	start: number;
	end: number;
}

export const TOKEN_NULL = 0x00;
export const TOKEN_SPACE = 0x01;
export const TOKEN_QUOTE = 0x04;
export const TOKEN_STRING = 0x05;
export const TOKEN_IDENT = 0x06;
export const TOKEN_NUMBER = 0x07;
export const TOKEN_SQUARE_OPEN = 0x41;
export const TOKEN_SQUARE_CLOSE = 0x42;
export const TOKEN_ROUND_OPEN = 0x43;
export const TOKEN_ROUND_CLOSE = 0x44;
export const TOKEN_GT = 0x45;
export const TOKEN_COLON = 0x46;
export const TOKEN_DOT = 0x47;
export const TOKEN_COMMA = 0x48;
export const TOKEN_HASH = 0x49;
export const TOKEN_EQUAL = 0x50;
export const TOKEN_ASTERISK = 0x51;
export const TOKEN_PLUS = 0x52;
export const TOKEN_TILDE = 0x53;
export const TOKEN_MINUS = 0x54;
export const TOKEN_PIPE = 0x55;
export const TOKEN_CARET_EQUAL = 0x61;
export const TOKEN_DOLLAR_EQUAL = 0x62;
export const TOKEN_ASTERISK_EQUAL = 0x63;
export const TOKEN_TILDE_EQUAL = 0x64;
export const TOKEN_PIPE_EQUAL = 0x65;

export const SINGLE_CHAR_OPERATORS = new Map([
	['[', TOKEN_SQUARE_OPEN],
	[']', TOKEN_SQUARE_CLOSE],
	['(', TOKEN_ROUND_OPEN],
	[')', TOKEN_ROUND_CLOSE],
	['>', TOKEN_GT],
	[':', TOKEN_COLON],
	['.', TOKEN_DOT],
	[',', TOKEN_COMMA],
	['#', TOKEN_HASH],
	['=', TOKEN_EQUAL],
	['*', TOKEN_ASTERISK],
	['+', TOKEN_PLUS],
	['~', TOKEN_TILDE],
	['-', TOKEN_MINUS],
	['|', TOKEN_PIPE],
]);

export const DOUBLE_CHAR_OPERATORS = new Map([
	['^=', TOKEN_CARET_EQUAL],
	['$=', TOKEN_DOLLAR_EQUAL],
	['*=', TOKEN_ASTERISK_EQUAL],
	['~=', TOKEN_TILDE_EQUAL],
	['|=', TOKEN_PIPE_EQUAL],
]);

export const SPACE_BEFORE_OPERATORS: number[] = [
	TOKEN_GT,
	TOKEN_COMMA,
	TOKEN_PLUS,
	TOKEN_MINUS,
	TOKEN_TILDE,
	TOKEN_ROUND_CLOSE,
	TOKEN_SQUARE_CLOSE,
];

export const SPACE_AFTER_OPERATORS: number[] = [
	TOKEN_GT,
	TOKEN_COMMA,
	TOKEN_PLUS,
	TOKEN_MINUS,
	TOKEN_TILDE,
	TOKEN_ROUND_OPEN,
	TOKEN_SQUARE_OPEN,
	TOKEN_CARET_EQUAL,
	TOKEN_DOLLAR_EQUAL,
	TOKEN_ASTERISK_EQUAL,
	TOKEN_TILDE_EQUAL,
	TOKEN_PIPE_EQUAL,
];

export function isSpace(code: number) {
	return code === 32 || code === 10 || code === 13 || code === 9 || code === 12;
}
export function isDigit(code: number) {
	return code >= 48 && code <= 57;
}
export function isReplacer(code: number) {
	return code === 65533;
}
export function isHex(code: number) {
	return isDigit(code) || (code >= 65 && code <= 70) || (code >= 97 && code <= 102);
}
export function isUnicode(code: number) {
	return code >= 160 && code < 65519;
}
export function isUnicodeStrict(code: number) {
	return (code >= 160 && code < 55295) || (code >= 63744 && code < 64975) || (code >= 65008 && code < 65519);
}
export function isIdentStart(code: number) {
	return (code >= 65 && code <= 90) || code === 92 || code === 95 || (code >= 97 && code <= 122) || isUnicode(code);
}
export function isIdentChar(code: number) {
	return isDigit(code) || isIdentStart(code);
}
