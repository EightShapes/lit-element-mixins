export const Slotify = superclass => {
  const DEFAULT_SLOT_INTROSPECTION_OPTIONS = {
    ignoreComments: false,
    ignoreWhitespace: false,
  };

  return class extends superclass {
    constructor() {
      super();

      if (!customElements.get('s-root')) {
        const SRoot = class extends HTMLElement {};
        customElements.define('s-root', SRoot);
      }
      if (!customElements.get('s-slot')) {
        const SSlot = class extends HTMLElement {
          constructor() {
            super();
            this.name = this.getAttribute('name');

            this._slotRendered = false;
            this._slotRenderAttempts = 0;
            this._maxSlotRenderAttempts = 10;
          }

          connectedCallback() {
            this._slotUpdateCompleted = new Promise((resolve, reject) => {
              const id = setInterval(() => {
                this._slotRenderAttempts++;
                try {
                  if (this._slotRendered) {
                    clearInterval(id);
                    resolve();
                  } else if (
                    this._slotRenderAttempts >= this._maxSlotRenderAttempts
                  ) {
                    throw new Error('Slot Rendering Timeout');
                  }
                } catch (e) {
                  clearInterval(id);
                  reject(e);
                }
              }, 50);
            });

            // closest() polyfill for IE11
            if (!Element.prototype.matches) {
              Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                Element.prototype.webkitMatchesSelector;
            }

            if (!Element.prototype.closest) {
              Element.prototype.closest = function(s) {
                var el = this;

                do {
                  if (el.matches(s)) return el;
                  el = el.parentElement || el.parentNode;
                } while (el !== null && el.nodeType === 1);
                return null;
              };
            }

            this.sRoot = this.closest('s-root');

            // Observe the "Light DOM" of the component, to detect when new nodes are added and assign them to the <s-slot> if necessary
            this.lightDomObserver = new MutationObserver(() => {
              this._slotRendered = false;
              this.updateAssignedContent();
            });
            this.lightDomObserver.observe(this.sRoot.parentElement, {
              childList: true,
            });

            // Create assigned content and fallback content wrappers
            this.fallbackWrapper =
              this.fallbackWrapper || this.createFallbackWrapper();
            this.assignedWrapper =
              this.assignedWrapper || this.createAssignedWrapper();

            // Observe the assignedContentWrapper (so default content can be shown if all slotables are deleted)
            const assignedContentObserver = new MutationObserver(() => {
              this._slotRendered = false;
              this.updateEmptySlot(); // This is an observer on the actual <s-slot>
              this.dispatchEvent(
                new CustomEvent('slotchange', {
                  bubbles: true,
                }),
              );
            });
            assignedContentObserver.observe(this.assignedWrapper, {
              childList: true,
            });

            this.updateAssignedContent();
          }

          disconnectedCallback() {
            this.lightDomObserver.disconnect(); // don't let observers pile up
            const element = this.sRoot && this.sRoot.parentElement;
            const fragment = document.createDocumentFragment();

            Array.from(this.assignedWrapper.childNodes).forEach(child => {
              fragment.appendChild(child);
            });

            if (element) {
              element.appendChild(fragment);
            }

            this.sRoot = null;
          }

          createFallbackWrapper() {
            if (!customElements.get('s-fallback-wrapper')) {
              const SFallbackWrapper = class extends HTMLElement {};
              customElements.define('s-fallback-wrapper', SFallbackWrapper);
            }

            const fallbackNodes = Array.from(this.childNodes).filter(
              n =>
                n.tagName === undefined ||
                n.tagName.toLowerCase() !== 's-assigned-wrapper',
            );
            // This is only called once, get the contents of this <s-slot> and wrap them in a span
            if (fallbackNodes.length === 0) {
              // there's no default content, don't create the wrapper
              return false;
            } else {
              const fallbackWrapper = document.createElement(
                's-fallback-wrapper',
              );
              fallbackNodes.forEach(node => {
                fallbackWrapper.appendChild(node);
              });
              this.appendChild(fallbackWrapper); // Add the fallback span to the component;
              return fallbackWrapper;
            }
          }

          createAssignedWrapper() {
            if (!customElements.get('s-assigned-wrapper')) {
              const SAssignedWrapper = class extends HTMLElement {};
              customElements.define('s-assigned-wrapper', SAssignedWrapper);
            }
            const assignedWrapper = document.createElement(
              's-assigned-wrapper',
            );
            this.appendChild(assignedWrapper); // Add the assigned span to the component;
            return assignedWrapper;
          }

          updateAssignedContent() {
            const lightDOM = this.sRoot.parentElement;
            const unplacedNodes = Array.from(lightDOM.childNodes).filter(
              node => {
                return (
                  node.parentNode === this.sRoot.parentElement &&
                  node !== this.sRoot
                ); // return all nodes outside the <s-root>, they haven't been moved yet
              },
            );
            let content = [];

            if (this.name) {
              // Handle named slots
              content = unplacedNodes.filter(
                node =>
                  node.nodeType === Node.ELEMENT_NODE &&
                  node.getAttribute('slot') === this.name,
              );
            } else {
              // Handle default slot content
              content = unplacedNodes.filter(n => {
                if (n.nodeType !== Node.ELEMENT_NODE) {
                  return n;
                } else if (
                  typeof n.getAttribute === 'function' &&
                  !n.getAttribute('slot')
                ) {
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
            this._slotRendered = true;
          }

          updateEmptySlot() {
            if (
              this.fallbackWrapper &&
              this.assignedWrapper.childNodes.length === 0
            ) {
              this.fallbackWrapper.removeAttribute('hidden');
              this.assignedWrapper.setAttribute('hidden', true); // Do a visibility toggle so the mutationObserver will not be triggered and create a loop
            }

            this._slotRendered = true;
          }
        };
        customElements.define('s-slot', SSlot);
      }
    }

    createRenderRoot() {
      // Wrap the entire rendered output in an <s-root> element
      // Check for existing <s-root> element
      // Array.find would be nice here, but IE11 doesn't like it. More verbose code to avoid polyfilling Array.find for IE11
      let existingSRoot = undefined;
      Array.from(this.childNodes).forEach(n => {
        if (n.tagName && n.tagName.toLowerCase() === 's-root') {
          existingSRoot = n;
        }
      });
      if (existingSRoot !== undefined) {
        return existingSRoot;
      } else {
        return document.createElement('s-root');
      }
    }

    connectedCallback() {
      // Ensure the contents are wrapped in the <s-root> element
      if (!this.renderRoot.parentElement) {
        this.appendChild(this.renderRoot);
      }

      super.connectedCallback();
    }

    async _getUpdateComplete() {
      await super._getUpdateComplete();
      const slotPromises = Array.from(this.querySelectorAll('s-slot')).map(
        s => s._slotUpdateCompleted,
      );
      await Promise.all(slotPromises);
    }

    /*
     * After the component has rendered, this method can be used to retrieve the content assigned to a slot
     */
    getAssignedSlotContent(slotName = 'default') {
      let slot;
      if (slotName === 'default') {
        slot = Array.from(this.querySelectorAll('s-slot'))
          .filter(n => n.getAttribute('name') === null)
          .pop();
      } else {
        slot = this.querySelector(`s-slot[name='${slotName}']`);
      }

      if (!slot) return undefined; // Component hasn't rendered yet, no slot to query

      const slotContent = slot.querySelector('s-assigned-wrapper');
      if (slotContent.childNodes) {
        return slotContent.childNodes;
      }
      return undefined;
    }

    /*
     * Before the component has rendered, this method can be used to retrieve child nodes that will be assigned to a slot
     */
    getSlotableContent(slotName = 'default', options) {
      options = Object.assign({}, DEFAULT_SLOT_INTROSPECTION_OPTIONS, options || {});

      let slotableContent;
      if (slotName === 'default') {

        const isEmptyTextNode = n => {
          return n.nodeType === Node.TEXT_NODE && (n.nodeValue == null || n.nodeValue.trim() === '');
        };

        // get all nodes outside s-root that aren't assigned to another slot
        slotableContent = Array.from(this.childNodes).filter(n => {
          // only Element nodes can have tagNames and attributes. if the node is something else, we can
          // safely assume that it should be moved into the default slot.

          if (options.ignoreComments && n.nodeType === Node.COMMENT_NODE) {
            return false;
          } else if (options.ignoreWhitespace && isEmptyTextNode(n)) {
            return false;
          }

          return (
            n.nodeType !== Node.ELEMENT_NODE ||
            (n.tagName.toLowerCase() !== 's-root' &&
              n.getAttribute('slot') === null)
          );
        });
      } else {
        slotableContent = Array.from(
          this.querySelectorAll(`*[slot='${slotName}']`),
        );
      }

      return slotableContent;
    }

    /*
     * After the component has rendered, this method can be used to determine if a slot has assigned content
     */
    hasAssignedSlotContent(slotName = 'default') {
      const assignedSlotContent = this.getAssignedSlotContent(slotName);

      if (typeof assignedSlotContent === 'undefined') {
        return false;
      } else {
        return assignedSlotContent.length > 0;
      }
    }

    /*
     * Before the component has rendered, this method can be used to determine if a slot will have content after the component renders
     */
    hasSlotableContent(slotName = 'default', options) {
      options = Object.assign({}, DEFAULT_SLOT_INTROSPECTION_OPTIONS, options || {});

      return this.getSlotableContent(slotName, options).length > 0;
    }
  };
}
