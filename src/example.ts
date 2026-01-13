import { createApp } from "./index";

const app = createApp();

// Middleware для логирования
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// Простой роут
app.get("/", (req, res) => {
	res.json({ message: "Welcome to customExpress!" });
});

// Роут с одним параметром
app.get("/users/:id", (req, res) => {
	res.json({
		message: "User details",
		userId: req.params.id,
	});
});

// Роут с несколькими параметрами
app.get("/users/:userId/posts/:postId", (req, res) => {
	res.json({
		message: "Post details",
		userId: req.params.userId,
		postId: req.params.postId,
	});
});

// Роут с query параметрами
app.get("/search", (req, res) => {
	res.json({
		message: "Search results",
		query: req.query,
	});
});

// POST роут с параметром
app.post("/users/:id/comments", (req, res) => {
	res.json({
		message: "Comment created",
		userId: req.params.id,
		body: req.body,
	});
});

// Тест обработки ошибок
app.get("/error", (req, res, next) => {
	next(new Error("Something went wrong!"));
});

// Сложный роут с параметрами
app.get("/api/:version/users/:userId/orders/:orderId", (req, res) => {
	res.json({
		message: "Complex route matched!",
		params: req.params,
		// params будет: { version: 'v1', userId: '123', orderId: '456' }
	});
});

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
	console.log("\nТестовые URL:");
	console.log("- http://localhost:3000/");
	console.log("- http://localhost:3000/users/123");
	console.log("- http://localhost:3000/users/123/posts/456");
	console.log("- http://localhost:3000/search?q=test&page=1");
	console.log("- http://localhost:3000/api/v1/users/123/orders/456");
	console.log("- http://localhost:3000/error");
});
