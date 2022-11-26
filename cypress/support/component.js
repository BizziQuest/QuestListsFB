// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import Vuex from 'vuex';
// Import commands.js using ES2015 syntax:
import './commands'
import vuetify from '../../src/plugins/vuetify';
import router from '../../src/router';
// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount, mountCallback } from 'cypress/vue2'

Cypress.Commands.add('mount', mount);

// Example use:
// cy.mount(MyComponent)

export const mountVuetify = (component, options) => {
  return mountCallback(component, {
    ...options,
    global: {
      ...(options?.global || {}),
      plugins: [
        ...(options?.global?.plugins || []),
        router,
        vuetify,
        Vuex
      ]
    }
  })
}

Cypress.Commands.add('mountVuetify', mountVuetify);
