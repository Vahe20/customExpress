import { ServerResponse } from "http";
import { IncomingMessage } from "http";

interface App {
	use: (...middlewares: Middleware[]) => void;
	get(path: string, ...handlers: Middleware[]): void;
	post(path: string, ...handlers: Middleware[]): void;
	put(path: string, ...handlers: Middleware[]): void;
	delete(path: string, ...handlers: Middleware[]): void;
	listen(port: number, callback?: () => void): void;
}

type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Request extends IncomingMessage {
	params: Record<string, string>;
	query: Record<string, string>;
	body?: any;
	method: MethodType;
}

interface Response extends ServerResponse {
	status(code: number): Response;
	json(data: any): void;
	send(data: any): void;
	set(name: string, value: string): Response;
	body?: any;
	headers: Record<string, string>;
}

type NextFunction = (err?: any) => void;

interface Middleware {
	(req: Request, res: Response, next: NextFunction): void;
}

interface ErrorMiddleware {
	(err: any, req: Request, res: Response, next: Function): void;
}

interface RouteHandler {
	path: string;
	method: MethodType;
	handlers: Middleware[];
}

export {
	App,
	Request,
	Response,
	Middleware,
	ErrorMiddleware,
	RouteHandler,
	NextFunction,
};
