/*
 * Usage example:
 export class EsdsCard extends Slotify(Scopify(LitElement, 'esds')) where 'esds' is the default namespace

 * To override the default namespace:
 import { EsdsCard } from '/path/to/EsdsCard.js';
 EsdsCard.define('unicorn'); // This will define <unicorn-card> on the custom element registry
*/

export const Scopify = (superclass, defaultNamespace) =>
  class extends superclass {
    static define(namespace = defaultNamespace) {
      if (!this.customElementName) {
        console.warn(`static 'customElementName' property must be defined.`)
      }

      const customElementName = `${namespace}-${this.customElementName}`;
      this.customElementNamespace = namespace;
      this.namespacedCustomElementName = customElementName;

      if (!this.customElementDefined(customElementName)) {
        customElements.define(customElementName, this);
      }
    }

    static customElementDefined(customElementName) {
      return customElements.get(customElementName) !== undefined;
    }
  };
