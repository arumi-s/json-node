import { AttrsMap, Attr } from '../../interfaces/node.interface';

export function createAttrs(attrsMap?: AttrsMap): Attr[] {
	return attrsMap ? Object.keys(attrsMap).map((attr) => ({ name: attr, value: attrsMap[attr] })) : [];
}
