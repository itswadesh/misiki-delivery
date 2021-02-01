<template>
  <div>
    <Header />
    <div
      class="min-h-screen flex flex-wrap justify-center w-full bg-gray-100 pb-5 antialiased"
    >
      <AccountMenu class="hidden md:block" />
      <div class="flex-1">
        <!-- <Loading /> -->
        <nuxt />
      </div>
    </div>
    <StickyFooter />
  </div>
</template>

<script>
import { Error, Header } from '~/../shared/components'
import StickyFooter from '~/components/StickyFooter'
import AccountMenu from '~/components/AccountMenu'
import { Loading } from '~/../shared/components/ui'
export default {
  middleware: ['geo'],
  components: { Error, Header, StickyFooter, AccountMenu, Loading },
}
</script>
