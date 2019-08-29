import { Slotify } from '../src/slotify.js';
import { LitElement, html } from 'lit-element';

class SlottedComponent extends LitElement {
  render() {
    return html`
      <h1>Hello World</h1>
    `;
  }
}

customElements.define('slotted-component', SlottedComponent);
