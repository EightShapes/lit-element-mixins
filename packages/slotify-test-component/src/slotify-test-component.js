import { LitElement, html } from 'lit-element';
import { Slotify } from '@eightshapes/slotify';

export class SlotifyTestComponent extends Slotify(LitElement) {
  handleSlotChange(e) {
    console.log('Slot content changed', e.target);
  }

  render() {
    return html`
      <div class="burger-wrap">
        <s-slot name="bun-top"></s-slot>
        <s-slot name="cheese">DEFAULT CHEESE</s-slot>
        <s-slot @slotchange=${this.handleSlotChange}></s-slot>
        <s-slot name="bun-bottom"></s-slot>
        <div class="burger-plate">Burger Plate</div>
      </div>
    `;
  }
}
