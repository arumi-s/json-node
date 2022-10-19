import { ParentNode } from '../types';
import { _isElement } from './_isElement';
import { _isText } from './_isText';

export function textContent(node: ParentNode): string {
	return node.children.map((n) => (_isElement(n) ? textContent(n) : _isText(n) ? n.text : '')).join('');
}
