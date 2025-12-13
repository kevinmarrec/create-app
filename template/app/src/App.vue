<script setup lang="ts">
import { ref } from 'vue'

import { useAuth, useContent, useHead, useI18n } from '~/app/composables'

const { t } = useI18n()
useHead({
  title: () => t('title'),
})

const { user, error, signIn, signUp, signOut } = useAuth()
const { publicContent, privateContent } = useContent()

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

            <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
              {{ error }}
            </div>

            <div class="flex space-x-3">
              <button
                :disabled="signIn.isLoading.value"
                class="text-white font-medium px-4 py-2 rounded-md bg-blue-600 flex-1 transition-colors duration-200 disabled:bg-blue-400 hover:bg-blue-700"
                @click="signIn.mutate({ email, password })"
              >
                <span v-if="signIn.isLoading.value">Signing In...</span>
                <span v-else>Sign In</span>
              </button>

              <button
                :disabled="signUp.isLoading.value"
                class="text-white font-medium px-4 py-2 rounded-md bg-green-600 flex-1 transition-colors duration-200 disabled:bg-green-400 hover:bg-green-700"
                @click="signUp.mutate({ email, password, name: 'User' })"
              >
                <span v-if="signUp.isLoading.value">Signing Up...</span>
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
            <p class="text-gray-600 mt-2 dark:text-gray-400">
              {{ publicContent }}
            </p>
            <p class="text-gray-600 mt-2 dark:text-gray-400">
              {{ privateContent }}
            </p>
          </div>

          <div class="text-sm text-gray-800 mb-6 p-4 text-left rounded-lg bg-gray-50 space-y-2 dark:text-gray-100 dark:bg-gray-900">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris faucibus, justo at cursus dictum, urna eros volutpat massa, ac pharetra ex nibh eget augue.</p>
            <p>Donec sodales erat ac nisi tristique, at hendrerit purus suscipit. Pellentesque sed faucibus justo. Cras congue convallis elit, id posuere tortor.</p>
            <p>Maecenas euismod nibh sed dictum commodo. Fusce aliquam, turpis quis imperdiet bibendum, dolor turpis faucibus velit, et faucibus est justo ac erat.</p>
            <p>Aenean malesuada volutpat orci, in varius dolor. Duis in tortor vitae enim feugiat cursus. Sed ultricies magna in enim dictum, ac eleifend erat cursus.</p>
            <p>Vestibulum ut ante ac erat feugiat blandit. Suspendisse eu feugiat libero, vitae pretium nisl. Etiam ac quam leo. Proin porttitor nec arcu vitae cursus.</p>
            <p>Curabitur sagittis, odio nec facilisis finibus, diam nisi imperdiet sapien, in dapibus orci urna at ligula. Pellentesque blandit faucibus fermentum.</p>
            <p>Sed dictum urna at ligula convallis rhoncus. Etiam sit amet velit at urna accumsan rhoncus. Morbi facilisis augue quis est cursus dictum.</p>
            <p>Nam sed massa posuere, posuere ipsum sit amet, finibus erat. Mauris at maximus ligula, quis molestie nibh. Sed nec risus eleifend, dictum erat a, mattis risus.</p>
            <p>Morbi quis sollicitudin ipsum, vel pretium nulla. Etiam maximus euismod tortor a suscipit. In ut feugiat lectus, a posuere purus.</p>
            <p>Phasellus purus nisl, dignissim non dui at, cursus ornare velit. Sed porttitor velit sit amet lacus laoreet, vitae hendrerit risus cursus.</p>
            <p>Cras posuere, velit nec cursus ullamcorper, turpis nisi gravida ligula, non dictum lacus erat at dolor. Maecenas accumsan lectus at ligula hendrerit dictum.</p>
            <p>Phasellus non nulla ac neque pretium dictum. Nullam fermentum scelerisque leo, nec viverra tellus malesuada eu.</p>
            <p>Mauris nec metus tortor. Praesent facilisis magna in erat malesuada, sed dictum ipsum dictum. Duis euismod dui eget eleifend pharetra.</p>
            <p>Aenean pulvinar, nunc at ultricies imperdiet, dolor lacus facilisis lacus, a dignissim arcu sem vitae massa. Aenean soldales sapien eu orci finibus, ac pulvinar nisi laoreet.</p>
            <p>Duis a magna metus. Fusce eleifend consequat leo in feugiat. Nam sit amet volutpat lectus.</p>
            <p>Integer vitae neque bibendum, dictum justo a, faucibus ex. Aliquam erat volutpat. Etiam ullamcorper erat in ex efficitur gravida.</p>
            <p>Pellentesque et lacus facilisis, luctus orci at, aliquet nisi. Morbi maximus, sapien nec imperdiet scelerisque, ex sem congue nunc, eu cursus velit lectus ac nulla.</p>
            <p>Morbi rhoncus elit et tortor posuere, a sodales dolor pellentesque. Quisque condimentum massa nec velit fermentum, nec consectetur mauris volutpat.</p>
            <p>Maecenas ipsum mauris, sodales eu commodo eu, ullamcorper sed ipsum. Suspendisse commodo nisi nisl, ac porta justo pharetra vitae.</p>
            <p>Fusce elementum nisl nisi, at laoreet nunc accumsan at. Praesent sed magna non augue hendrerit accumsan.</p>
            <p>Curabitur fermentum dolor ac nisi ullamcorper tempor. Etiam feugiat porta dapibus. Vivamus feugiat id nulla id egestas.</p>
            <p>Nam laoreet magna sem, eu tincidunt massa gravida at. Sed varius elementum facilisis.</p>
            <p>Pellentesque tempor volutpat tortor, at laoreet lacus bibendum id. Proin porta mollis lacus, vitae ullamcorper augue mattis a.</p>
            <p>Praesent pulvinar amet dapibus rhoncus. Ut convallis magna vitae sem viverra, sed ultricies massa bibendum.</p>
            <p>Etiam a turpis mauris. Proin efficitur nisi ac augue consequat, nec bibendum magna dictum.</p>
            <p>Sed mollis posuere molestie. Quisque vitae mauris id metus cursus maximus sit amet sit amet arcu.</p>
            <p>Aliquam rutrum interdum varius. Vivamus dictum volutpat nunc, id cursus nulla sodales eget.</p>
            <p>Morbi gravida dictum enim, eget sagittis dolor eleifend in. In ut nisi porttitor, aliquet massa at, porttitor urna.</p>
            <p>Aliquam erat volutpat. Nulla facilisi. Phasellus malesuada, arcu eu gravida auctor, turpis velit maximus dui, ultrices dictum lacus risus ut urna.</p>
            <p>Curabitur sapien mi, fermentum nec convallis nec, pharetra sit amet justo. Etiam tincidunt ex nec lectus pulvinar, ut dictum velit rutrum.</p>
          </div>

          <button
            :disabled="signOut.isLoading.value"
            class="text-white font-medium px-4 py-2 rounded-md bg-red-600 w-full transition-colors duration-200 disabled:bg-red-400 hover:bg-red-700"
            @click="signOut.mutate({})"
          >
            <span v-if="signOut.isLoading.value">Signing Out...</span>
            <span v-else>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
