import { LitElement, html } from 'lit-element';

export class SRoot extends HTMLElement {
  // I am Sroot!
}

export class SSlot extends HTMLElement {
  constructor() {
    super();
    this.name = this.getAttribute('name');

  }

  connectedCallback() {
    console.log("CONNECTING", this.name);
    this.sRoot = this.closest('s-root');

    // Observe the "Light DOM" of the component, to detect when new nodes are added and assign them to the <s-slot> if necessary
    this.lightDomObserver = new MutationObserver(() => this.updateAssignedContent());
    this.lightDomObserver.observe(this.sRoot.parentElement, {childList: true});

    // Create assigned content and fallback content wrappers
    this.fallbackWrapper = this.fallbackWrapper || this.createFallbackWrapper();
    this.assignedWrapper = this.assignedWrapper || this.createAssignedWrapper();

    // Observe the assignedContentWrapper (so default content can be shown if all slotables are deleted)
    const assignedContentObserver = new MutationObserver(() => {
      this.updateEmptySlot(); // This is an observer on the actual <s-slot>
    });
    assignedContentObserver.observe(this.assignedWrapper, {childList: true});

    this.updateAssignedContent();
  }

  disconnectedCallback() {
    this.lightDomObserver.disconnect(); // don't let observers pile up
  }

  createFallbackWrapper() {
    // This is only called once, get the contents of this <s-slot> and wrap them in a span
    if (this.childNodes.length === 0) {
      // there's no default content, don't create the wrapper
      return false;
    } else {
      const fallbackSpan = document.createElement('span');
      fallbackSpan.classList.add('fallback-content');
      Array.from(this.childNodes).forEach(node => {
        fallbackSpan.appendChild(node);
      });
      this.appendChild(fallbackSpan); // Add the fallback span to the component;
      return fallbackSpan;
    }
  }

  createAssignedWrapper() {
    const assignedSpan = document.createElement('span');
    assignedSpan.classList.add('assigned-content');
    this.appendChild(assignedSpan); // Add the assigned span to the component;
    return assignedSpan;
  }

  updateAssignedContent(checkForEmptySlot=false) {
    const lightDOM = this.sRoot.parentElement;
    const unplacedNodes = Array.from(lightDOM.childNodes).filter(node => {
      return node.parentNode === this.sRoot.parentElement; // return all nodes outside the <s-root>, they haven't been moved yet
    })
    let content = [];

    if (this.name) {
      // Handle named slots
      content = unplacedNodes.filter(node => node.nodeType !== Node.TEXT_NODE && node.getAttribute('slot') === this.name);
    } else {
      // Handle default slot content
      content = unplacedNodes
        .filter(n => {
          if (n.nodeType === Node.TEXT_NODE) {
            return n;
          } else if (!n.getAttribute('slot') && !n.tagName === 's-root') {
            return n;
          }
        });
    }


    if (content.length > 0) {
      // Some slotable content was found, remove default content
      const fragment = document.createDocumentFragment();
      content.forEach(node => {
        fragment.appendChild(node);
      });

      this.assignedWrapper.appendChild(fragment);
      if (this.fallbackWrapper) {
        this.fallbackWrapper.setAttribute('hidden', true);
        this.assignedWrapper.removeAttribute('hidden'); // Do a visibility toggle so the mutationObserver will not be triggered and create a loop
      }
    }
  }

  updateEmptySlot() {
    if (this.fallbackWrapper && this.assignedWrapper.childNodes.length === 0) {
      this.fallbackWrapper.removeAttribute('hidden');
      this.assignedWrapper.setAttribute('hidden', true); // Do a visibility toggle so the mutationObserver will not be triggered and create a loop
    }
  }
}

// The Slotify Base Component
export class Slotify extends LitElement {
  constructor() {
    super();
    if (!customElements.get('s-root')) {
      customElements.define('s-root', SRoot);
    }
    if (!customElements.get('s-slot')) {
      customElements.define('s-slot', SSlot);
    }
  }

  createRenderRoot() {
    // Wrap the entire rendered output in an <s-root> element
    return document.createElement('s-root');
  }

  connectedCallback() {
    // Ensure the contents are wrapped in the <s-root> element
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
      <s-slot name="cheese">No cheese? So sad :(</s-slot>
      <s-slot></s-slot>
      <br/>
      <s-slot name="special-sauce">Some default special sauce</s-slot>
      <s-slot name="bottom-bun"></s-slot>
      <h2>PLATE FOR THE BURGER</h2>
    `;
  }
}
