import { SlotifyTestComponent } from './slotify-test-component.js';

if (window.customElements.get('slotify-test-component') === undefined) {
  window.customElements.define('slotify-test-component', SlotifyTestComponent);
}
