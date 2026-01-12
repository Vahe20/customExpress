import { Middleware, Request, Response } from "../types";

export const jsonParser = (): Middleware => {
	return (req: Request, res: Response, next) => {
		const contentType = req.headers["content-type"];
		if (!contentType || !contentType.includes("application/json")) {
			return next();
		}

		if (req.method === "GET" || req.method === "DELETE") {
			return next();
		}

		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			try {
				if (body) {
					req.body = JSON.parse(body);
				} else {
					req.body = {};
				}
				next();
			} catch (error) {
				res.status(400).json({
					error: "Invalid JSON",
					message:
						error instanceof Error
							? error.message
							: "Unknown error",
				});
			}
		});

		req.on("error", error => {
			res.status(400).json({
				error: "Request error",
				message: error.message,
			});
		});
	};
};
