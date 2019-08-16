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

    // getAllMethodNames(obj) {
    //   let methods = new Set();
    //   while ((obj = Reflect.getPrototypeOf(obj))) {
    //     let keys = Reflect.ownKeys(obj);
    //     keys.forEach(k => methods.add(k));
    //   }
    //   return methods;
    // }

    generateValidators(propName, propData) {
      const validators = propData.validate.map(validatorData => {
        const validatorType = Object.keys(validatorData)[0];
        return this.generateValidator(validatorType, validatorData, propName);
      });

      if (validators.length > 0) {
        Object.defineProperty(this, propName, {
          get: () => {
            return super[propName];
          },
          set: value => {
            Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(this),
              propName,
            ).set.call(this, value);
            console.log('we have the comms', propName);
            // console.log(propName, super[propName]);
            // super[propName].call(value);
            // super[propName](value);
            // this.super[propName] = value;
            // const oldValue = this[`_${propName}`];
            // this[`_${propName}`] = value;
            // this.requestUpdate(propName, oldValue);
          },
        });
      }
      // console.log(this);
      // let obj = this;
      // while ((obj = Object.getPrototypeOf(obj))) {
      //   console.log(Object.getOwnPropertyDescriptors(obj));
      // }
      // console.log(obj);
    }

    generateValidator(type, data, prop) {
      switch (type) {
        case 'inclusion': {
          return this.generateInclusionValidator(prop, data);
        }
      }
    }

    generateInclusionValidator(prop, data) {
      return value => {
        return data.includes(value);
      };
    }
  };
