import {parseUrl} from "./query.js";
import {sendError} from "./response.js";

export function createRouter() {

  const routes = [];

  function get(pathname, handler) {
    routes.push({method: "GET", pathname, handler});
  }

  function post(pathname, handler) {
    routes.push({method: "POST", pathname, handler});
  }

  async function handle(req, res) {
    const url = parseUrl(req);
    const route = routes.find(r => r.method === req.method && r.pathname === url.pathname);

    if(!route) {
      sendError(res, "Not found", 404);
      return;
    }

    try {
      await route.handler(req, res, url);
    } catch (err) {
        sendError(res, err.message);
    }
  }

  return {get, post, handle}
}