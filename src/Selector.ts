import { Checker } from './interfaces/checker.interface';
import { parseTokens } from './selector/parser';
import { tokenize } from './selector/tokenizer';

export * from './interfaces/checker.interface';

export * from './selector/tokenizer';
export * from './selector/parser';
export * from './selector/unescape';

const cache = new Map<string, Checker>();

export function parseSelector(selector: string): Checker {
	if (cache.has(selector)) return cache.get(selector) as Checker;
	const tokens = tokenize(selector);
	const check = parseTokens(tokens);

	cache.set(selector, check);
	return check;
}
