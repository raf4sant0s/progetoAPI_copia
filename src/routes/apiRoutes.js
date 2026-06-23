const express = require('express');
const router = express.Router();

router.get('/versao', (req, res) => {
  res.json({
    versao: "2.0.0",
    status: "online"
  });
});

module.exports = router;
