import { AnyNode, ElementNode } from '../types';

export function _isElement(value: AnyNode): value is ElementNode {
	return !value.tagName.startsWith('#');
}
