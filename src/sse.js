

export function createSseHub() {
  let clients = [];

  function addClient(res) {
    clients.push(res);
  }

  function removeClient(res) {
    clients = clients.filter(client => client !== res);
  }

  function broadcast(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    clients.forEach(client => client.write(`data: ${message}\n\n`))
  }

  function handle(req, res, initialMessage) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    })

    if (initialMessage) {
      const msg = typeof initialMessage === 'string' ? initialMessage : JSON.stringify(initialMessage);
      res.write(`data: ${msg}\n\n`);
    }

    addClient(res);
    req.on('close', () => removeClient(res));
  }

  return {addClient, removeClient, broadcast, handle}
}