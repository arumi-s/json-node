import { Token } from './tokens';

export function createSyntaxError(token: Token) {
	if (token == null) return new SyntaxError(`Unexpected end of input`);
	return new SyntaxError(`Unexpected token "${token.text}" at position ${token.start}`);
}
