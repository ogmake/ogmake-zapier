'use strict';
const { BASE_URL } = require('../common');

const perform = async (z, bundle) => {
  const i = bundle.inputData;
  const body = { html: i.html, width: Number(i.width), height: Number(i.height) };
  if (i.css) body.css = i.css;
  if (i.format) body.format = i.format;
  const res = await z.request({ method: 'POST', url: `${BASE_URL}/v1/images`, body });
  return res.data;
};

module.exports = {
  key: 'render_html',
  noun: 'HTML Image',
  display: { label: 'Render HTML', description: 'Renders raw HTML and CSS to an image or PDF (2 credits) and returns the hosted URL.' },
  operation: {
    inputFields: [
      { key: 'html', label: 'HTML', type: 'text', required: true, helpText: 'HTML to render. JavaScript never runs; request body limit 300 KB.' },
      { key: 'css', label: 'CSS', type: 'text', required: false },
      { key: 'width', label: 'Width (px)', type: 'integer', required: true, default: '1200' },
      { key: 'height', label: 'Height (px)', type: 'integer', required: true, default: '630' },
      { key: 'format', label: 'Format', choices: { png: 'PNG', jpg: 'JPG', webp: 'WebP', pdf: 'PDF' }, default: 'png' },
    ],
    perform,
    sample: { url: 'https://ogmake.com/o/abc123.png', hash: 'abc123', width: 1200, height: 630, format: 'png', bytes: 48213, credits: 2 },
  },
};
