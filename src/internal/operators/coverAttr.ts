import { Node } from '../types';
import { getAttribute } from './getAttribute';
import { hasAttribute } from './hasAttribute';
import { removeAttribute } from './removeAttribute';
import { setAttribute } from './setAttribute';

export function coverAttr(node: Node, form: string, to: string) {
	if (!hasAttribute(node, to) && hasAttribute(node, form)) {
		setAttribute(node, to, getAttribute(node, form, ''));
		removeAttribute(node, form);
	}
}
