import { Node } from '../../interfaces/node.interface';

export function _isNodeInternal(value: unknown): value is Node {
	return typeof value !== 'string';
}
