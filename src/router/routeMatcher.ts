export interface RouteMatch {
	matched: boolean;
	params: Record<string, string>;
}

export const pathToRegex = (path: string): { regex: RegExp; keys: string[] } => {
	const keys: string[] = [];
	
	const regexPattern = path
		.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
		.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
			keys.push(key);
			return '([^\\/]+)';
		});
	
	const regex = new RegExp(`^${regexPattern}$`);
	
	return { regex, keys };
};

export const matchRoute = (pattern: string, url: string): RouteMatch => {
	const { regex, keys } = pathToRegex(pattern);
	const match = url.match(regex);
	
	if (!match) {
		return { matched: false, params: {} };
	}
	
	const params: Record<string, string> = {};
	keys.forEach((key, index) => {
		params[key] = decodeURIComponent(match[index + 1]);
	});
	
	return { matched: true, params };
};
