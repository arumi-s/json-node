export interface XmlNode {
	tagName: string;
	attributes: { name: string; value: string }[];
	children: (XmlNode | string)[];
	position?: number;
}

export interface XmlAttr {
	name: string;
	value: string;
}

export type XmlNodes = (XmlNode | string)[];
