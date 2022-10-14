export interface Node {
	tagName: string;
	attributes: Attr[];
	parent: Node | null;
	children: (Node | string)[];
}

export interface NodeExport {
	name?: string;
	attr?: AttrsMap;
	child?: (NodeExport | string)[];
}

export interface Attr {
	name: string;
	value: string;
}

export type AttrsMap = Record<string, string>;
