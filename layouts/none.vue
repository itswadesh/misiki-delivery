<template>
  <div class="antialiased min-h-screen">
    <!-- <Loading /> -->
    <!-- <ErrComponent /> -->
    <nuxt />
  </div>
</template>

<script>
import { Error, Header } from '~/shared/components'
import AccountMenu from '~/components/AccountMenu'
import { Loading } from '~/shared/components/ui'

export default {
  components: { Error, Header, AccountMenu, Loading },
}
</script>
