'use strict';
const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');
const { canonicalQuery, signCanonical } = require('../signing');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const authData = {
  apiKey: 'og_live_test',
  keyId: 'k_1',
  signingSecret: Buffer.from(Array.from({ length: 32 }, (_, i) => i)).toString('base64'),
};

describe('ogmake', () => {
  afterEach(() => nock.cleanAll());

  it('signing matches the fixed vector', () => {
    const c = canonicalQuery({ template: 'basic', title: 'Hello World', format: 'png' });
    expect(c).toBe('format=png&template=basic&title=Hello%20World');
    expect(signCanonical(authData.signingSecret, c)).toBe('W8Xvrf9UTFKbVVQtofHq7A2ljK9z-nvJUL3B-rB7MY8');
  });

  it('auth test calls /v1/usage with the bearer key', async () => {
    nock('https://ogmake.com', { reqheaders: { authorization: 'Bearer og_live_test' } })
      .get('/v1/usage').reply(200, { plan: 'free' });
    const res = await appTester(App.authentication.test, { authData });
    expect(JSON.stringify(res)).toContain('free');
  });

  it('create_image posts to /v1/images', async () => {
    const scope = nock('https://ogmake.com')
      .post('/v1/images', { template: 'blog', params: { title: 'Hi' }, format: 'pdf', preset: 'og' })
      .reply(201, { url: 'https://ogmake.com/o/x.pdf', hash: 'x', cached: false });
    const res = await appTester(App.creates.create_image.operation.perform, {
      authData,
      inputData: { template: 'blog', params: { title: 'Hi' }, format: 'pdf', preset: 'og' },
    });
    expect(res.url).toBe('https://ogmake.com/o/x.pdf');
    expect(scope.isDone()).toBe(true);
  });

  it('create_image surfaces API errors', async () => {
    nock('https://ogmake.com').post('/v1/images').reply(400, { error: 'unknown_template', detail: [{ field: 'template', message: 'nope' }] });
    await expect(
      appTester(App.creates.create_image.operation.perform, { authData, inputData: { template: 'zzz' } }),
    ).rejects.toThrow(/unknown_template: template nope/);
  });

  it('create_image rejects reserved field names', async () => {
    await expect(
      appTester(App.creates.create_image.operation.perform, { authData, inputData: { template: 'basic', params: { sig: 'x' } } }),
    ).rejects.toThrow(/reserved/);
  });

  it('build_signed_url signs locally', async () => {
    const res = await appTester(App.creates.build_signed_url.operation.perform, {
      authData,
      inputData: { template: 'basic', params: { title: 'Hello World' }, format: 'png' },
    });
    expect(res.url).toBe('https://ogmake.com/i/k_1/W8Xvrf9UTFKbVVQtofHq7A2ljK9z-nvJUL3B-rB7MY8?format=png&template=basic&title=Hello%20World');
  });

  it('build_signed_url requires signing credentials', async () => {
    await expect(
      appTester(App.creates.build_signed_url.operation.perform, { authData: { apiKey: 'x' }, inputData: { template: 'basic' } }),
    ).rejects.toThrow(/Signing Secret/);
  });

  it('render_html posts the html body, omitting empty css', async () => {
    const scope = nock('https://ogmake.com', { reqheaders: { authorization: 'Bearer og_live_test' } })
      .post('/v1/images', { html: '<h1>Hi</h1>', width: 1200, height: 630, format: 'webp' })
      .reply(201, { url: 'https://ogmake.com/o/h.webp', credits: 2 });
    const res = await appTester(App.creates.render_html.operation.perform, {
      authData,
      inputData: { html: '<h1>Hi</h1>', css: '', width: '1200', height: '630', format: 'webp' },
    });
    expect(res.credits).toBe(2);
    expect(scope.isDone()).toBe(true);
  });

  it('screenshot posts to /v1/screenshot', async () => {
    const scope = nock('https://ogmake.com')
      .post('/v1/screenshot', { url: 'https://example.com/', width: 1280, height: 800, fullPage: true, format: 'jpg' })
      .reply(201, { url: 'https://ogmake.com/o/s.jpg', credits: 3 });
    const res = await appTester(App.creates.screenshot.operation.perform, {
      authData,
      inputData: { url: 'https://example.com/', width: '1280', height: '800', fullPage: true, format: 'jpg' },
    });
    expect(res.credits).toBe(3);
    expect(scope.isDone()).toBe(true);
  });

  it('screenshot minimal body and API error', async () => {
    nock('https://ogmake.com').post('/v1/screenshot', { url: 'http://10.0.0.1/', width: 1280 }).reply(400, { error: 'blocked_url', reason: 'private_address' });
    await expect(
      appTester(App.creates.screenshot.operation.perform, { authData, inputData: { url: 'http://10.0.0.1/', width: '1280' } }),
    ).rejects.toThrow(/blocked_url/);
  });

  it('signed url encodes the key id', async () => {
    const res = await appTester(App.creates.build_signed_url.operation.perform, {
      authData: { ...authData, keyId: 'k/1 x' },
      inputData: { template: 'basic' },
    });
    expect(res.url).toContain('/i/k%2F1%20x/');
  });
});
