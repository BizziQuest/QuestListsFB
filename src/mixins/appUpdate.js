/**
 * Respectfully stolen from https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
 */

export default {
  data() {
    return {
      // refresh variables
      refreshing: false,
      registration: null,
      updateExists: false,
    };
  },

  created() {
    document.addEventListener('swUpdated', this.updateAvailable, { once: true });

    // Prevent multiple refreshes
    navigator.serviceWorker?.addEventListener('controllerchange', () => { // eslint-disable-line no-unused-expressions
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },
  methods: {
    updateAvailable(event) {
      this.registration = event.detail; // store this so we can use it if needed
      this.updateExists = true;
    },

    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },
  },
};
