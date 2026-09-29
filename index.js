'use strict';
const { version } = require('./package.json');
const { version: platformVersion } = require('zapier-platform-core');
const { BASE_URL } = require('./src/common');
const createImage = require('./src/creates/create_image');
const renderHtml = require('./src/creates/render_html');
const screenshot = require('./src/creates/screenshot');
const buildSignedUrl = require('./src/creates/build_signed_url');

const addAuth = (request, z, bundle) => {
  request.headers = request.headers || {};
  request.headers.Authorization = `Bearer ${bundle.authData.apiKey}`;
  return request;
};

const handleErrors = (response, z) => {
  if (response.status === 401) throw new z.errors.Error('Invalid or revoked ogmake API key.', 'AuthenticationError', 401);
  if (response.status >= 400) {
    const err = (response.data && response.data.error) || 'request_failed';
    const detail = response.data && Array.isArray(response.data.detail)
      ? ': ' + response.data.detail.map((d) => `${d.field} ${d.message}`).join('; ')
      : '';
    throw new z.errors.Error(`ogmake: ${err}${detail}`, err, response.status);
  }
  return response;
};

module.exports = {
  version,
  flags: { cleanInputData: false },
  platformVersion,
  authentication: {
    type: 'custom',
    fields: [
      { key: 'apiKey', label: 'API Key', required: true, type: 'password', helpText: 'Your og_live_... key from the ogmake dashboard.' },
      { key: 'keyId', label: 'Key ID', required: false, helpText: 'k_... ID. Only for Build Signed URL.' },
      { key: 'signingSecret', label: 'Signing Secret', required: false, type: 'password', helpText: 'Base64 signing secret shown once at key creation. Only for Build Signed URL.' },
    ],
    test: { url: `${BASE_URL}/v1/usage`, method: 'GET' },
    connectionLabel: 'ogmake',
  },
  beforeRequest: [addAuth],
  afterResponse: [handleErrors],
  creates: {
    [createImage.key]: createImage,
    [renderHtml.key]: renderHtml,
    [screenshot.key]: screenshot,
    [buildSignedUrl.key]: buildSignedUrl,
  },
};
