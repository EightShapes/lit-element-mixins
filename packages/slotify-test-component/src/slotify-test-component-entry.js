import { SlotifyTestComponent, SimpleWrapper } from './slotify-test-component.js';

if (window.customElements.get('slotify-test-component') === undefined) {
  window.customElements.define('slotify-test-component', SlotifyTestComponent);
}

if (window.customElements.get('simple-wrapper') === undefined) {
  window.customElements.define('simple-wrapper', SimpleWrapper);
}
