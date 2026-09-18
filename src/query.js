

export function parseUrl(req) {
  return new URL(req.url, `http://${req.headers.host}`);
}

export function parseParams(url, schema) {
  const result = {};

  for (const [name, type] of Object.entries(schema)) {

    const raw = url.searchParams.get(name);
    if(raw === null) {
      result[name] = null;
      continue;
    }

    switch (type) {

      case 'number': {
        const n = Number(raw);
        result[name] = isNaN(n) ? null : n;
        break;
      }

      case 'int': {
        const n = parseInt(raw, 10);
        result[name] = isNaN(n) ? null : n;
        break;
      }

      case 'bool': {
         result[name] = raw === 'true' ? true : raw === 'false' ? false : null;
         break;
      }

      default: result[name] = raw;

    }
  }

  return result;
}

export const readJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString();
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error("Invalid JSON format"));
      }
    });
    req.on('error', (err) => reject(err));
  });
};
