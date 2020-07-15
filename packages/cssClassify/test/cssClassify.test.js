/* eslint-disable no-undef */
import { expect, fixture, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit-element';
import { CSSClassify } from '../src/cssClassify.js';

class MyComponent extends CSSClassify(LitElement) {
  static get properties() {
    return {
      active: {
        type: Boolean,
      },
      inputSize: {
        type: String,
        attribute: 'input-size',
      },
      size: {
        type: String,
      },
    };
  }

  get cssClassObject() {
    return {
      default: {
        default: 'my-component',
        prefix: 'my-component',
        active: this.active,
        size: {
          class: `size-${this.size}`,
          conditional: this.size,
        },
        'always-there': true,
        'this-class-is-by-itself': { prefix: false },
      },
      input: {
        default: 'my-component__input',
        size: {
          class: `size--${this.inputSize}`,
          conditional: this.inputSize,
        },
      },
    };
  }

  render() {
    return html`
      <h1 class="${this.getClassName()}">Testing</h1>
      <input type="text" class="${this.getClassName('input')}" />
    `;
  }
}

const tag = defineCE(MyComponent);

describe('css classify test component', () => {
  it('generates a classname based on an object key when the value is true', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component--always-there')).to.be.true;
  });

  it('applies a prefix to all classes when prefix key is present', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component--always-there')).to.be.true;
  });

  it("suppresses the prefix when a class name's prefix key is false", async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('this-class-is-by-itself')).to.be.true;
  });

  it('generates a classname when a boolean property is present', async () => {
    const el = await fixture(`<${tag} active></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component--active')).to.be.true;
  });

  it('does not generate a classname when a boolean property is absent', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component--active')).to.be.false;
  });

  it('generates an interpolated class name when the conditional is true', async () => {
    const el = await fixture(`<${tag} size="small"></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component--size-small')).to.be.true;
  });

  it('does not generate an interpolated class name when the conditional is false', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component--size')).to.be.false;
  });

  it('should apply a default class with no prefix', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const h1 = el.shadowRoot.querySelector('h1');

    expect(h1.classList.contains('my-component')).to.be.true;
  });

  it('should apply a separate set of classes addressable by element', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const input = el.shadowRoot.querySelector('input');

    expect(input.classList.contains('my-component__input')).to.be.true;
  });

  it('separate element classes should not be present when conditionals fail', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    const input = el.shadowRoot.querySelector('input');

    expect(input.classList.contains('size')).to.be.false;
  });

  it('separate element classes should be present when conditionals are true', async () => {
    const el = await fixture(`<${tag} input-size="large"></${tag}>`);
    const input = el.shadowRoot.querySelector('input');

    expect(input.classList.contains('size--large')).to.be.true;
  });
});
