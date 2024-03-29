/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (import.meta.env.MODE === 'production') {
  register(`${import.meta.env.BASE_URL}service-worker.js`, {
    ready() {
      console.info(
        'App is being served from cache by a service worker.\n'
        + 'For more details, visit https://goo.gl/AFskqB',
      );
    },
    registered() {
      console.info('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.info('New content is downloading.');
    },
    updated(registration) {
      console.warn('New content is available; attempting automatic refresh.');
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration }),
      );
    },
    offline() {
      console.info('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
