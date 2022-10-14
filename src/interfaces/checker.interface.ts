import { Node } from './node.interface';

export type Checker = (node: Node, scope: Node) => boolean;
