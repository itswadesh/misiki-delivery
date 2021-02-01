<template>
  <div>
    <Header class="noprint" />
    <div class="heading noprint">Today's Orders</div>
    <button @click="printOut()" class="top-0 noprint fab">
      <PrinterIcon />
    </button>
    <div>
      <div class="flex justify-center text-gray-600 noprint" v-if="todayTotal">
        <h2>{{ todayTotal.count }}</h2>
        <h1>{{ todayTotal.total | currency(settings.currency_symbol) }}</h1>
        <div>{{ orders && orders[0] && orders[0].createdAt | date }}</div>
      </div>
      <div v-for="s in todaySummary" :key="s._id" class="text-center noprint">
        <span class="font-bold">
          {{ s._id }} *
          <span class="text-xl text-green-500">{{ s.count }}</span> =
          <span class="text-xl text-red-500">{{
            s.amount | currency(settings.currency_symbol)
          }}</span>
        </span>
      </div>
      <ul class="flex flex-wrap">
        <li
          class="w-full p-4 rounded shadow-2xl lg:w-1/4 xl:w-1/5"
          v-for="(o, ix) in orders"
          :key="ix"
        >
          <h1 class="text-3xl font-black text-red-500">
            QrNo: {{ o.address.qrno }}
          </h1>
          <p class="font-bold">
            {{ o.address.firstName }} {{ o.address.lastName }} ({{
              o.uid.phone
            }})
          </p>
          <ul v-if="o.items">
            <ol class="flex flex-col" v-for="(i, ix) in o.items" :key="i._id">
              <div class="flex">
                <div
                  class="flex items-center justify-center w-8 h-8 mr-2 font-bold text-center align-middle bg-gray-300 rounded-full shadow-xl"
                >
                  {{ ix + 1 }}
                </div>
                <div class>
                  {{ i.name }}
                  <div>
                    {{ i.rate | currency(settings.currency_symbol) }} *
                    {{ i.qty }} =
                    <span class="text-3xl font-bold">{{
                      i.amount | currency(settings.currency_symbol)
                    }}</span>
                  </div>
                </div>
              </div>
            </ol>
          </ul>
          <!-- <h3 v-if="o.vendor" class="tracking-wide text-right">{{ o.vendor.restaurant }}</h3> -->
          <div class="text-xs text-right text-cyan-500">
            {{ o.createdAt | date }}
          </div>
        </li>
      </ul>
    </div>
    <StickyFooter />
    <!-- <nuxt-link to="/my/food/customers/old/" class="noprint">Old Customers</nuxt-link> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Header } from '~/../shared/components'
const StickyFooter = () => import('~/components/StickyFooter')
import myCustomers from '~/../shared/gql/order/myCustomers.gql'
import myToday from '~/../shared/gql/order/myToday.gql'
import todaysSummary from '~/../shared/gql/order/todaysSummary.gql'
import updateOrder from '~/../shared/gql/order/updateOrder.gql'
import { infiniteScroll } from '~/../shared/mixins'
import { PrinterIcon } from 'vue-feather-icons'
export default {
  middleware: 'isAuth',
  mixins: [infiniteScroll],
  data() {
    return {
      orders: null,
      todayTotal: null,
      todaySummary: null,
      model: myCustomers,
      attr: 'myCustomers',
    }
  },
  computed: { ...mapGetters({ settings: 'settings' }) },
  async created() {
    try {
      this.$store.commit('clearErr')
      this.todayTotal = (
        await this.$apollo.query({ query: myToday, variables: {} })
      ).data.myToday
      this.todaySummary = (
        await this.$apollo.query({ query: todaysSummary, variables: {} })
      ).data.todaysSummary
      this.orders = (
        await this.$apollo.query({ query: myCustomers, variables: {} })
      ).data.myCustomers.data
    } finally {
      this.$store.commit('busy', false)
    }
  },
  mounted() {
    this.getData() // Creates server rendering issue unless placed here
  },
  components: { Header, StickyFooter, PrinterIcon },
  methods: {
    printOut() {
      if (process.client) {
        window.print()
      }
    },
    async save(o) {
      try {
        this.$store.commit('clearErr')
        this.orders = (
          await this.$apollo.mutate({
            mutation: updateOrder,
            variables: { id: o.id, status: o.status },
          })
        ).data.updateOrder
      } catch (e) {
        this.$store.commit('setErr', e, { root: true })
      } finally {
        this.$store.commit('busy', false)
      }
    },
    go(url) {
      this.$router.push(url)
    },
  },
}
</script>

<style scoped>
.heading {
  text-align: center;
  color: #fff;
  background: linear-gradient(87deg, #fb6340 0, #da1c5f 100%) !important;
  box-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.175) !important;
  margin-bottom: 0.5rem;
  padding: 1rem 0;
  font-size: 2rem;
}
p {
  margin-bottom: 0.8rem !important;
}
.g {
  color: green;
}
.r {
  color: red;
}
.big {
  font-weight: 700;
  font-size: 2rem;
}
h1 {
  margin: 0px 0px 10px 0px;
}
ul > li {
  list-style: none;
  margin: 10px;
  padding: 10px;
  /* border-bottom: 1px solid grey; */
}
.card {
  padding: 1rem;
  margin: 1rem;
  -webkit-box-shadow: 0 -0.1rem 1.1rem rgba(0, 0, 0, 0.175) !important;
  box-shadow: 0 -0.1rem 1.1rem rgba(0, 0, 0, 0.175) !important;
  border-radius: 0.5rem;
  width: 330px;
}
.p-left {
  padding-left: 0px;
}
.font {
  padding-left: 1rem;
}
.seller {
  font-size: 1.4rem;
}
.customer {
  padding: 1rem;
  font-size: 1.2rem;
  color: blue;
  font-weight: 500;
}
.font {
  font-size: 0.7rem;
  padding-left: 0.5rem !important;
  font-weight: 900;
}
</style>
