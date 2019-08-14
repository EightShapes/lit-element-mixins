import { LitElement, html } from 'lit-element';
import { Slotify } from '@eightshapes/slotify';

export class SlotifyTestComponent extends Slotify(LitElement) {
  render() {
    return html`
      <div class="burger-wrap">
        <s-slot name="bun-top"></s-slot>
        <s-slot name="cheese">DEFAULT CHEESE</s-slot>
        <s-slot></s-slot>
        <s-slot name="bun-bottom"></s-slot>
        <div class="burger-plate">Burger Plate</div>
      </div>
    `;
  }
}
