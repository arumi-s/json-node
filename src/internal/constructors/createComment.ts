import { CommentNode } from '../types';

export function createComment(text: string): CommentNode {
	return {
		tagName: '#comment',
		parent: null,
		text,
	};
}
