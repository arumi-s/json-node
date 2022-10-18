import { AttrsMap, Attr } from '../types';

export function createAttrs(attrsMap?: AttrsMap): Attr[] {
	return attrsMap ? Object.keys(attrsMap).map((attr) => ({ name: attr, value: attrsMap[attr] })) : [];
}
