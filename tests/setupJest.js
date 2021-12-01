import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);
process.on('unhandledRejection', () => {
  // XXX: console.log('REJECTION', reason);
});

export default async () => {
  // XXX: toHaveBeenWarnedInit();
};
