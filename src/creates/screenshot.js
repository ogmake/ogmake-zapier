'use strict';
const { BASE_URL } = require('../common');

const perform = async (z, bundle) => {
  const i = bundle.inputData;
  const body = { url: i.url, width: Number(i.width) };
  if (i.height) body.height = Number(i.height);
  if (i.fullPage) body.fullPage = true;
  if (i.format) body.format = i.format;
  const res = await z.request({ method: 'POST', url: `${BASE_URL}/v1/screenshot`, body });
  return res.data;
};

module.exports = {
  key: 'screenshot',
  noun: 'Screenshot',
  display: { label: 'Screenshot URL', description: 'Captures a public web page (3 credits) and returns the hosted image URL.' },
  operation: {
    inputFields: [
      { key: 'url', label: 'Page URL', type: 'string', required: true, helpText: 'Public http(s) page to capture.' },
      { key: 'width', label: 'Width (px)', type: 'integer', required: true, default: '1280' },
      { key: 'height', label: 'Height (px)', type: 'integer', required: false, helpText: 'Default 800.' },
      { key: 'fullPage', label: 'Full Page', type: 'boolean', required: false, helpText: 'Capture the whole page (capped at 10000 px tall).' },
      { key: 'format', label: 'Format', choices: { png: 'PNG', jpg: 'JPG', webp: 'WebP' }, default: 'png' },
    ],
    perform,
    sample: { url: 'https://ogmake.com/o/abc123.png', hash: 'abc123', width: 1280, height: 800, fullPage: false, format: 'png', bytes: 91234, credits: 3 },
  },
};
