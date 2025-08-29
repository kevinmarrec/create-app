<script setup lang="ts">
import { useHead, useI18n } from '@frontend/composables'
import { useWelcome } from '@frontend/queries'

const { t } = useI18n()

useHead({
  title: () => t('title'),
})

const { data: message } = useWelcome('world')
</script>

<template>
  <div class="grid h-full place-items-center">
    <div class="flex flex-col gap-4 items-center">
      <h1 class="text-4xl font-bold">
        {{ t('body.message') }}
      </h1>
      <h2 class="text-2xl text-gray-500">
        {{ message }}
      </h2>
    </div>
  </div>
</template>
