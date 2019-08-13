import { LitElement, html } from 'lit-element';

export class SRoot extends HTMLElement {
  // I am Sroot!
}

export class SSlot extends HTMLElement {
  constructor() {
    super();
    this.name = this.getAttribute('name');

    const observer = new MutationObserver(() => {
      console.log("something changed");
    });

    observer.observe(this, {childList: true});
  }

  connectedCallback() {
    this.sRoot = this.closest('s-root');

    this.updateAssignedContent();
    const lightDomObserver = new MutationObserver(() => this.updateAssignedContent());
    lightDomObserver.observe(this.sRoot.parentElement, {childList: true});
  }

  updateAssignedContent() {
    const lightDOM = this.sRoot.parentElement;
    let content = [];

    if (this.name) {
      // Handle named slots
      content = Array.from(lightDOM.querySelectorAll(`*[slot=${this.name}]`));
    } else {
      // Handle default slot content
      content = Array.from(lightDOM.childNodes)
        .filter(n => {
          if (n.nodeType === Node.TEXT_NODE) {
            return n;
          } else if (!n.getAttribute('slot') && !n.tagName === 's-root') {
            return n;
          }
        });
    }

    if (content) {
      const fragment = document.createDocumentFragment();
      content.forEach(node => {
        fragment.appendChild(node);
      });

      this.appendChild(fragment);
    }
  }
}

// The Slotify Base Component
export class Slotify extends LitElement {
  constructor() {
    super();
      if (!customElements.get('s-slot')) {
        customElements.define('s-slot', SSlot);
      }
  }

  createRenderRoot() {
    if (!customElements.get('s-root')) {
      customElements.define('s-root', SRoot);
    }
    return document.createElement('s-root');
  }

  connectedCallback() {
    if (!this.renderRoot.parentElement) {
      this.appendChild(this.renderRoot);
    }

    super.connectedCallback();
  }
}

export class MyCheeseburger extends Slotify {
  render() {
    return html`
      <h1 class="esds-slotify">Welcome to Burgersville</h1>
      <s-slot name="top-bun"></s-slot>
      <s-slot name="cheese"></s-slot>
      <s-slot></s-slot>
      <s-slot name="bottom-bun"></s-slot>
      <h2>PLATE FOR THE BURGER</h2>
    `;
  }
}
