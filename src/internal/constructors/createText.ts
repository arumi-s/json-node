import { TextNode } from '../types';

export function createText(text: string): TextNode {
	return {
		tagName: '#text',
		parent: null,
		text,
	};
}
