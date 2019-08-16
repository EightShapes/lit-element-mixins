// inclusion
// exclusion
// format (regex)
// length
// presence (required)
// absence
// validates_with (custom function)

// Options per validator
// message - what appears in console
// on - when should validation run?
// if - conditional validation - possibly an array

export const PropValidator = (superclass, config) =>
  class extends superclass {
    constructor() {
      super();
      const defaultConfig = { inlineErrors: false, consoleErrors: true };
      const props = this.constructor.properties;
      config = { ...defaultConfig, ...config };

      for (const propName in props) {
        const propData = props[propName];
        if (propData.validate) {
          const validators = this.generateValidators(propName, propData);
          if (validators.length > 0) {
            this.injectValidatorsForProp(propName, validators);
          }
        }
      }
    }

    callDefaultGetter(propName) {
      return Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(this),
        propName,
      ).get.call(this); // Call the existing getter
    }

    callDefaultSetter(propName, value) {
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(this),
        propName,
      ).set.call(this, value);
    }

    injectValidatorsForProp(propName, validators) {
      Object.defineProperty(this, propName, {
        get: () => {
          return this.callDefaultGetter(propName);
        },
        set: value => {
          // Run all validators
          for (const validator of validators) {
            const response = validator(value);
            const valid = response[0];
            const message = response[1];
            if (!valid) {
              if (config.consoleErrors) {
                console.error(message);
              }
              if (config.inlineErrors) {
                value = message;
              } else {
                return; // If any of the validators fail, bail out and don't set the property value
              }
            }
          }

          // If all validators pass, call the existing getter
          this.callDefaultSetter(propName, value);
        },
      });
    }

    generateValidators(propName, propData) {
      const validators = propData.validate.map(validatorData => {
        return this.generateValidator(
          validatorData.type,
          validatorData,
          propName,
        );
      });
      return validators;
    }

    generateValidator(type, data, prop) {
      switch (type) {
        case 'inclusion': {
          return this.generateInclusionValidator(prop, data);
        }
        case 'exclusion': {
          return this.generateExclusionValidator(prop, data);
        }
        default: {
          return () => {
            console.warn(
              `No validator named '${type}' exists. '${prop}' wasn't validated.`,
            );
            return true;
          };
        }
      }
    }

    generateInclusionValidator(prop, data) {
      return value => {
        const valid = data.values.indexOf(value) !== -1;
        const message = `'${value}' is an invalid value for '${prop}'. Must be one of: ${data.values.join(
          ', ',
        )}`;
        return [valid, message];
      };
    }

    generateExclusionValidator(prop, data) {
      return value => {
        const valid = data.values.indexOf(value) === -1;
        const message = `'${value}' is an invalid value for '${prop}'. '${prop}' cannot be: ${data.values.join(
          ', ',
        )}`;
        return [valid, message];
      };
    }
  };
