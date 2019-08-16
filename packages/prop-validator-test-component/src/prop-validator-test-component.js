import { LitElement, html } from 'lit-element';
import { PropValidator } from '@eightshapes/prop-validator';

export class PropValidatorTestComponent extends PropValidator(LitElement, {
  inlineErrors: true,
}) {
  static get properties() {
    return {
      size: {
        type: String,
        validate: [{ type: 'inclusion', values: ['small', 'medium', 'large'] }],
      },
      name: {
        type: String,
        validate: [
          { type: 'inclusion', values: ['unicorn', 'pirate', 'ninja'] },
        ],
      },
      variation: {
        type: String,
        validate: [{ type: 'exclusion', values: ['thorns', 'thistles'] }],
      },
    };
  }

  get size() {
    return this._size;
  }

  set size(value) {
    console.log('Custom setter still runs');
    const oldValue = this._size;
    this._size = value;
    this.requestUpdate('size', oldValue);
  }

  render() {
    return html`
      <p class="prop-validator-test-component">
        Size: ${this.size}<br />
        Name: ${this.name}<br />
        Variation: ${this.variation}
      </p>
    `;
  }
}