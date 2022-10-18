export function isComment(value: unknown): value is string {
	return typeof value === 'string' && value.startsWith('<!--') && value.endsWith('-->');
}
