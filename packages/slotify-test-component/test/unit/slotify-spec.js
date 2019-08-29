/* eslint-disable no-undef */
import sinon from 'sinon';
import { fixture, expect, oneEvent } from '@open-wc/testing';

import '../../src/slotify-test-component-entry.js';

describe('slotify test component', () => {
  // it('supports default slot content', async () => {
  //   const el = await fixture(
  //     `<slotify-test-component>
  //       BEEF, BACON, LETTUCE, TOMATO
  //     </slotify-test-component>`,
  //   );
  //   expect(el.textContent).to.contain('BEEF, BACON, LETTUCE, TOMATO');
  // });
  //
  // it('hides fallback content in the default slot when slotable content is present', async () => {
  //   const el = await fixture(
  //     `<slotify-test-component>
  //       BEEF, BACON, LETTUCE, TOMATO
  //     </slotify-test-component>`,
  //   );
  //   const fallbackContent = Array.from(
  //     el.querySelectorAll('s-fallback-wrapper[hidden]'),
  //   );
  //   const defaultContent = fallbackContent.find(
  //     node => node.textContent === 'JUST BEEF',
  //   );
  //   expect(defaultContent).to.not.be.an('undefined');
  // });
  //
  // it('supports fallback content in the default slot', async () => {
  //   const el = await fixture(
  //     '<slotify-test-component></slotify-test-component>',
  //   );
  //   expect(el.textContent).to.contain('JUST BEEF');
  // });



  // it('hides fallback content in a named slot when slotable content is present', async () => {
  //   const el = await fixture(
  //     `<slotify-test-component>
  //       <div slot="cheese">CHEDDAR</div>
  //     </slotify-test-component>`,
  //   );
  //   const fallbackContent = el.querySelector(
  //     's-slot[name="cheese"] s-fallback-wrapper[hidden]',
  //   );
  //   expect(fallbackContent).to.not.be.a('null');
  // });

  // it('supports fallback content in the named slot', async () => {
  //   const el = await fixture(
  //     '<slotify-test-component></slotify-test-component>',
  //   );
  //   expect(el.textContent).to.contain('DEFAULT CHEESE');
  // });

  // it("allows slot content to be ordered based on the component's template", async () => {
  //   const el = await fixture(
  //     `<slotify-test-component>
  //       <div slot="bun-bottom">This is the Bottom Bun</div>
  //       <div slot="bun-top">This is the Top Bun</div>
  //     </slotify-test-component>`,
  //   );
  //   const bunTopSlot = el.querySelector('s-slot[name="bun-top"]');
  //   const bunBottomSlot = el.querySelector('s-slot[name="bun-bottom"]');
  //   expect(bunTopSlot.textContent).to.contain('This is the Top Bun');
  //   expect(bunBottomSlot.textContent).to.contain('This is the Bottom Bun');
  // });

  // it('allows additional slot content to be added to the default slot after the component has been initialized', async () => {
  //   const el = await fixture(
  //     '<slotify-test-component></slotify-test-component>',
  //   );
  //   const defaultSlot = Array.from(el.querySelectorAll('s-slot')).find(
  //     s => s.getAttribute('name') === null,
  //   );
  //
  //   const newContent = document.createElement('div');
  //   newContent.textContent = 'Added after component initialization';
  //   await el.appendChild(newContent);
  //
  //   expect(defaultSlot.textContent).to.contain(
  //     'Added after component initialization',
  //   );
  // });

  // it('defaults to fallback content in the default slot when all other content is removed', async () => {
  //   const initialContent = document.createElement('div');
  //   initialContent.id = 'hook-to-remove';
  //   initialContent.textContent = 'Added before component initialization';
  //   const el = await fixture(
  //     '<slotify-test-component>' +
  //       initialContent.outerHTML +
  //       '</slotify-test-component>',
  //   );
  //   const defaultSlot = Array.from(el.querySelectorAll('s-slot')).find(
  //     s => s.getAttribute('name') === null,
  //   );
  //
  //   const slotContent = document.getElementById('hook-to-remove');
  //   slotContent.parentNode.removeChild(slotContent);
  //
  //   expect(defaultSlot.textContent).to.not.contain(
  //     'Added before component initialization',
  //   );
  //
  //   expect(defaultSlot.textContent).to.contain('JUST BEEF');
  // });

  // it('allows additional slot content to be added to a named slot after the component has been initialized', async () => {
  //   const el = await fixture(
  //     '<slotify-test-component></slotify-test-component>',
  //   );
  //   const cheeseSlot = el.querySelector('s-slot[name="cheese"]');
  //
  //   const newContent = document.createElement('div');
  //   newContent.setAttribute('slot', 'cheese');
  //   newContent.textContent = 'GOUDA';
  //   await el.appendChild(newContent);
  //
  //   expect(cheeseSlot.textContent).to.contain('GOUDA');
  // });

  // it('defaults to fallback content in the default slot when all other content is removed', async () => {
  //   const initialContent = document.createElement('div');
  //   initialContent.setAttribute('slot', 'cheese');
  //   initialContent.id = 'hook-to-remove';
  //   initialContent.textContent = 'SWISS';
  //   const el = await fixture(
  //     '<slotify-test-component>' +
  //       initialContent.outerHTML +
  //       '</slotify-test-component>',
  //   );
  //   const cheeseSlot = el.querySelector('s-slot[name="cheese"]');
  //
  //   const slotContent = document.getElementById('hook-to-remove');
  //   slotContent.parentNode.removeChild(slotContent);
  //
  //   expect(cheeseSlot.textContent).to.not.contain('SWISS');
  //
  //   expect(cheeseSlot.textContent).to.contain('DEFAULT CHEESE');
  // });

  xit('should fire a slotchange event on the default slot when content is added', async () => {
    const el = await fixture(
      '<slotify-test-component></slotify-test-component>',
    );

    const defaultSlot = Array.from(el.querySelectorAll('s-slot')).find(
      s => s.getAttribute('name') === null,
    );

    const { detail } = await oneEvent(defaultSlot, 'slotchange');

    const newContent = document.createElement('div');
    newContent.textContent = 'Added after component initialization';
    el.appendChild(newContent);

    expect(detail).to.be.true;
  });
});
