import { createI18n } from '@kevinmarrec/vue-i18n'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg/single-page'

import App from './App.vue'

import 'virtual:uno.css'

export const createApp = ViteSSG(App, async ({ app }) => {
  app.use(await createI18n({
    messages: import.meta.glob('./locales/*.yml'),
  }))

  app.use(createPinia())
  app.use(PiniaColada, {
    queryOptions: {
      enabled: !import.meta.env.SSR,
    },
  })
})
