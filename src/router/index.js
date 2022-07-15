import { createRouter, createWebHashHistory } from 'vue-router';
import { SUPPORT_LOCALES, setI18nLanguage, loadLocaleMessages } from '../i18n';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   const paramsLocale = to.params.locale

//   // use locale if paramsLocale is not in SUPPORT_LOCALES
//   if (!SUPPORT_LOCALES.includes(paramsLocale)) {
//     return next(`/${paramsLocale}`)
//   }

//   // load locale messages
//   if (!i18n.global.availableLocales.includes(paramsLocale)) {
//     await loadLocaleMessages(i18n, paramsLocale)
//   }

//   // set i18n language
//   setI18nLanguage(i18n, paramsLocale)

//   return next()
// });

export default router;
