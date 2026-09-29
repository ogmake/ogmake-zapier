'use strict';
const BASE_URL = 'https://ogmake.com';
const RESERVED = ['format', 'preset', 'scale', 'v', 'bg', 'sig', 'debug'];

const templateField = { key: 'template', label: 'Template', type: 'string', required: true, default: 'basic', helpText: 'Template ID, e.g. basic or blog.' };
const paramsField = { key: 'params', label: 'Template Fields', dict: true, helpText: 'Template params such as title, author, date.' };
const formatField = { key: 'format', label: 'Format', choices: { png: 'PNG', jpg: 'JPG', webp: 'WebP', pdf: 'PDF' }, default: 'png' };
const presetField = { key: 'preset', label: 'Preset', choices: { og: 'OG (1200x630)', x: 'X', square: 'Square' }, default: 'og' };

const cleanParams = (params) => {
  const out = {};
  for (const [k, v] of Object.entries(params || {})) {
    if (RESERVED.includes(k) || /[[\]]/.test(k)) {
      throw new Error(`Field name "${k}" is reserved`);
    }
    out[k] = String(v);
  }
  return out;
};

module.exports = { BASE_URL, RESERVED, templateField, paramsField, formatField, presetField, cleanParams };
