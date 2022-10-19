import { CommentNode } from '../types';
import { isAny } from './isAny';

export function isComment(value: unknown): value is CommentNode {
	return isAny(value) && value.tagName === '#comment';
}
