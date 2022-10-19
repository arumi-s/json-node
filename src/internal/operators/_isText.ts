import { AnyNode, TextNode } from '../types';

export function _isText(value: AnyNode): value is TextNode {
	return value.tagName === '#text';
}
