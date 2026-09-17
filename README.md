# http-lab-kit

Utility helpers for Node.js HTTP servers — removes boilerplate from request parsing, response sending, routing, and SSE.

## Installation

```bash
npm install http-lab-kit
```

## Usage

```js
import { createRouter, parseParams, sendJson, sendError, serveFile, createSseHub } from 'http-lab-kit';
```

---

## API

### `parseUrl(req)`

Parses `req.url` into a `URL` object using the host from request headers.

```js
const url = parseUrl(req);
console.log(url.pathname); // '/fact'
```

---

### `parseParams(url, schema)`

Extracts and casts query parameters according to a schema.

Supported types: `'string'`, `'number'`, `'int'`, `'bool'`

Returns `null` for a parameter if it is missing or fails to cast.

```js
const { k, name } = parseParams(url, { k: 'int', name: 'string' });
if (k === null) { sendError(res, "Missing parameter 'k'", 400); return; }
```

---

### `sendJson(res, data, statusCode?)`

Sends a JSON response. Default status code is `200`.

```js
sendJson(res, { result: 42 });
sendJson(res, { items: [] }, 201);
```

---

### `sendText(res, text, statusCode?)`

Sends a plain text response. Default status code is `200`.

```js
sendText(res, 'OK');
```

---

### `sendError(res, message, statusCode?)`

Sends a JSON error response. Default status code is `500`.

```js
sendError(res, 'Not Found', 404);
sendError(res, 'Something went wrong');
```

---

### `serveFile(res, filePath, contentType)`

Reads a file from disk and sends it. Responds with `404` if the file is not found.

```js
serveFile(res, path.join(__dirname, 'index.html'), 'text/html; charset=utf-8');
```

---

### `createRouter()`

Returns a router with `get`, `post`, and `handle` methods.

- `get(pathname, handler)` / `post(pathname, handler)` — register a route handler
- `handle(req, res)` — pass directly to `http.createServer`
- Handler signature: `(req, res, url)` where `url` is the already-parsed `URL` object

Automatically responds with `404` for unmatched routes and `500` on handler errors.

```js
const router = createRouter();

router.get('/fact', (req, res, url) => {
  const { k } = parseParams(url, { k: 'int' });
  if (k === null) { sendError(res, "Missing parameter 'k'", 400); return; }
  sendJson(res, { k, result: k * 2 });
});

http.createServer(router.handle).listen(3000);
```

---

### `createSseHub()`

Returns an SSE hub with `addClient`, `removeClient`, `broadcast`, and `handle` methods.

- `handle(req, res, initialMessage?)` — sets SSE headers, registers the client, cleans up on disconnect
- `broadcast(data)` — sends data to all connected clients; objects are serialized to JSON automatically
- `addClient(res)` / `removeClient(res)` — manual client management if needed

```js
const hub = createSseHub();

router.get('/events', (req, res) => {
  hub.handle(req, res, 'connected');
});

// somewhere else:
hub.broadcast({ status: 'updated' });
hub.broadcast('plain text also works');
```

---

## License

MIT
