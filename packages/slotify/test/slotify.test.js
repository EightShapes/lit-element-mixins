/* eslint-disable no-undef */
import { expect, fixture, defineCE } from '@open-wc/testing';
import { elementUpdated } from '@open-wc/testing-helpers';
import { LitElement, html } from 'lit-element';
import { Slotify } from '../src/slotify.js';

const FALLBACK_CONTENT = 'This is fallback content';
const NAMED_SLOT_FALLBACK_CONTENT = 'NAMED SLOT DEFAULT CONTENT';
const tag = defineCE(
  class extends Slotify(LitElement) {
    constructor() {
      super();
      this.foo = true;
    }

    render() {
      return html`
        <s-slot name="first-slot"></s-slot>
        <s-slot><h1>${FALLBACK_CONTENT}</h1></s-slot>
        <s-slot name="my-named-slot">${NAMED_SLOT_FALLBACK_CONTENT}</s-slot>
      `;
    }
  },
);

function getDefaultSlot(el) {
  return Array.from(el.querySelectorAll('s-slot')).find(
    s => !s.getAttribute('name'),
  );
}

function getNamedSlot(el, name) {
  return el.querySelector(`s-slot[name="${name}"]`);
}

describe('slotify test component', () => {
  describe('default slot behavior', () => {
    it('supports slotables in a default slot', async () => {
      const el = await fixture(
        `<${tag}>This content should appear in the slot</${tag}>`,
      );

      const defaultSlot = Array.from(el.querySelectorAll('s-slot')).find(
        s => !s.getAttribute('name'),
      );
      const assignedWrapper = defaultSlot.querySelector('s-assigned-wrapper');

      expect(assignedWrapper.textContent).to.contain(
        'This content should appear in the slot',
      );
    });

    it('supports fallback content in the default slot', async () => {
      const el = await fixture(
        `<${tag}>This content should appear in the slot</${tag}>`,
      );

      const defaultSlot = getDefaultSlot(el);
      const fallbackWrapper = defaultSlot.querySelector('s-fallback-wrapper');

      expect(fallbackWrapper.textContent).to.contain(FALLBACK_CONTENT);
    });

    it('hides fallback content in the default slot when slotable content is present', async () => {
      const el = await fixture(
        `<${tag}>This content should appear in the slot</${tag}>`,
      );

      const defaultSlot = getDefaultSlot(el);
      const fallbackWrapper = defaultSlot.querySelector('s-fallback-wrapper');

      expect(fallbackWrapper.hidden).to.be.true;
    });

    it('allows slotables to be added to the default slot after the component has been initialized', async () => {
      const el = await fixture(`<${tag}></${tag}>`);
      const defaultSlot = getDefaultSlot(el);

      const newContent = document.createElement('div');
      newContent.textContent = 'Added after component initialization';
      await el.appendChild(newContent);

      expect(defaultSlot.textContent).to.contain(
        'Added after component initialization',
      );
    });

    it('shows fallback content in the default slot when all other content is removed', async () => {
      const initialContent = document.createElement('div');
      initialContent.id = 'hook-to-remove';
      initialContent.textContent = 'Added before component initialization';
      const el = await fixture(`<${tag}>${initialContent.outerHTML}</${tag}>`);
      const defaultSlot = getDefaultSlot(el);
      const fallbackWrapper = defaultSlot.querySelector('s-fallback-wrapper');

      const slotContent = document.getElementById('hook-to-remove');
      slotContent.parentNode.removeChild(slotContent);
      await elementUpdated(el);

      expect(defaultSlot.textContent).to.not.contain(
        'Added before component initialization',
      );
      expect(defaultSlot.textContent).to.contain(FALLBACK_CONTENT);
      expect(fallbackWrapper.hidden).to.be.false;
    });
  });

  describe('named slot behavior', () => {
    it('supports slotables in a named slot', async () => {
      const el = await fixture(
        `<${tag}>
          <div slot="my-named-slot">This is some named slot content</div>
        </${tag}>`,
      );
      const namedSlot = getNamedSlot(el, 'my-named-slot');

      expect(namedSlot.textContent).to.contain(
        'This is some named slot content',
      );
    });

    it('supports fallback content in a named slot', async () => {
      const el = await fixture(`<${tag}></${tag}>`);
      expect(el.textContent).to.contain(NAMED_SLOT_FALLBACK_CONTENT);
    });

    it('hides fallback content in a named slot when slotable content is present', async () => {
      const el = await fixture(
        `<${tag}>
          <div slot="my-named-slot">This is some named slot content</div>
        </${tag}>`,
      );
      const namedSlot = getNamedSlot(el, 'my-named-slot');
      const fallbackWrapper = namedSlot.querySelector('s-fallback-wrapper');
      expect(fallbackWrapper.hidden).to.be.true;
    });

    it('allows slotables to be added to a named slot after the component has been initialized', async () => {
      const el = await fixture(`<${tag}></${tag}>`);
      const namedSlot = getNamedSlot(el, 'my-named-slot');

      const newContent = document.createElement('div');
      newContent.setAttribute('slot', 'my-named-slot');
      newContent.textContent = 'Yoda is great';
      await el.appendChild(newContent);

      expect(namedSlot.textContent).to.contain('Yoda is great');
    });

    it('shows fallback content in a named slot when all other content is removed', async () => {
      const initialContent = document.createElement('div');
      initialContent.setAttribute('slot', 'my-named-slot');
      initialContent.id = 'hook-to-remove';
      initialContent.textContent = 'Luke Skywalker';
      const el = await fixture(`<${tag}>${initialContent.outerHTML}</${tag}>`);
      const namedSlot = getNamedSlot(el, 'my-named-slot');
      const fallbackWrapper = namedSlot.querySelector('s-fallback-wrapper');

      const slotContent = document.getElementById('hook-to-remove');
      slotContent.parentNode.removeChild(slotContent);
      await elementUpdated(el);

      expect(namedSlot.textContent).to.not.contain('Luke Skywalker');
      expect(namedSlot.textContent).to.contain(NAMED_SLOT_FALLBACK_CONTENT);
      expect(fallbackWrapper.hidden).to.be.false;
    });

    it('allows input slotable order to not influence rendered slot order', async () => {
      const el = await fixture(
        `<${tag}>
          <div slot="my-named-slot">This is first in source</div>
          <div slot="first-slot">This is second in source</div>
        </${tag}>`,
      );

      const firstSlot = getNamedSlot(el, 'first-slot');
      const namedSlot = getNamedSlot(el, 'my-named-slot');

      expect(firstSlot.textContent).to.contain('This is second in source');
      expect(namedSlot.textContent).to.contain('This is first in source');
    });
  });
});
