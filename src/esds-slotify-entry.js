import { MyCheeseburger } from './esds-slotify.js';

if (window.customElements.get('my-cheeseburger') === undefined) {
  window.customElements.define('my-cheeseburger', MyCheeseburger);
}
