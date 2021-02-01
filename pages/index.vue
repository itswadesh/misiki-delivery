<template>
  <div>
    <div class="min-h-screen">
      <Heading title="Welcome to misiki" />
      <ApolloQuery
        :query="require('~/../shared/gql/order/deliverySummary.gql')"
        class="flex items-center justify-center w-full p-2 bg-blue-100"
      >
        <template v-slot="{ result: { error, data }, query, isLoading }">
          <div v-if="isLoading">Loading........</div>
          <ErrComponent v-else-if="error" :error="error" />
          <div v-else-if="data" class="w-full">
            <button class="fab" icon dark @click="query.refetch()">
              <RefreshCcwIcon />
            </button>
            <div
              class="flex text-gray-900 bg-white rounded shadow-md h-60 card"
            >
              <div class="flex flex-col w-full">
                <div class="flex-1 p-4 pb-0">
                  <h3 class="mb-1 text-xl font-thin text-gray-800">
                    Total Till Date |
                    <span class="text-sm">Total COD Collected</span>
                  </h3>
                  <div class="flex items-center mb-4 text-xs">
                    <MapPinIcon class="mr-1 text-grey-dark" />
                    <div class="mr-8 text-sm">
                      COUNT: {{ data.allOrderSummary.count }}
                    </div>
                    <div>
                      Last Order: {{ data.allOrderSummary.createdAt | date }}
                    </div>
                  </div>
                  <span class="text-5xl font-bold text-gray-900">
                    {{
                      data.allOrderSummary.amount
                        | currency(settings.currency_symbol)
                    }}
                    <span class="text-sm">total amount</span>
                  </span>
                  <span
                    v-if="data.allOrderSummary.cod_paid"
                    class="text-5xl font-bold text-gray-900"
                  >
                    {{
                      data.allOrderSummary.cod_paid
                        | currency(settings.currency_symbol)
                    }}
                    <span class="text-sm">cod collected</span>
                  </span>
                </div>
                <nuxt-link
                  to="/pickup"
                  class="flex items-center justify-between p-3 transition bg-gray-100 hover:bg-gray-200"
                >
                  View All
                  <ChevronRightIcon />
                </nuxt-link>
              </div>
            </div>
            <div
              class="flex w-full mt-4 text-gray-900 bg-white rounded shadow-md h-60 card"
              v-for="s in data.todaysStatusSummary"
              :key="s._id"
            >
              <div class="flex flex-col w-full">
                <div class="flex-1 p-4 pb-0">
                  <h3 class="mb-1 text-xl font-thin text-gray-800">
                    {{ s._id }}
                  </h3>
                  <div class="flex items-center mb-4 text-xs">
                    <MapPinIcon class="mr-1 text-grey-dark" />
                    <div class="mr-8 text-sm">COUNT: {{ s.count }}</div>
                    <div>Last Order: {{ s.createdAt | date }}</div>
                  </div>
                  <span class="text-5xl font-bold text-gray-900">
                    {{ s.amount | currency(settings.currency_symbol) }}
                    <span class="text-sm">total amount</span>
                  </span>
                </div>
                <nuxt-link
                  to="/delivery"
                  class="flex items-center justify-between p-3 transition bg-gray-100 hover:bg-gray-200"
                >
                  View All
                  <ChevronRightIcon />
                </nuxt-link>
              </div>
            </div>
          </div>
        </template>
      </ApolloQuery>
      <!-- <DeliverySummary :query="require('~/../shared/gql/order/deliverySummary.gql')" /> -->
      <!-- {{todaySummary}}=={{todayTotal}} -->
      <!-- <div v-if="orders">
        <div class="heading" v-if="todaysStatus">
          Today's Pickup - {{ todaysStatus.count }}
          
        </div>
        <div class="fx" v-if="todaysStatus">
          <h1 style="color:blue">{{ todaysStatus.total | currency(settings.currency_symbol) }}</h1>
          <h1 style="color:red">&nbsp;- {{ todaysStatus.total | currency(settings.currency_symbol) }}</h1>
          <h1
            style="color:green"
          >&nbsp; = {{ (todaysStatus.total - todaysStatus.total) | currency(settings.currency_symbol) }}</h1>
        </div>
      </div>-->
    </div>
    <StickyFooter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Heading } from '~/../shared/components'
import StickyFooter from '~/components/StickyFooter'
import DeliverySummary from '~/components/DeliverySummary'
import pendingOrders from '~/../shared/gql/order/pendingOrders.gql'
import myToday from '~/../shared/gql/order/myToday.gql'
import todaysSummary from '~/../shared/gql/order/todaysSummary.gql'
import todaysStatus from '~/../shared/gql/order/delivery.gql'
import updateOrder from '~/../shared/gql/order/updateOrder.gql'
import delivery from '~/../shared/gql/order/delivery.gql'
// import deliveryOrders from '~/../shared/gql/order/deliveryOrders.gql'
import { RefreshCcwIcon, MapPinIcon, ChevronRightIcon } from 'vue-feather-icons'
export default {
  middleware: ['isAuth', 'geo'],
  components: {
    Heading,
    StickyFooter,
    DeliverySummary,
    RefreshCcwIcon,
    MapPinIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      orders: [],
      status: 'Received',
      todayTotal: null,
      todaySummary: null,
      todaysStatus: null,
    }
  },
  computed: { ...mapGetters({ settings: 'settings' }) },
  async mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      // this.$apollo.queries.deliverySummary.refresh()
      // try {
      //   this.$store.commit('clearErr')
      //   this.orders = (
      //     await this.$apollo.query({
      //       query: delivery,
      //       fetchPolicy: 'no-cache'
      //     })
      //   ).data
      //   this.deliveries = (
      //     await this.$apollo.query({
      //       query: deliveryOrders,
      //       variables: { status: this.status },
      //       fetchPolicy: 'no-cache'
      //     })
      //   ).data.deliveryOrders
      // } catch (e) {
      //   this.$store.commit('setErr', e)
      // } finally {
      //   this.$store.commit('busy', false)
      // }
      // try {
      //   this.$store.commit('clearErr')
      //   this.todaysStatus = (
      //     await this.$apollo.query({ query: todaysStatus, variables: {} })
      //   ).data.todaysStatus
      //   this.todayTotal = (
      //     await this.$apollo.query({ query: myToday, variables: {} })
      //   ).data.myToday
      //   this.todaySummary = (
      //     await this.$apollo.query({ query: todaysSummary, variables: {} })
      //   ).data.todaysSummary
      //   this.orders = (
      //     await this.$apollo.query({ query: pendingOrders, variables: {} })
      //   ).data.pendingOrders
      // } finally {
      //   this.$store.commit('busy', false)
      // }
    },
  },
  // async asyncData({ $axios }) {
  //   let orders = [],
  //     status = 'Received',
  //     todayTotal = null,
  //     todaySummary = null
  // try {
  //   // orders = await $axios.$get('api/food-orders/pending')
  //   // todayTotal = await $axios.$get('api/food-orders/my/today')
  //   // todaySummary = await $axios.$get('api/food-orders/todays-summary')
  // } catch (e) {}
  // // return { orders: orders.data, todayTotal, todaySummary }
  // },
}
</script>
