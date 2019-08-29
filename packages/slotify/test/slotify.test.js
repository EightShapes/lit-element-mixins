import { expect, fixture, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit-element';
import { Slotify } from '../src/slotify.js';

const tag = defineCE(
  class extends Slotify(LitElement) {
    constructor() {
      super();
      this.foo = true;
    }

    render() {
      return html`
        <h1>Hello World</h1>
      `;
    }
  },
);

it('can instantiate a slotified element', async () => {
  const el = await fixture(`<${tag}></${tag}>`);
  expect(el.textContent).to.contain('Hello World');
});
