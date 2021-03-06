/* eslint-disable no-undef */
/* eslint-disable max-len */
/*
  This was copied from the Vuetify source.
  https://github.com/vuetifyjs/vuetify/blob/be8e7a77eafad8925432a4a3abf22f3b8e6f04f8/packages/vuetify/test/util/to-have-been-warned.ts
*/

// From Vue, slightly modified
function noop() { }

if (typeof console === 'undefined') {
  window.console = {
    warn: noop,
    error: noop,
  };
}

// avoid info messages during test
console.info = noop;

const asserted = [];

function createCompareFn(spy) {
  const hasWarned = (msg) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const args of spy.mock.calls) {
      if (args.some((arg) => (
        arg.toString().includes(msg)
      ))) return true;
    }
    return false;
  };

  return (msg) => {
    asserted.push(msg);
    const warned = Array.isArray(msg)
      ? msg.some(hasWarned)
      : hasWarned(msg);
    return {
      pass: warned,
      message: warned
        ? () => (`Expected message "${msg}" not to have been warned`)
        : () => (`Expected message "${msg}" to have been warned`),
    };
  };
}

function toHaveBeenWarnedInit() {
  let warn;
  let error;
  beforeAll(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(noop);
    error = jest.spyOn(console, 'error').mockImplementation(noop);
    expect.extend({
      toHaveBeenErrored: createCompareFn(error),
      toHaveBeenWarned: createCompareFn(warn),
    });
  });

  beforeEach(() => {
    asserted.length = 0;
    warn.mockClear();
    error.mockClear();
  });

  afterEach((done) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const type of ['error', 'warn']) {
      const warned = (msg) => asserted.some((assertedMsg) => msg.toString().includes(assertedMsg));
      // eslint-disable-next-line no-restricted-syntax,no-console
      for (const args of console[type].mock.calls) {
        if (!warned(args[0])) {
          done.fail(`Unexpected console.${type} message: ${args[0]}`);
          return;
        }
      }
    }
    done();
  });
}

export default toHaveBeenWarnedInit;
