import process from 'node:process'

import darkMode from '@kevinmarrec/vite-plugin-dark-mode'
import yaml from '@modyfi/vite-plugin-yaml'
import unhead from '@unhead/addons/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import unocss from 'unocss/vite'
import * as v from 'valibot'
import { defineConfig, type PluginOption } from 'vite'
import valibot from 'vite-plugin-valibot-env'
import devtools from 'vite-plugin-vue-devtools'
import tsconfigPaths from 'vite-tsconfig-paths'

export const envSchema = v.object({
  VITE_API_URL: v.pipe(v.string(), v.nonEmpty(), v.readonly()),
  VITE_ANALYTICS_URL: v.pipe(v.string(), v.nonEmpty(), v.readonly()),
  VITE_ANALYTICS_WEBSITE_ID: v.pipe(v.string(), v.nonEmpty(), v.readonly()),
})

declare global {
  interface ViteConfigEnv extends v.InferOutput<typeof envSchema> {}
}

export default defineConfig(({ command, mode }) => {
  const plugins: PluginOption[] = [
    darkMode(),
    devtools({
      componentInspector: {
        toggleComboKey: 'alt-s',
      },
    }),
    tsconfigPaths(),
    unhead(),
    unocss(),
    valibot(envSchema),
    vue({
      features: {
        optionsAPI: command !== 'build',
      },
    }),
    yaml(),
  ]

  if (mode === 'analyze') {
    plugins.push(visualizer({
      filename: 'node_modules/.vite/stats.html',
      brotliSize: true,
      gzipSize: true,
      open: true,
      sourcemap: true,
    }))
  }

  return {
    build: {
      modulePreload: {
        polyfill: false,
      },
      sourcemap: mode === 'analyze',
    },
    builder: {
      async buildApp(builder) {
        if (builder.config.mode === 'static') {
          const { build } = await import('vite-ssg/node')
          await build(builder.config.ssgOptions)
          process.exit(0)
        }

        await builder.build(builder.environments.client)
      },
    },
    plugins,
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      beastiesOptions: {
        reduceInlineStyles: false,
      },
    },
    ssr: {
      noExternal: ['@kevinmarrec/vue-i18n'],
    },
  }
})
