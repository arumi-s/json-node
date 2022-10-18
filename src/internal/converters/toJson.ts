import { Node, NodeExport } from '../types';
import { createAttrsMap } from '../constructors/createAttrsMap';
import { _isNodeInternal } from '../operators/isNodeInternal';

export function toJson(node: Node): NodeExport {
	const result: NodeExport = { name: node.tagName };
	if (node.attributes.length) result.attr = createAttrsMap(node.attributes);
	if (node.children.length) result.child = node.children.map((child) => (_isNodeInternal(child) ? toJson(child) : child));
	return result;
}
