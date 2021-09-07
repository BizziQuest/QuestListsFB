
import Vue from 'vue'
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import i18n from '@/i18n';
import { options } from '@/plugins/vuetify';

// configure Vue to use Vuetify
Vue.use(Vuetify)
Vue.use(VueI18n)

// this was the only thing here by default
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}

// instantiate Vuetify instance with any component/story level params
const vuetify = new Vuetify(options)

// THIS is my decorator
export const decorators = [
  (story, context) => {
    // wrap the passed component within the passed context
    const wrapped = story(context)
    // extend Vue to use Vuetify around the wrapped component
    return Vue.extend({
      vuetify,
      i18n,
      components: { wrapped },
      props: {
        dark: {
          type: Boolean,
          default: context.args.dark,
        },
        locale: {
          type: String,
          default: 'en',
        },
      },
      watch: {
        dark: {
          immediate: true,
          handler (val) {
            this.$vuetify.theme.dark = val
          }
        },
        locale: {
          immediate: true,
          handler (val) {
            this.$i18n.locale = val
          }
        }
      },
      template: `
        <v-app>
          <v-container fluid>
            <wrapped />
          </v-container>
        </v-app>
      `
    })
  },
]
