import { NodeExport, Node } from '../../interfaces/node.interface';
import { createNode } from '../constructors/createNode';
import { appendChild } from '../operators/appendChild';

export function fromJson(json: NodeExport): Node {
	const node = createNode(json.name ?? '', json.attr);
	if (json.child) {
		json.child.forEach((child) => {
			appendChild(node, typeof child === 'string' ? child : fromJson(child));
		});
	}
	return node;
}
