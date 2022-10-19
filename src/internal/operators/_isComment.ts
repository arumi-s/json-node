import { AnyNode, CommentNode } from '../types';

export function _isComment(value: AnyNode): value is CommentNode {
	return value.tagName === '#comment';
}
