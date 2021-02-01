<template>
  <div>
    <div class="py-3 text-xl font-bold text-center bg-white" v-if="loading">
      Searching Order
    </div>
    <h1 class="py-3 text-xl font-bold text-center bg-white" v-else-if="!order">
      Order Not Found
    </h1>
    <div v-else>
      <Heading title="Success" />
      <div class="px-8 text-lg tracking-wider">
        <!-- <div class="flex justify-center py-6">
        <img v-lazy="`seattle.jpg`" class="w-40 h-40 rounded-full" />
        </div>-->
        <div
          v-for="(s, ix) in status"
          :key="ix"
          class="flex items-center py-2 text-gray-500"
          :class="{ 'text-green-500': index == ix }"
        >
          <div class="bg-green-500 list-avatar" v-if="index === ix">oo</div>
          <div class="bg-red-500 list-avatar" v-else-if="index > ix">_/</div>
          <div class="bg-gray-500 list-avatar" v-else>{{ ix + 1 }}</div>
          <CheckIcon />
          {{ s }}
        </div>
      </div>
      <div class="py-2 text-center">
        <nuxt-link
          to="/live"
          class="inline-block px-8 py-2 mt-8 mb-2 text-white bg-orange-500 rounded-full"
          >Order more</nuxt-link
        >
        <button @click="refresh()" class="px-4 py-2 border rounded-full">
          <RefreshCcwIcon /> Refresh
        </button>
      </div>
      <!-- <nuxt-link to="/orders" class="block mt-2 mb-10 text-gray-500"
      >Go to orders</nuxt-link
      >-->
    </div>
    <div>
      <HereMap
        ref="map"
        lat="18.732447"
        lng="82.829516"
        width="100"
        height="300px"
      />
    </div>
  </div>
</template>
<script>
import { Heading, HereMap } from '~/../shared/components'
import { CheckIcon, RefreshCcwIcon } from 'vue-feather-icons'
export default {
  components: { Heading, HereMap, CheckIcon, RefreshCcwIcon },
  data() {
    return {
      order: null,
      loading: false,
      index: -1,
      status: [
        'Waiting for confirmation',
        'Food is being prerared',
        'Out for delivery',
        'Delivered',
      ],
    }
  },
  computed: {},
  methods: {
    async refresh() {
      try {
        this.loading = true
        this.order = await this.$axios.$get(
          `api/food-orders/${this.$route.query.id}`
        )
        this.index = this.status.indexOf(this.order.status)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
  },
  async mounted() {
    await this.refresh()
    try {
      this.$refs.map.route(
        `${this.order.delivery.start.lat},${this.order.delivery.start.lng}`,
        `${this.order.delivery.finish.lat},${this.order.delivery.finish.lng}`
      )
    } catch (e) {
    } finally {
      this.loading = false
    }
    // this.$refs.map.route(`18.732447,82.829516`, `18.708187,82.852198`);
  },
}
</script>
