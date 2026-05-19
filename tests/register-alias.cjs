/* eslint-disable @typescript-eslint/no-require-imports */
const Module = require('node:module');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    request = path.join(projectRoot, request.slice(2));
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
