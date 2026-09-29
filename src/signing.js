'use strict';
const crypto = require('crypto');

const EXCLUDED = new Set(['sig', 'debug']);
const enc = (v) =>
  encodeURIComponent(v).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

const canonicalQuery = (params) =>
  Object.keys(params)
    .filter((k) => !EXCLUDED.has(k))
    .sort()
    .map((k) => `${enc(k)}=${enc(params[k])}`)
    .join('&');

const signCanonical = (secretBase64, canonical) =>
  crypto
    .createHmac('sha256', Buffer.from(secretBase64, 'base64'))
    .update(canonical)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const buildSignedUrl = (baseUrl, keyId, secretBase64, params) => {
  const canonical = canonicalQuery(params);
  return `${baseUrl.replace(/\/+$/, '')}/i/${encodeURIComponent(keyId)}/${signCanonical(secretBase64, canonical)}?${canonical}`;
};

module.exports = { canonicalQuery, signCanonical, buildSignedUrl };
