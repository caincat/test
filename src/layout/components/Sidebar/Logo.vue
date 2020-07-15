<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <svg-icon v-if="logo" :icon-class="logo" class="sidebar-logo"/>
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <svg-icon v-if="logo" :icon-class="logo" class="sidebar-logo"/>
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import defaultSettings from "@/settings.js";
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: defaultSettings.title,
      logo: 'logo'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #323C57;
  // text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 25px;
      height: 25px;
      vertical-align: middle;
      margin-left: 16px;
      color: #409EFF;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      line-height: 60px;
      font-size: 20px;
      font-family: STHeiti;
      font-weight: 400;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
