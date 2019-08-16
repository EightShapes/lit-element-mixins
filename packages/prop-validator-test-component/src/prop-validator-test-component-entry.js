import { PropValidatorTestComponent } from './prop-validator-test-component.js';

if (window.customElements.get('prop-validator-test-component') === undefined) {
  window.customElements.define('prop-validator-test-component', PropValidatorTestComponent);
}
