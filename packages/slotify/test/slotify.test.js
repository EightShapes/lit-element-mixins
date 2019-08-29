import { fixture, html } from '@open-wc/testing';

describe('my-test', () => {
  it('works', async () => {
    const el = await fixture(html`
      <h1>Hello World</h1>
    `);
  });
});
