const mongoSanitize = require('express-mongo-sanitize');

// Middleware de sanitização contra NoSQL Injection
// Remove caracteres como $ e . de req.body, req.query e req.params
// Isso previne ataques como { "email": { "$gt": "" }, "password": "qualquer" }
const sanitize = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[SEGURANÇA] Tentativa de NoSQL Injection detectada em ${key}`);
  }
});

module.exports = sanitize;
