<template>
  <navWrap>
    <template v-slot:head>
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb class="breadcrumb-container" />
    </template>
    <template v-slot:dropdownItem>
      <el-dropdown-item divided>
        <span style="display:block;" @click="$emit('updatePassword')">修改密码</span>
      </el-dropdown-item>
    </template>
  </navWrap>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import NavWrap from '@/layout/components/NavWrap'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    NavWrap
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
