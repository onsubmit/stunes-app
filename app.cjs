/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5001;

const root = path.join(__dirname, 'dist');
express()
  .use('/', express.static(root))
  .listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
    console.log(`Navigate to http://localhost:${PORT}`);
  });
