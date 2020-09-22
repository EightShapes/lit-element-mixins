/* eslint-disable no-undef */
import { expect, fixture, defineCE } from '@open-wc/testing';
import { elementUpdated } from '@open-wc/testing-helpers';
import { LitElement, html } from 'lit-element';
import { Slotify } from '../src/slotify.js';
import { createSandbox } from 'sinon';

const FALLBACK_CONTENT = 'This is fallback content';
const NAMED_SLOT_FALLBACK_CONTENT = 'NAMED SLOT DEFAULT CONTENT';

class TestSlotify extends Slotify(LitElement) {
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
}

const tag = defineCE(TestSlotify);

function getDefaultSlot(el) {
  return Array.from(el.querySelectorAll('s-slot')).find(
    s => !s.getAttribute('name'),
  );
}

function getNamedSlot(el, name) {
  return el.querySelector(`s-slot[name="${name}"]`);
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
}

describe('slotify test component', () => {
  const sandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should not track render attempts until element is connected to the DOM', async () => {
    const sSlotTimeoutIntervalMs = 50;
    new TestSlotify();

    // Invoke constructor without being connected to the DOM
    const SSlot = customElements.get('s-slot');
    const sSlot = new SSlot();

    // `_slotRenderAttempts` should remain 0 as long as the element is not
    // connected to the DOM
    await delay(sSlotTimeoutIntervalMs + 1);
    expect(sSlot._slotRenderAttempts).to.equal(0);
  });

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

    it('should persist default slot content even when the component is disconnected and reconnected', async () => {
      const el = await fixture(
        `<${tag}>This is my persistent content</${tag}>`,
      );
      el.parentNode.removeChild(el); // remove element from DOM
      document.body.appendChild(el); // Add it back to the DOM
      await elementUpdated(el);
      const defaultSlot = getDefaultSlot(el);
      const assignedWrapper = defaultSlot.querySelector('s-assigned-wrapper');
      expect(assignedWrapper.textContent).to.contain(
        'This is my persistent content',
      );
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

    it('should not choke on comments', async () => {
      const el = await fixture(
        `<${tag}>
          <!---->
          <div slot="my-named-slot">This is first in source</div>
          <div slot="first-slot">This is second in source</div>
        </${tag}>`,
      );

      // When this test fails it throws a console.error

      const firstSlot = getNamedSlot(el, 'first-slot');
      const namedSlot = getNamedSlot(el, 'my-named-slot');

      expect(firstSlot.textContent).to.contain('This is second in source');
      expect(namedSlot.textContent).to.contain('This is first in source');
    });
  });

  describe('update complete event', () => {
    it('should resolve the updateComplete promise only after all slots are rendered', async () => {
      const el = await fixture(
        `<${tag}>
          <div slot="my-named-slot" class="lots-of-divs">
            <${tag}>
              <div class="default-content">Default Slot Content</div>
              <div slot="my-named-slot">
                <${tag}>
                  <div class="default-content">Default Slot Content</div>
                  <div slot="my-named-slot">
                    <${tag}>
                      <div class="default-content">Default Slot Content</div>
                      <div slot="my-named-slot">
                        <${tag}>
                          <div class="default-content">Default Slot Content</div>
                          <div slot="my-named-slot">

                          </div>
                        </${tag}>
                      </div>
                    </${tag}>
                  </div>
                </${tag}>
              </div>
            </${tag}>
          </div>
          <div slot="my-named-slot" class="lots-of-divs">This is some named slot content</div>
        </${tag}>`,
      );

      await el.updateComplete;
      const deeplyNestedSlotable = el.querySelector(
        `${tag} ${tag} ${tag} ${tag} s-assigned-wrapper .default-content`,
      );
      expect(deeplyNestedSlotable).to.not.be.null;
    });
  });

  describe('hasSlotableContent', () => {
    it('returns false when the default slot is unused', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent();
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      el.innerHTML = '';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly();
      expect(el.hasSlotableContent).to.have.returned(false);
    });

    it('identifies ELEMENT_NODEs in the default slot', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent();
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      // slot an element into the default slot
      el.innerHTML =
        '<div>This is a default slot of nodeType ELEMENT_NODE</div>';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly();
      expect(el.hasSlotableContent).to.have.returned(true);
    });

    it('identifies TEXT_NODEs in the default slot', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent();
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      // slot plain text into the default slot
      el.innerHTML = 'This is a default slot of nodeType TEXT_NODE';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly();
      expect(el.hasSlotableContent).to.have.returned(true);
    });

    it('identifies empty TEXT_NODEs in the default slot', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent();
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      // slot an empty text node into the default slot
      el.innerHTML = ' ';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly();
      expect(el.hasSlotableContent).to.have.returned(true);
    });

    it('ignores empty TEXT_NODEs in the default slot when ignoreWhitespace is enabled', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent('default', { ignoreWhitespace: true });
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      // slot an empty text node into the default slot
      el.innerHTML = ' ';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly('default', {
        ignoreWhitespace: true,
      });
      expect(el.hasSlotableContent).to.have.returned(false);
    });

    it('identifies COMMENT_NODEs in the default slot', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent();
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      // slot a comment into the default slot
      el.innerHTML = '<!-- foo -->';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly();
      expect(el.hasSlotableContent).to.have.returned(true);
    });

    it('ignores COMMENT_NODEs in the default slot when ignoreComments is enabled', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasDefaultSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent('default', { ignoreComments: true });
        }
      }

      const hasDefaultSlotTestTag = defineCE(HasDefaultSlotTest);
      const el = document.createElement(hasDefaultSlotTestTag);

      // slot a comment into the default slot
      el.innerHTML = '<!-- foo -->';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly('default', {
        ignoreComments: true,
      });
      expect(el.hasSlotableContent).to.have.returned(false);
    });

    it('returns false when a named slot is unused', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasNamedSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent('my-named-slot');
        }
      }

      const hasNamedSlotTestTag = defineCE(HasNamedSlotTest);
      const el = document.createElement(hasNamedSlotTestTag);

      el.innerHTML = "<div>This is not the named slot you're looking for</div>";

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly(
        'my-named-slot',
      );
      expect(el.hasSlotableContent).to.have.returned(false);
    });

    it('identifies ELEMENT_NODEs in a named slot', async () => {
      // invoke `hasSlotableContent` before initial render so we can spy on the return value
      class HasNamedSlotTest extends TestSlotify {
        connectedCallback() {
          super.connectedCallback();
          this.hasSlotableContent('my-named-slot');
        }
      }

      const hasNamedSlotTestTag = defineCE(HasNamedSlotTest);
      const el = document.createElement(hasNamedSlotTestTag);

      // slot an element into a named slot
      el.innerHTML =
        '<div slot="my-named-slot">This is a named slot of nodeType ELEMENT_NODE</div>';

      sandbox.spy(el, 'hasSlotableContent');

      await fixture(el);

      expect(el.hasSlotableContent).to.have.been.calledWithExactly(
        'my-named-slot',
      );
      expect(el.hasSlotableContent).to.have.returned(true);
    });
  });

  describe('hasAssignedSlotContent', () => {
    it('returns false when the slot does not exist', async () => {
      const el = await fixture(
        `<${tag}><div>Some default slot content</div></${tag}>`,
      );

      sandbox.spy(el, 'getAssignedSlotContent');

      const hasAssignedSlotContent = el.hasAssignedSlotContent('non-existent-slot');
      expect(el.getAssignedSlotContent).to.have.returned(undefined);
      expect(hasAssignedSlotContent).to.be.false;
    });

    it('returns false when the default slot is unused', async () => {
      const el = await fixture(
        `<${tag}><div slot="my-named-slot">Some named slot content</div></${tag}>`,
      );

      const hasAssignedSlotContent = el.hasAssignedSlotContent();
      expect(hasAssignedSlotContent).to.be.false;
    });

    it('identifies ELEMENT_NODEs in the default slot', async () => {
      const el = await fixture(
        `<${tag}><div>Some default slot content</div></${tag}>`,
      );

      const hasAssignedSlotContent = el.hasAssignedSlotContent();
      expect(hasAssignedSlotContent).to.be.true;
    });

    it('identifies TEXT_NODEs in the default slot', async () => {
      const el = await fixture(
        `<${tag}>Some default slot text content</${tag}>`,
      );

      const hasAssignedSlotContent = el.hasAssignedSlotContent();
      expect(hasAssignedSlotContent).to.be.true;
    });

    it('identifies empty TEXT_NODEs in the default slot', async () => {
      const el = await fixture(`<${tag}> </${tag}>`);

      const hasAssignedSlotContent = el.hasAssignedSlotContent();
      expect(hasAssignedSlotContent).to.be.true;
    });

    it('identifies COMMENT_NODEs in the default slot', async () => {
      const el = await fixture(`<${tag}><!-- foo --></${tag}>`);

      const hasAssignedSlotContent = el.hasAssignedSlotContent();
      expect(hasAssignedSlotContent).to.be.true;
    });
  });
});
