# PropValidator
PropValidator is a LitElement mixin that adds basic validation methods for component properties.

## Usage
Install:

```
 npm install @eightshapes/prop-validator --save
```

In your LitElement Component:

```
import { LitElement, html } from 'lit-element';
import { PropValidator } from '@eightshapes/prop-validator';

export class ComboLock extends PropValidator(LitElement) {

}

customElements.define('combo-lock', ComboLock);
```

Then to use the component in HTML:

```
<script type="module" src="/path/to/compiled/combo-lock.js" />
<combo-lock size="unicorn"></combo-lock>
<!-- Console will throw an error that 'unicorn' is not a valid value for the 'size' prop -->
```
