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







// import Vuex from 'vuex';
// // Import commands.js using ES2015 syntax:
// import { h } from 'vue';
// import { VApp } from 'vuetify/components';
// import vuetify from '../../src/plugins/vuetify';
// import router from '../../src/router';
// import './commands';
// // Alternatively you can use CommonJS syntax:
// // require('./commands')

// import { mountCallback } from 'cypress/vue';

// // Cypress.Commands.add('mount', mount);

// // Example use:
// // cy.mount(MyComponent)

// export const mountVuetify = (component, options) => {
//   return mountCallback(h(VApp, {}, component), {
//     ...options,
//     global: {
//       ...(options?.global || {}),
//       plugins: [
//         ...(options?.global?.plugins || []),
//         router,
//         vuetify,
//         Vuex
//       ]
//     }
//   })
// }

// Cypress.Commands.add('mount', mountVuetify);

import { mount } from 'cypress/vue';
import { h } from 'vue';
// import Vuetify from 'vuetify';
import { VApp } from 'vuetify/components';
import vuetify from '../../src/plugins/vuetify';

// We recommend that you pull this out
// into a constants file that you share with
// your main.js file.
const vuetifyOptions = {}

Cypress.Commands.add('mount', (component, ...args) => {
  args.global = args.global || {}
  args.global.plugins = args.global.plugins || []
  args.global.plugins.push(vuetify)

  return mount(() => {
    return h(VApp, {}, component)
  }, ...args)
})
