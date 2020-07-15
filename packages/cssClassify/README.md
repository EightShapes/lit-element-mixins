[![Build Status](https://travis-ci.org/EightShapes/lit-element-mixins.svg?branch=master)](https://travis-ci.org/EightShapes/lit-element-mixins)

# CSS Classify

This mixin makes it easy to generate long CSS class strings based on various props and conditionals within your Lit Element components.

## Usage

Install:

```
 npm install @eightshapes/css-classify --save
```

Wrap LitElement in Mixin:

```js
  import { LitElement, html } from 'lit-element';
  import { CSSClassify } from '@eightshapes/css-classify';

  class MyCard extends CSSClassify(LitElement) {
    static get properties() {
      return {
        active: { type: Boolean },
        heading: { type: String }
      }
    }

    // Define a cssClassObject getter
    get cssClassObject() {
      return {
          // If the value evaluates to true, the key will always be applied as a class
          'my-card': true,
          // If the value evaluates to false, the key will not be applied as a class
          active: this.active,
          // If all classes should have a prefix, specify it with a 'prefix' key
          prefix: 'my-card', // will cause `active` to become `my-card--active`
          // If interpolation is desired, pass an object as a value and define the class that should be applied
          size: {
            class: `size-${this.size}` // If this.size == 'small' this will generate `my-card--size-small`
          }
          // If a class should only be applied based on some other conditional than the value evaluating to true, pass the separate conditional as an object
          size: {
            class: `size-${this.size}`,
            conditional: this.size, // Will only render when this.size is defined
          }
        }
      };
    }

    // call this.getClassName() and the mixin will generate a valid CSS class name based on the cssClassObject()
    render() {
      html`
        <div class="${this.getClassName()}">
          <h1>${this.heading}</h1>
        </div>`
    }
  }
```

Use custom element:

```html
<my-card heading="Test Card"></my-card>

<!-- Renders -->

<div class="my-card">
  <h1>Test Card</h1>
</div>

<!----------------->

<my-card heading="Test Card" active></my-card>

<!-- Renders -->

<div class="my-card active">
  <h1>Test Card</h1>
</div>
```
