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

export const PropValidator = superclass =>
  class extends superclass {
    constructor() {
      super();
      const props = this.constructor.properties;

      for (const propName in props) {
        const propData = props[propName];
        if (propData.validate) {
          console.log(`Found a validator for ${propName}`);
          this.generateValidators(propName, propData);
        }
      }
    }

    generateValidators(propName, propData) {
      const validators = propData.validate.map(validatorData => {
        const validatorType = Object.keys(validatorData)[0];
        return this.generateValidator(
          validatorType,
          validatorData[validatorType],
          propName,
        );
      });

      if (validators.length > 0) {
        Object.defineProperty(this, propName, {
          get: () => {
            return Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(this),
              propName,
            ).get.call(this); // Call the existing getter
          },
          set: value => {
            // Run all validators
            for (const validator of validators) {
              const response = validator(value);
              const valid = response[0];
              const message = response[1];
              if (!valid) {
                console.error(message);
                return; // If any of the validators fail, bail out and don't set the property value
              }
            }

            // If all validators pass, call the existing getter
            Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(this),
              propName,
            ).set.call(this, value);
          },
        });
      }
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
          }; // A dummy method if no validation rule exists
        }
      }
    }

    generateInclusionValidator(prop, data) {
      return value => {
        const valid = data.includes(value);
        const message = `'${value}' is an invalid value for '${prop}'. Must be one of: ${data.join(
          ', ',
        )}`;
        return [valid, message];
      };
    }

    generateExclusionValidator(prop, data) {
      return value => {
        const valid = !data.includes(value);
        const message = `'${value}' is an invalid value for '${prop}'. '${prop}' cannot be: ${data.join(
          ', ',
        )}`;
        return [valid, message];
      };
    }
  };
