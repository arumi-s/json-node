import { Node } from '../types';
import { createNode } from '../constructors/createNode';
import { copyAttr } from './copyAttr';

export function copyNode(from: Node) {
	return copyAttr(from, createNode(from.tagName));
}
