import { LitElement, html } from 'lit-element';
import { PropValidator } from '@eightshapes/prop-validator';

export class PropValidatorTestComponent extends PropValidator(LitElement) {
  static get properties() {
    return {
      size: {
        type: String,
        validate: [{ inclusion: ['small', 'medium', 'large'] }],
      },
      name: {
        type: String,
        validate: [{ inclusion: ['unicorn', 'pirate', 'ninja'] }],
      },
    };
  }

  get size() {
    return this._size;
  }

  set size(value) {
    console.log('size be settin');
    const oldValue = this._size;
    this._size = value;
    this.requestUpdate('size', oldValue);
  }

  somethingRandom() {
    console.log('HERE');
  }

  render() {
    return html`
      <h1 class="prop-validator-test-component">
        Hi, I'm the prop-validator-test-component component. ${this.size}
      </h1>
    `;
  }
}
