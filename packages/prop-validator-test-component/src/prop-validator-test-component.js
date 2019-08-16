import { LitElement, html } from 'lit-element';
import { PropValidator } from '@eightshapes/prop-validator';

export class PropValidatorTestComponent extends PropValidator(LitElement, {
  inlineErrors: true,
  blockRenderWhenInvalid: true,
}) {
  static get properties() {
    return {
      size: {
        type: String,
        // validate: [{ type: 'inclusion', values: ['small', 'medium', 'large'] }],
      },
      name: {
        type: String,
        validate: [
          {
            type: 'inclusion',
            values: ['unicorn', 'pirate', 'ninja', 'bunny', 'rabbit', 'hare'],
          },
          {
            if: function() {
              // Have to use a regular function here, otherwise this.size won't work
              return this.size === 'small';
            },
            type: 'inclusion',
            values: ['bunny', 'rabbit', 'hare'],
            message: function(value, prop, data) {
              return `'${value}' is an invalid value when size == 'small'. Must be one of: ${data.values.join(
                ', ',
              )}.  This is an ${data.type} rule.`;
            },
          },
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
    // console.log('Custom setter still runs');
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
