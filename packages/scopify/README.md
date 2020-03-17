# Scopify

Scopify is a [LitElement](https://lit-element.polymer-project.org) mixin. It adds convenience methods for defining custom element tags with a scoped namespace.

## Installation
Install the package
```bash
npm install @eightshapes/scopify
```

Wrap the component in the mixin:

```js
// Wrap LitElement with Scopify, and pass default scope as the second argument
export class DsButton extends Scopify(LitElement, 'ds') {
  static get customElementName() {
    return 'button'; // the custom element tag name without the scope
  }
}
```

### Custom Element Definition
```js
import { DsButton } from '/path/to/DsButton.js';
DsButton.define();
// This will check the customElements registry and register <ds-button> as a new custom element if it doesn't already exist
```

To define a custom element with a different scope:
```js
import { DsButton } from '/path/to/DsButton.js';
DsButton.define('unicorn');
// This will check the customElements registry and register <unicorn-button> as a new custom element if it doesn't already exist
```

## Usage in Design Systems
As Design System components iterate through breaking changes, consumers of those components may not be able to upgrade all instances at once. By scoping custom element tags, the migration burden can be eased since multiple instances of the same component **at different versions** can exist at the same time:

```js
import { DsButton } from '/path/to/ds/DsButton.js';
import { DsButton as DsButtonV3 } from '/path/to/ds-v3/DsButton.js';
DsButton.define(); // <ds-button>
DsButtonV3.define('ds-v3'); // <ds-v3-button>
```
Usage:
```html
<h1>My Application</h1>
<ds-button>Old Style Button</ds-button>
<ds-v3-button>New V3 Style Button</ds-v3-button>
```

For information on installing different versions of the same NPM package, see this [StackOverflow Question](https://stackoverflow.com/questions/26414587/how-to-install-multiple-versions-of-package-using-npm)
