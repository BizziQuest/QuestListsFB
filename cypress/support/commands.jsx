// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { mount } from 'cypress/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import routes from '../../src/router/routes';
// import router from '../../src/router';
import vuetify from '../../src/plugins/vuetify';
// import { VApp } from '../../node_modules/vuetify/lib/components';
// import Vue from 'vue';
// import { VApp } from 'vuetify/lib/components/VApp';
// Vue.use(Vuetify);
// import { VApp } from '../../node_modules/vuetify/lib/components/VApp';
import {VApp} from 'vuetify/components/VApp';

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  // create router if one is not provided
  if (!options.router) {
    options.router = createRouter({
      routes: routes,
      history: createMemoryHistory(),
    })
  }

  options.plugins=[vuetify];

  // Add router plugin
  options.global.plugins.push({
    install(app) {
      app.use(options.router);
      // app.use(vuetify);
    },
  })
  // options.vuetify = Vuetify;

  return cypressMount(() => (<VApp>
    <div>
      <component is={component}/>
    </div>
  </VApp>), options)
})
