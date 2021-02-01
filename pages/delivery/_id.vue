<template>
  <div>
    <nuxt-link to="/delivery">
      <ArrowLeftIcon />
    </nuxt-link>
    <h3>Payment Details</h3>
    <ApolloQuery
      :query="require('~/../shared/gql/order/order.gql')"
      :variables="{ id: $route.params.id }"
      :update="(data) => data.order"
    >
      <template v-slot="{ result: { error, data }, isLoading }">
        <div v-if="isLoading">Loading........</div>
        <ErrComponent v-else-if="error" :error="error" />
        <div v-else-if="data">
          <div class="flex justify-between">
            <div>{{ data.payment.method }}</div>
            <div class="text-2xl text-green-500">
              {{
                (data.payment.amount / 100) | currency(settings.currency_symbol)
              }}
            </div>
            <div>{{ data.payment.status }}</div>
          </div>
          <div
            v-if="data.payment.status == 'captured'"
            class="flex justify-between"
          >
            <div>
              {{
                (data.payment.amount / 100) | currency(settings.currency_symbol)
              }}
            </div>
            <div class="flex">
              <Textbox v-model="data.cod_paid" label="COD Paid" />
              <button
                @click="collectPayment(data.id, data.cod_paid)"
                class="px-4 py-2 primary"
              >
                Save
              </button>
            </div>
            <div>
              Balance:
              {{
                (data.payment.amount / 100 - +data.cod_paid)
                  | currency(settings.currency_symbol)
              }}
            </div>
          </div>
          <div v-if="data.address">
            Name: {{ data.address.firstName }} {{ data.address.lastName }}
          </div>
          <div>Phone: {{ data.user.phone }}</div>
          <div v-if="data.address">Address: {{ data.address.address }}</div>

          <h3>Order Details</h3>
          <div>Date: {{ data.orderNo }}</div>
          <div>Date: {{ data.createdAt | date }}</div>
          <h3>Item Details</h3>
          <div v-for="i in data.items" :key="i.pid">
            <img v-lazy="i.img" />
            <div>Item: {{ i.name }}</div>
            <div>Delivery Time: {{ i.time }}</div>
            <div>Status: {{ i.status }}</div>
            <div>
              {{ i.price | currency(settings.currency_symbol) }}*{{ i.qty }} =
              {{ (i.price * i.qty) | currency(settings.currency_symbol) }}
            </div>
            <h3>Chef Details</h3>
            <div v-if="i.vendor">
              {{ i.vendor.phone }}
              {{ i.vendor.firstName }} {{ i.vendor.lastName }}
              {{ i.vendor.restaurant }}
              {{ i.vendor.address && i.vendor.address.address }}
            </div>
            <div class="flex flex-center">
              <select
                v-model="i.status"
                class="px-4"
                @change="save(data.id, i.pid, i.status)"
              >
                <option
                  v-for="(s, ix) in $store.state.settings.orderStatuses"
                  :key="ix"
                  >{{ s }}</option
                >
              </select>
              <!-- <button
                class="button"
                v-if="i.status == 'Waiting for confirmation'"
                @click="save(data.id, i.pid, 'Delivered')"
              >
                <span class="fonttype grn">Delivered</span>
              </button>
              <button
                class="mx-4 my-2 text-secondary"
                v-if="i.status !== 'Cancelled'"
                @click="save(data.id, i.pid, 'Cancelled')"
              >
                <span class>Cancelled</span>
              </button>
              <button
                v-if="i.status == 'Delivered'"
                class="button"
                @click="save(data.id, i.pid, 'Waiting for confirmation')"
              >
                <span class="fonttype grn">Returned</span>
              </button>
              <button
                v-if="i.status == 'Cancelled'"
                class="button"
                @click="save(data.id, i.pid, 'Waiting for confirmation')"
              >
                <span class="fonttype grn">Put Back</span>
              </button>
              <div v-if="i.status == 'Out For Delivery'">
                <button class="button" @click="save(data.id, i.pid, 'Delivered')">
                  <span class="fonttype grn">Delivered</span>
                </button>
                <button class="button" @click="save(data.id, i.pid, 'Prepared')">
                  <span class="fonttype grn">Put Back</span>
                </button>
              </div>-->
            </div>
          </div>
        </div>
      </template>
    </ApolloQuery>
    <StickyFooter />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
const StickyFooter = () => import('~/components/StickyFooter')
import { Textbox } from '~/../shared/components/ui'
import { Heading } from '~/../shared/components'
// import order from '~/../shared/gql/order/order.gql'
import updateOrder from '~/../shared/gql/order/updateOrder.gql'
import collectPayment from '~/../shared/gql/pay/collectPayment.gql'
import { ArrowLeftIcon } from 'vue-feather-icons'
export default {
  middleware: ['isAuth'],
  data() {
    return {
      order: null,
    }
  },
  async created() {
    // this.getData()
  },
  computed: { ...mapGetters({ settings: 'settings' }) },
  methods: {
    // async getData() {
    //   try {
    //     const id = this.$route.params.id
    //     this.$store.commit('clearErr')
    //     this.order = (
    //       await this.$apollo.query({
    //         query: order,
    //         variables: { id },
    //         fetchPolicy: 'no-cache'
    //       })
    //     ).data.order
    //   } catch (e) {
    //     this.$store.commit('setErr', e)
    //   } finally {
    //     this.$store.commit('busy', false)
    //   }
    // },
    async save(id, pid, status) {
      try {
        this.$store.commit('clearErr')
        await this.$apollo.mutate({
          mutation: updateOrder,
          variables: { id, pid, status },
          fetchPolicy: 'no-cache',
        })
        // this.getData()
      } catch (e) {
        this.$store.commit('setErr', e, { root: true })
      } finally {
        this.$store.commit('busy', false)
      }
    },
    async collectPayment(id, cod_paid) {
      try {
        this.$store.commit('clearErr')
        await this.$apollo.mutate({
          mutation: collectPayment,
          variables: { id, cod_paid: +cod_paid },
          fetchPolicy: 'no-cache',
        })
        // this.getData()
      } catch (e) {
        this.$store.commit('setErr', e, { root: true })
      } finally {
        this.$store.commit('busy', false)
      }
    },
  },
  components: { StickyFooter, Textbox, Heading, ArrowLeftIcon },
}
</script>
<style scoped>
h3 {
  @apply text-3xl;
}
.button {
  margin-top: 20px;
  width: 100%;
  text-transform: initial;
  color: #fff;
  background: linear-gradient(87deg, #fb6340 0, #da1c5f 100%) !important;
  border-color: #fb6340;
  -webkit-box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
    0 1px 3px rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 100%;
  display: block;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
  padding: 7px;
  outline: none;
}
</style>
