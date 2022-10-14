import { Node } from '../../interfaces/node.interface';
import { createNode } from '../constructors/createNode';
import { copyAttr } from './copyAttr';

export function copyNode(from: Node) {
	return copyAttr(from, createNode(from.tagName));
}
