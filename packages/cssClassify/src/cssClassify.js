export const CSSClassify = superclass =>
  class extends superclass {
    getClassName(elementName = false) {
      let css = this.cssClassObject;
      let classNames = [];

      if (elementName) {
        // Support multiple css Class Objects
        css = css[elementName];
      } else if (typeof css.default === 'object') {
        css = css.default;
      }

      if (css) {
        let prefix = css['prefix'] ? `${css['prefix']}--` : '';

        for (let className in css) {
          let usePrefix = true;
          let conditional = css[className];

          // Additional functionality for interpolation & prefix suppression
          if (typeof conditional === 'object') {
            // Prefix suppression
            if (conditional.prefix === false) {
              usePrefix = false;
            }

            // Interpolated class Name
            if (conditional.hasOwnProperty('class')) {
              className = conditional.class;
            }

            // Alternate conditional
            if (conditional.hasOwnProperty('conditional')) {
              conditional = conditional['conditional'];
            }
          }

          // Default Class Name
          if (className === 'default') {
            usePrefix = false;
            className = conditional;
          }

          if (className !== 'prefix' && conditional) {
            classNames.push(`${usePrefix ? prefix : ''}${className}`);
          }
        }
      }

      return classNames.join(' ');
    }
  };
