import { AttrsMap, Node } from '../../interfaces/node.interface';
import { createAttrs } from './createAttrs';

export function createNode(tagName: string = '', attrsMap?: AttrsMap): Node {
	return {
		tagName,
		attributes: createAttrs(attrsMap),
		parent: null,
		children: [],
	};
}
