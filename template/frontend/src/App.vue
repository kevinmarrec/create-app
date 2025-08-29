<script setup lang="ts">
import { useAuth, useHead, useI18n } from '@frontend/composables'

const { t } = useI18n()
useHead({
  title: () => t('title'),
})

const { session, signUp, signIn, signOut } = useAuth()
</script>

<template>
  <div class="grid h-full place-items-center">
    <div class="flex flex-col gap-4 items-center">
      <h1 class="text-4xl font-bold">
        {{ t('body.message') }}
      </h1>
      <pre>{{ session }}</pre>
      <button @click="() => signUp({ email: 'test45@test.com', password: 'password1234', name: 'test' })">
        Sign Up
      </button>
      <button @click="() => signIn({ email: 'test45@test.com', password: 'password1234' })">
        Sign In
      </button>
      <button @click="() => signOut({})">
        Sign Out
      </button>
    </div>
  </div>
</template>
