<template>
  <div>
    <Heading title="Explore" />
    <Banner />
    <div class="container">
      <!-- <div class="flex flex-wrap">
        <div class="w-1/2" v-for="p in products" :key="p._id">
          <Product :p="p" class />
        </div>
      </div>-->
      <Categories />
      <div class="flex flex-wrap">
        <div class="w-full" v-for="p in products" :key="p._id">
          <ListCard :p="p" class />
        </div>
      </div>
    </div>
    <StickyFooter />
  </div>
</template>

<script>
import {
  Heading,
  Header,
  Banner,
  Product,
  ListCard,
  Categories,
} from '~/shared/components'
import StickyFooter from '~/components/StickyFooter'

export default {
  data() {
    return {
      products: [],
    }
  },
  async created() {
    try {
      const p = await this.$axios.$get('api/foods')
      this.products = p.data
    } catch (e) {
      this.products = []
    }
  },
  components: {
    Heading,
    Header,
    Banner,
    Product,
    Categories,
    ListCard,
    StickyFooter,
  },
}
</script>
