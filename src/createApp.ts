import { App, Middleware, Request, Response, RouteHandler } from "./types";
import http from "http";
import { parseURL } from "./utils/parseURL";
import { jsonParser } from "./middlewares/jsonParser";

const createApp = (): App => {
	const middlewares: Middleware[] = [];
	const routes: RouteHandler[] = [];

	const server = http.createServer((req, res) => {
		const request = req as Request;
		const response = res as Response;

		const { pathname, query } = parseURL(
			request.url || "",
			req.headers.host || "http://localhost"
		);

		request.query = query;

		response.headers = {};

		response.status = (code: number) => {
			res.statusCode = code;
			return response;
		};

		response.set = (name: string, value: string) => {
			res.setHeader(name, value);
			response.headers[name] = value;
			return response;
		};

		response.send = data => {
			if (typeof data === "object") {
				response.headers = {
					"Content-Type": "application/json",
					...response.headers,
				};
				response.body = JSON.stringify(data);
			} else {
				response.body = String(data);
			}

			if (response.headers) {
				for (const [key, value] of Object.entries(response.headers)) {
					res.setHeader(key, value);
				}
			}

			res.end(response.body);
		};

		response.json = data => {
			response.headers = {
				...response.headers,
				"Content-Type": "application/json",
			};
			response.body = JSON.stringify(data);

			for (const [key, value] of Object.entries(response.headers)) {
				res.setHeader(key, value);
			}

			res.end(response.body);
		};

		const route = routes.find(
			r => r.path === pathname && r.method === request.method
		);

		if (!route && middlewares.length === 0) {
			res.statusCode = 404;
			res.end("Not Found");
			return;
		}

		const handlers: Middleware[] = [...middlewares];
		if (route) handlers.push(...route.handlers);

		let idx = 0;
		const next = () => {
			const handler = handlers[idx++];
			if (handler) handler(request, response, next);
		};

		next();
	});

	return {
		use: (...handlers: Middleware[]) => {
			middlewares.push(...handlers);
		},

		get: (path: string, ...handlers: Middleware[]) => {
			routes.push({ path, method: "GET", handlers });
		},
		post: (path: string, ...handlers: Middleware[]) => {
			routes.push({ path, method: "POST", handlers });
		},
		put: (path: string, ...handlers: Middleware[]) => {
			routes.push({ path, method: "PUT", handlers });
		},
		delete: (path: string, ...handlers: Middleware[]) => {
			routes.push({ path, method: "DELETE", handlers });
		},

		listen: (port: number, callback?: () => void) => {
			server.listen(port, callback);
		},
	};
};

export default createApp;
