<template>
  <div>
    <!-- <Banner /> -->
    <div class="container relative">
      <!-- <Categories /> -->
      <nuxt-link class="absolute top-0 right-0 z-10 fab" to="/foods/new">
        <PlusIcon />
      </nuxt-link>
      <div
        class="flex flex-wrap"
        v-infinite-scroll="loadMore"
        :infinite-scroll-distance="3"
        :infinite-scroll-immediate-check="true"
      >
        <content-loader
          v-if="meta.busy"
          :height="100"
          :speed="2"
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
        >
          <rect x="30" y="15" rx="4" ry="4" width="100" height="70" />
          <rect x="140" y="20" rx="4" ry="4" width="100" height="10" />
          <rect x="140" y="40" rx="4" ry="4" width="120" height="8" />
          <rect x="350" y="15" rx="25" ry="25" width="25" height="25" />
          <rect x="340" y="45" rx="4" ry="4" width="50" height="8" />
        </content-loader>
        <div class="w-full" v-for="p in data" :key="p._id">
          <ListCard :p="p" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Heading,
  Banner,
  Product,
  ListCard,
  Categories,
} from '~/../shared/components'
import { ContentLoader } from 'vue-content-loader'
import { Loading } from '~/../shared/components/ui'
import { query, infiniteScroll } from '~/../shared/mixins'
import myProducts from '~/../shared/gql/product/myProducts.gql'
import { PlusIcon } from 'vue-feather-icons'
export default {
  middleware: 'isAuth',
  layout: 'search',
  mixins: [infiniteScroll],
  data() {
    return {
      model: myProducts,
      attr: 'myProducts',
    }
  },
  mounted() {
    this.getData() // Creates server rendering issue unless placed here
  },
  components: {
    Heading,
    PlusIcon,
    Banner,
    Product,
    Categories,
    ListCard,
    Loading,
    ContentLoader,
  },
}
</script>
