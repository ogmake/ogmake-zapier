'use strict';
const { BASE_URL, templateField, paramsField, formatField, presetField, cleanParams } = require('../common');
const { buildSignedUrl } = require('../signing');

const perform = async (z, bundle) => {
  const { keyId, signingSecret } = bundle.authData;
  if (!keyId || !signingSecret) {
    throw new z.errors.Error('Reconnect ogmake and fill in Key ID and Signing Secret to build signed URLs.', 'MissingSigningKey', 400);
  }
  const i = bundle.inputData;
  const params = { ...cleanParams(i.params), template: i.template };
  if (i.format) params.format = i.format;
  if (i.preset) params.preset = i.preset;
  return { url: buildSignedUrl(BASE_URL, keyId, signingSecret, params) };
};

module.exports = {
  key: 'build_signed_url',
  noun: 'Signed URL',
  display: { label: 'Build Signed URL', description: 'Signs an image URL locally with your signing secret. No API call, no quota use.' },
  operation: {
    inputFields: [templateField, paramsField, formatField, presetField],
    perform,
    sample: { url: 'https://ogmake.com/i/k_abc/SIGNATURE?format=png&template=basic&title=Hello' },
  },
};
