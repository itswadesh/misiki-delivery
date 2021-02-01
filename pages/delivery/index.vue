<template>
  <div>
    <Header />
    <div class="heading">
      Today's Delivery
      <button icon dark @click="getData">
        <RefreshCcwIcon />
      </button>
    </div>
    <div>
      <div class="flex justify-center text-2xl" v-if="orders">
        <h1 class="text-blue-500">
          {{ orders.delivery.all.total | currency(settings.currency_symbol) }}
        </h1>
        <h1 class="text-red-500">
          &nbsp;-
          {{
            orders.delivery.cancelled.total | currency(settings.currency_symbol)
          }}
        </h1>
        <h1 class="text-green-500">
          &nbsp; =
          {{
            (orders.delivery.all.total - orders.delivery.cancelled.total)
              | currency(settings.currency_symbol)
          }}
        </h1>
      </div>
      <div class="flex justify-center">
        <Radio
          v-model="status"
          class="mr-2 text-xs"
          v-for="s in todaysStatusSummary"
          :key="s._id"
          :value="s._id"
          @change="getData"
          >{{ s._id }} ({{ s.count }})</Radio
        >
      </div>
      <div v-if="deliveries">
        <div
          class="flex flex-col justify-between smallcard"
          v-for="f in deliveries.data"
          :key="f._id"
        >
          <div
            class="flex justify-between pt-1 border-b"
            @click="go('/delivery/' + f._id.id)"
          >
            <!-- <div v-if="f._id.vendor">
              <h2 class="text-xl">{{ f._id.vendor.address }}</h2>
              <div class="font-bold">{{ f._id.vendor.phone }}</div>
              <div class="text-gray-800">{{ f._id.vendor.restaurant }}</div>
            </div>-->
            <div v-if="f._id.address">
              {{ f._id.orderNo }} - {{ f._id.createdAt | date }}
              <h1 class="text-xl">{{ f._id.address.address }}</h1>
              <div class="font-bold">{{ f._id.address.phone }}</div>
              <div class="text-gray-800">{{ f._id.address.firstName }}</div>
            </div>
            <div class="text-3xl font-bold text-green-500" v-if="f._id.amount">
              {{ f._id.amount.total | currency(settings.currency_symbol) }}
            </div>
          </div>
          <div
            class="flex justify-between bg-yellow-100"
            v-for="i in f.items"
            :key="i.pid"
          >
            <div>
              {{ i.name }} {{ i.price | currency(settings.currency_symbol) }}*
              {{ i.qty }} =
              {{ (i.price * i.qty) | currency(settings.currency_symbol) }}
              {{ i.time }}
            </div>
            <div>{{ i.vendor.phone }}-{{ i.vendor.restaurant }}</div>
          </div>
        </div>
      </div>
    </div>
    <StickyFooter />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Header } from '~/shared/components'
import { Radio } from '~/shared/components/ui'
const StickyFooter = () => import('~/components/StickyFooter')
import PAYMENT_SUMMARY from '~/gql/order/delivery.gql'
import ordersByStatus from '~/gql/order/ordersByStatus.gql'
import todaysStatusSummary from '~/gql/order/todaysStatusSummary.gql'
import { RefreshCcwIcon } from 'vue-feather-icons'
// import io from "socket.io-client";
// import { WS_URL } from "~/config";
// let socket = io(WS_URL);
// import { SocketService } from "~/service/socket";
// let ss = new SocketService();
export default {
  data() {
    return {
      status: 'Prepared',
      orders: null,
      deliveries: null,
      todaysStatusSummary: null,
    }
  },
  computed: { ...mapGetters({ settings: 'settings' }) },
  created() {
    this.getData()
  },
  components: { Header, Radio, StickyFooter, RefreshCcwIcon },
  methods: {
    go(url) {
      this.$router.push(url)
    },
    async getData() {
      try {
        this.$store.commit('clearErr')
        this.orders = (
          await this.$apollo.query({
            query: PAYMENT_SUMMARY,
            fetchPolicy: 'no-cache',
          })
        ).data
        this.deliveries = (
          await this.$apollo.query({
            query: ordersByStatus,
            variables: { status: this.status },
            fetchPolicy: 'no-cache',
          })
        ).data.ordersByStatus
        this.todaysStatusSummary = (
          await this.$apollo.query({
            query: todaysStatusSummary,
            fetchPolicy: 'no-cache',
          })
        ).data.todaysStatusSummary
      } catch (e) {
        this.$store.commit('setErr', e)
      } finally {
        this.$store.commit('busy', false)
      }
    },
  },
}
</script>

<style scoped>
h1 {
  color: red;
}
h2 {
  color: grey;
}
.fx {
  display: flex;
  justify-content: center;
}
.js-bt {
  justify-content: space-between;
}
.smallcard {
  padding: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
}
.smallFont {
  padding-left: 1rem;
  font-size: 0.7rem;
  padding-left: 0.5rem !important;
  font-weight: 900;
}
.block {
  display: none;
}
.fonttype {
  font-size: 20px;
  font-weight: 500;
}
.pb-1rm {
  padding-bottom: 1rem;
}
.pt-1rem {
  padding-top: 1rem;
}
.grn {
  color: green;
}
.redclr {
  color: red;
}
.blueclr {
  color: royalblue;
}
.border-b {
  border-bottom: 1px solid #c5bfbf;
}
</style>
