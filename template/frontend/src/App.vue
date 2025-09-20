<script setup lang="ts">
import { useAuth, useHead, useI18n } from '@frontend/composables'
import { ref } from 'vue'

const { t } = useI18n()
useHead({
  title: () => t('title'),
})

const { user, signUp, signIn, signOut } = useAuth()

const email = ref('')
const password = ref('')
</script>

<template>
  <div class="grid h-full place-items-center">
    <div class="flex flex-col gap-4 items-center">
      <!-- Login Form (when user is not logged in) -->
      <div v-if="!user" class="mx-auto max-w-md w-full">
        <div class="p-8 rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <h2 class="text-2xl text-gray-900 font-bold mb-6 text-center dark:text-white">
            Welcome Back
          </h2>

          <form class="space-y-4" @submit.prevent>
            <div>
              <label for="email" class="text-sm text-gray-700 font-medium mb-2 block dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="px-3 py-2 border border-gray-300 rounded-md w-full shadow-sm dark:text-white focus:outline-none dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              >
            </div>

            <div>
              <label for="password" class="text-sm text-gray-700 font-medium mb-2 block dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="px-3 py-2 border border-gray-300 rounded-md w-full shadow-sm dark:text-white focus:outline-none dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              >
            </div>

            <div v-if="signIn.error.value || signUp.error.value" class="text-sm text-red-600 dark:text-red-400">
              {{ signIn.error.value || signUp.error.value }}
            </div>

            <div class="flex space-x-3">
              <button
                :disabled="signIn.isPending.value"
                class="text-white font-medium px-4 py-2 rounded-md bg-blue-600 flex-1 transition-colors duration-200 disabled:bg-blue-400 hover:bg-blue-700"
                @click="signIn.mutate({ email, password })"
              >
                <span v-if="signIn.isPending.value">Signing In...</span>
                <span v-else>Sign In</span>
              </button>

              <button
                :disabled="signUp.isPending.value"
                class="text-white font-medium px-4 py-2 rounded-md bg-green-600 flex-1 transition-colors duration-200 disabled:bg-green-400 hover:bg-green-700"
                @click="signUp.mutate({ email, password, name: 'User' })"
              >
                <span v-if="signUp.isPending.value">Signing Up...</span>
                <span v-else>Sign Up</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- User Dashboard (when user is logged in) -->
      <div v-else class="mx-auto max-w-md w-full">
        <div class="p-8 text-center rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <div class="mb-6">
            <div class="mx-auto mb-4 rounded-full flex h-20 w-20 items-center justify-center from-blue-500 to-purple-600 bg-gradient-to-r">
              <span class="text-2xl text-white font-bold">
                {{ user.name?.charAt(0).toUpperCase() || 'U' }}
              </span>
            </div>
            <h2 class="text-2xl text-gray-900 font-bold dark:text-white">
              Welcome, {{ user.name || 'User' }}!
            </h2>
            <p class="text-gray-600 mt-2 dark:text-gray-400">
              {{ user.email }}
            </p>
          </div>

          <button
            :disabled="signOut.isPending.value"
            class="text-white font-medium px-4 py-2 rounded-md bg-red-600 w-full transition-colors duration-200 disabled:bg-red-400 hover:bg-red-700"
            @click="signOut.mutate({})"
          >
            <span v-if="signOut.isPending.value">Signing Out...</span>
            <span v-else>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
