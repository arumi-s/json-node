import { Node } from '../../interfaces/node.interface';

export function isNode(value: unknown): value is Node {
	return (
		typeof value === 'object' &&
		Object.prototype.hasOwnProperty.call(value, 'tagName') &&
		Object.prototype.hasOwnProperty.call(value, 'attributes') &&
		Object.prototype.hasOwnProperty.call(value, 'children')
	);
}
