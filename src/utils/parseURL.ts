export const parseURL = (url: string, host: string) => {
	const fullHost = host.startsWith("http") ? host : `http://${host}`;
	const urlObj = new URL(url, fullHost);

	const pathname = urlObj.pathname;
	const query: { [key: string]: string } = {};

	urlObj.searchParams.forEach((value, key) => {
		query[key] = value;
	});

	return { pathname, query };
};
