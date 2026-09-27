function clean(value) {
  if (Array.isArray(value)) return value.map(clean);

  if (value && typeof value === "object") {
    const output = {};

    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      output[key] = clean(val);
    }

    return output;
  }

  return value;
}

const sanitize = (req, res, next) => {
  req.body = clean(req.body);
  req.params = clean(req.params);
  req.query = clean(req.query);
  next();
};

module.exports = sanitize;
