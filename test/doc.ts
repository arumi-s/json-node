import fs from 'fs';
import path from 'path';
import { Node } from '../src';
import { parseXML } from '../src/parse-xml';

const testXml = fs.readFileSync(path.join(__dirname, 'doc.xml'), { encoding: 'utf8' });

export function parse(text: string): Node {
	return parseXML(text, { keepComments: true, keepDeclarations: true })!;
}

export function getTestDoc(): Node {
	return parse(testXml)!;
}
