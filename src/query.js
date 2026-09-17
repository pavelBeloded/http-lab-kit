

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