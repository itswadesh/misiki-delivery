<template>
  <div
    class="fixed bottom-0 z-10 w-full mt-2 overflow-x-auto text-gray-600 bg-gray-100 border-t shadow-lg"
  >
    <div class="flex items-center justify-around">
      <nuxt-link to="/" class="category-item" active-class="text-primary">
        <SearchIcon />
        <span class="text-xs">Home</span>
      </nuxt-link>
      <nuxt-link to="/pickup" class="category-item" active-class="text-primary">
        <UserIcon />
        <span class="text-xs">Pickup</span>
      </nuxt-link>
      <nuxt-link
        to="/delivery"
        class="category-item"
        active-class="text-primary"
      >
        <TagIcon />
        <span class="text-xs">Delivery</span>
      </nuxt-link>
      <nuxt-link to="/my" class="category-item" active-class="text-primary">
        <ShoppingCartIcon />
        <span class="text-xs">Profile</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import {
  SearchIcon,
  UserIcon,
  TagIcon,
  ShoppingCartIcon,
} from 'vue-feather-icons'
export default {
  components: {
    SearchIcon,
    UserIcon,
    TagIcon,
    ShoppingCartIcon,
  },
}
</script>

<style></style>
