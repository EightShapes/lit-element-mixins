[![Build Status](https://travis-ci.org/EightShapes/lit-element-mixins.svg?branch=master)](https://travis-ci.org/EightShapes/lit-element-mixins)

# Slotify
Slotify is a LitElement class mixin that enables `<slot>` functionality in templates without requiring the use of ShadowDOM.

It's based on the [Vampire Slot Library](https://github.com/Boulevard/vampire) by @daniel-nagy.

## Usage
Install:

```
 npm install @eightshapes/slotify --save
```

In your LitElement Component:

```
import { LitElement, html } from 'lit-element';
import { Slotify } from '@eightshapes/slotify';

export class MyCheeseburger extends Slotify(LitElement) {
  render() {
    return html`
      <div class="my-cheeseburger">
        <s-slot name="bun-top"></s-slot>
        <s-slot name="cheese">DEFAULT CHEESE</s-slot>
        <s-slot></s-slot>
        <s-slot name="bun-bottom"></s-slot>
        <div class="my-cheeseburger__plate">Burger Plate</div>
      </div>
    `;
  }
}

customElements.define('my-cheeseburger', MyCheeseburger);
```

Then to use the component in HTML:

```
<script type="module" src="/path/to/compiled/my-cheeseburger.js" />
<my-cheeseburger>
  <div slot="bun-bottom">BUN BOTTOM</div>
  <div slot="bun-top">BUN TOP</div>
  Meat, pickles, lettuce, tomato
  <div slot="cheese">CHEESE</div>
</my-cheeseburger>
```

## Details
Use `<s-slot>` elements in LitElement templates instead of `<slot>` elements. `<s-slot>` is a custom element that enables the slot-like functionality via Mutation Observers.

## Isn't ShadowDOM the future?
Maybe. I have some [thoughts on that](https://codepen.io/kevinmpowell/pen/JQwOyE). If you decide that ShadowDOM is for you at some point in the future, switching from Slotify to ShadowDOM is easy.

1. Unwrap the `Slotify` mixin from your `extends LitElement` declaration.
2. Replace all the `<s-slot>` instances in your template with `<slot>`

That's it!

Consumers of your component don't need to change anything, their code will already be compatible with ShadowDOM.

![Slotify To ShadowDOM](../../slotify-to-shadow-dom.gif)
