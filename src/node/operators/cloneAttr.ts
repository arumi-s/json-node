import { Attr } from '../../interfaces/node.interface';

export function cloneAttr(attr: Attr): Attr {
	return {
		name: attr.name,
		value: attr.value,
	};
}
