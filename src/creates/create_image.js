'use strict';
const { BASE_URL, templateField, paramsField, formatField, presetField, cleanParams } = require('../common');

const perform = async (z, bundle) => {
  const i = bundle.inputData;
  const body = { template: i.template, params: cleanParams(i.params) };
  if (i.format) body.format = i.format;
  if (i.preset) body.preset = i.preset;
  const res = await z.request({ method: 'POST', url: `${BASE_URL}/v1/images`, body });
  return res.data;
};

module.exports = {
  key: 'create_image',
  noun: 'Image',
  display: { label: 'Create Image', description: 'Renders an OG image or PDF from a template and returns the hosted URL.' },
  operation: {
    inputFields: [templateField, paramsField, formatField, presetField],
    perform,
    sample: {
      url: 'https://ogmake.com/o/abc123.png',
      hash: 'abc123',
      cached: false,
      width: 1200,
      height: 630,
      format: 'png',
      bytes: 48213,
      templateVersion: '1',
    },
  },
};
