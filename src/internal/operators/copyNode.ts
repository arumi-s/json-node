import { ElementNode } from '../types';
import { createElement } from '../constructors/createElement';
import { copyAttr } from './copyAttr';

export function copyNode(from: ElementNode) {
	return copyAttr(from, createElement(from.tagName));
}
