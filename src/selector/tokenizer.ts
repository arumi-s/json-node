import {
	Token,
	TOKEN_SPACE,
	TOKEN_QUOTE,
	TOKEN_STRING,
	DOUBLE_CHAR_OPERATORS,
	SINGLE_CHAR_OPERATORS,
	isIdentStart,
	isIdentChar,
	TOKEN_IDENT,
	isDigit,
	TOKEN_NUMBER,
	TOKEN_NULL,
	SPACE_BEFORE_OPERATORS,
	SPACE_AFTER_OPERATORS,
} from './tokens';

export function tokenize(source: string) {
	const length = source.length;
	const tokens: Token[] = [];
	let cursor = 0;
	while (cursor < length) {
		let char = source.charAt(cursor);
		if (char === '') {
			cursor++;
			continue;
		}
		if (char.trim() === '') {
			const end = length - source.substring(cursor).trimStart().length;
			tokens.push({
				text: source.substring(cursor, end),
				type: TOKEN_SPACE,
				start: cursor,
				end,
			});
			cursor = end;
			continue;
		}
		if (char === '"' || char === "'") {
			let end = source.indexOf(char, cursor + 1);
			const hasEndQuote = end !== -1;
			if (!hasEndQuote) end = source.length;

			tokens.push({
				text: char,
				type: TOKEN_QUOTE,
				start: cursor,
				end: cursor + 1,
			});
			let subIndex = cursor + 1;
			while (subIndex < end) {
				const subChar = source.charAt(subIndex);
				let subEnd = subIndex + 1;
				if (subChar === '\\' && subIndex + 1 < end) ++subEnd;
				subIndex = subEnd;
			}
			tokens.push({
				text: source.substring(cursor + 1, subIndex),
				type: TOKEN_STRING,
				start: cursor + 1,
				end: subIndex,
			});
			cursor = end;
			if (hasEndQuote) {
				tokens.push({
					text: source.charAt(cursor),
					type: TOKEN_QUOTE,
					start: cursor,
					end: cursor + 1,
				});
				cursor++;
			}
			continue;
		}
		{
			let isOperator = false;
			if (cursor + 1 < length) {
				const char2 = char + source.charAt(cursor + 1);
				const tokenType = DOUBLE_CHAR_OPERATORS.get(char2);
				if (tokenType != null) {
					const end = cursor + 2;
					tokens.push({
						text: char2,
						type: tokenType,
						start: cursor,
						end,
					});
					cursor = end;
					isOperator = true;
				}
			}
			if (isOperator) continue;
			{
				const tokenType = SINGLE_CHAR_OPERATORS.get(char);
				if (tokenType != null) {
					const end = cursor + 1;
					tokens.push({
						text: char,
						type: tokenType,
						start: cursor,
						end,
					});
					cursor = end;
					isOperator = true;
				}
			}
			if (isOperator) continue;
		}
		{
			let end = cursor;
			if (isIdentStart(char.charCodeAt(0))) {
				while (end < length && isIdentChar((char = source.charAt(end)).charCodeAt(0))) {
					if (char === '\\') ++end;
					++end;
				}
				if (end > cursor) {
					const text = source.substring(cursor, end);
					tokens.push({
						text,
						type: TOKEN_IDENT,
						start: cursor,
						end,
					});
					cursor = end;
					continue;
				}
			}
		}
		{
			let end = cursor;
			if (isDigit(char.charCodeAt(0))) {
				while (end < length && isDigit((char = source.charAt(end)).charCodeAt(0))) ++end;
				if (end > cursor) {
					const text = source.substring(cursor, end);
					tokens.push({
						text,
						type: TOKEN_NUMBER,
						start: cursor,
						end,
					});
					cursor = end;
					continue;
				}
			}
		}
		{
			const end = cursor + 1;
			const prev = tokens[tokens.length - 1];
			if (prev != null && prev.type === TOKEN_NULL) {
				prev.text += char;
				prev.end = end;
			} else {
				tokens.push({
					text: char,
					type: TOKEN_NULL,
					start: cursor,
					end,
				});
			}
			cursor = end;
		}
	}

	return tokens.filter((token, i, arr) => {
		if (token.type === TOKEN_SPACE) {
			const nextToken = arr[i + 1];
			if (nextToken) {
				if (SPACE_BEFORE_OPERATORS.includes(nextToken.type)) {
					nextToken.text = token.text + nextToken.text;
					nextToken.start = token.start;
					return false;
				}
			}
			const prevToken = arr[i - 1];
			if (prevToken) {
				if (SPACE_AFTER_OPERATORS.includes(prevToken.type)) {
					prevToken.text = prevToken.text + token.text;
					prevToken.end = token.end;
					return false;
				}
			}
		}
		return true;
	});
}
