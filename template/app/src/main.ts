import { createI18n } from '@kevinmarrec/vue-i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { ViteSSG } from 'vite-ssg/single-page'

import App from './App.vue'

import 'virtual:uno.css'

export const createApp = ViteSSG(App, async ({ app }) => {
  const i18n = await createI18n({
    messages: import.meta.glob('./locales/*.yml'),
  })

  app.use(i18n)

  app.use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
  })
})
