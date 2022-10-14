import { Attr, AttrsMap } from '../../interfaces/node.interface';

export function createAttrsMap(attrs?: Attr[]): AttrsMap {
	const attrsMap: AttrsMap = {};
	if (attrs) attrs.forEach((attr) => void (attrsMap[attr.name] = attr.value));
	return attrsMap;
}
