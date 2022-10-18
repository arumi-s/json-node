import { Checker } from './types';
import { tokenize } from './selector/tokenizer';
import { parseTokens } from './selector/parser';
import { unescape as u } from './selector/unescape';

const cache = new Map<string, Checker>();

export const Selector = {
	unescape: u,
	parse: (selector: string): Checker => {
		if (cache.has(selector)) return cache.get(selector) as Checker;
		const tokens = tokenize(selector);
		const check = parseTokens(tokens);

		cache.set(selector, check);
		return check;
	},
};
