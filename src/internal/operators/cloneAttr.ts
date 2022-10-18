import { Attr } from '../types';

export function cloneAttr(attr: Attr): Attr {
	return {
		name: attr.name,
		value: attr.value,
	};
}
