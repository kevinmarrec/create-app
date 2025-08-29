import { VueQueryPlugin } from '@tanstack/vue-query'
import { Cloudstack } from 'virtual:cloudstack'

import App from './App.vue'

export const createApp = Cloudstack(App, ({ app }) => {
  app.use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
  })
})
