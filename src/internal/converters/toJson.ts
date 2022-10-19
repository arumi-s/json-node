import { ElementNode, NodeExport } from '../types';
import { createAttrsMap } from '../constructors/createAttrsMap';
import { _isElement } from '../operators/_isElement';

export function toJson(node: ElementNode): NodeExport {
	const result: NodeExport = { name: node.tagName };
	if (node.attributes.length) result.attr = createAttrsMap(node.attributes);
	if (node.children.length) {
		result.child = node.children.map((child) => (_isElement(child) ? toJson(child) : child.text));
	}
	return result;
}
