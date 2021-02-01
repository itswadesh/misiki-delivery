<template>
  <div class="bg-white">
    <h1 v-if="!product">Not found</h1>
    <div v-else class="relative">
      <div
        class="absolute z-10 flex items-center justify-between w-full px-4 py-3 sm:p-0"
      >
        <button
          @click="$router.go(-1)"
          class="absolute left-0 w-10 h-10 mt-1 text-center rounded-full px-auto py-auto"
        >
          <ArrowLeftIcon class="text-white" />
        </button>
        <nuxt-link
          to="/search"
          class="absolute right-0 w-10 h-10 mt-3 text-center rounded-full px-auto py-auto"
        >
          <SearchIcon class="text-white" />
        </nuxt-link>
      </div>
      <div
        v-lazy:background-image="`${product.img}`"
        class="relative flex justify-center h-48 bg-contain"
      >
        <div
          class="absolute bottom-0 w-3/4 py-2 text-xl font-bold text-center text-white bg-black"
          style="background-color: rgba(0, 0, 0, 0.5);"
        >
          <!-- <div class="text-white opacity-100"></div> -->
          {{ product.restaurant }}
        </div>
      </div>

      <!-- <img v-lazy="`${product.img}`" alt class="object-cover w-full h-48 mb-2" /> -->
      <div class="z-10 px-4 rounded-t-lg">
        <div class="py-5">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <img
              v-lazy="product.type === 'V' ? 'veg.png' : 'non-veg.png'"
              class="w-5"
            />
            <div><TrendingUpIcon /> 33min</div>
            <div><MapPinIcon /> 27kms</div>
            By {{ product.restaurant }}
            <div v-if="product.stock < 6">Only {{ product.stock }} left</div>
          </div>
          <h1 class="text-xl font-bold">{{ product.name }}</h1>
          <!-- <div class="flex items-center justify-between mt-4 text-sm">
            <div class="px-3 text-white bg-orange-500 rounded-full">free delivery</div>
            <div class="text-gray-600">
              <fa icon="history" /> 33min
            </div>
            <div class="text-gray-600">
              <fa icon="map-marker" /> 27kms
            </div>
          </div>-->
        </div>
        <div class="flex justify-between">
          <!-- <div class="flex">
            <fa icon="star" class="h-10 px-2 py-3 text-white bg-yellow-500 rounded-full "/>
            <div class="mx-3 leading-tight">
              <div class="font-bold">{{ product.rating }}</div>
              <div class="font-semibold text-gray-500">Ratings</div>
            </div>
          </div>-->
          <h2 class="text-2xl font-bold">
            {{ product.rate | currency(settings.currency_symbol) }}
          </h2>
        </div>
        <div class="px-5 pb-3 text-xs font-semibold">
          {{ product.description }}
        </div>
      </div>
      <hr class="mb-4" />
      <div v-if="product.vendor">
        <h3 class="px-3 text-2xl font-bold">About Mom</h3>
        <div class="flex p-6 mb-6 bg-gray-100 rounded-lg">
          <img
            class="w-24 h-24 mx-0 mr-6 rounded-full"
            v-lazy="`https://randomuser.me/api/portraits/women/17.jpg`"
          />
          <div class="text-left">
            <h2 class="text-lg">
              {{ product.vendor.firstName }} {{ product.vendor.lastName }}
            </h2>
            <div class="text-xs tracking-wide text-gray-600">
              <MapPinIcon />
              {{ product.vendor.city }}
            </div>
            <div class="text-sm text-green-500">
              <StarIcon />
              {{ product.vendor.rating }} 120 reviews
            </div>
            <div class="text-gray-600" v-if="product.vendor.info">
              {{ product.vendor.info.speciality }}
            </div>
          </div>
        </div>
        <h3 class="px-3 text-2xl font-bold">Mom's Today's Menu</h3>
        <div class="flex flex-wrap px-2 py-3 mb-4">
          <div class="w-1/3 px-2">
            <img
              v-lazy="`/seattle.jpg`"
              class="object-contain rounded-lg shadow"
            />
          </div>
          <div class="w-1/3 px-2">
            <img
              v-lazy="`/seattle.jpg`"
              class="object-contain rounded-lg shadow"
            />
          </div>
          <div class="w-1/3 px-2">
            <img
              v-lazy="`/seattle.jpg`"
              class="object-contain rounded-lg shadow"
            />
          </div>
        </div>
        <h3 class="px-3 text-2xl font-bold">Kitchen Photos</h3>
        <div class="flex px-2 py-3 mb-4">
          <div class="w-1/3 px-2">
            <img
              v-lazy="`/seattle.jpg`"
              class="object-contain rounded-lg shadow"
            />
          </div>
          <div class="w-1/3 px-2">
            <img
              v-lazy="`/seattle.jpg`"
              class="object-contain rounded-lg shadow"
            />
          </div>
          <div class="w-1/3 px-2">
            <img
              v-lazy="`/seattle.jpg`"
              class="object-contain rounded-lg shadow"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <StickyFooter class /> -->
  </div>
</template>

<script>
import StickyFooter from '~/components/StickyFooter'
import { mapGetters } from 'vuex'
import {
  MapPinIcon,
  ArrowLeftIcon,
  SearchIcon,
  StarIcon,
} from 'vue-feather-icons'
export default {
  components: { StickyFooter, MapPinIcon, ArrowLeftIcon, SearchIcon, StarIcon },
  data() {
    return {
      shake: false,
      product: null,
      userSelectedVariant: null,
    }
  },
  async created() {
    try {
      this.product = await this.$axios.$get(
        `/api/foods/slug/${this.$route.params.slug}`
      )
      this.userSelectedVariant = this.product.variants[0]
    } catch (e) {}
  },
  methods: {
    selectVariant(s) {
      this.userSelectedVariant = s
      this.$emit('variantChanged', s)
      this.selectedImgIndex = 0
    },
  },
  computed: {
    // ...mapGetters({
    //   checkCart: "cart/checkCart"
    // }),
    ...mapGetters({ user: 'auth/user', settings: 'settings' }),
    calculateOffPercent() {
      if (!this.product || !this.product.variants[0]) return 0
      let percent =
        ((this.product.variants[0].mrp - this.product.variants[0].price) *
          100) /
        this.product.variants[0].mrp
      return Math.round(percent)
    },
    calculatePrice() {
      let price = 0
      if (this.product.variants[0].price < this.product.variants[0].mrp) {
        price = this.product.variants[0].price
      } else {
        price = this.product.variants[0].mrp
      }
      return price
    },
  },
}
</script>

<style></style>
