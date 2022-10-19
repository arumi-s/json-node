import { AnyNode, DocumentNode } from '../types';

export function _isDocument(value: AnyNode): value is DocumentNode {
	return value.tagName === '#document';
}
