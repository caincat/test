<template>
  <section class="app-main ">
    <div class="app-container">
      <el-tabs class="head-tab" type="card" v-model="tabPath" closable @tab-click="tabClick" @edit="handleTabsEdit">
        <el-tab-pane v-for="item in tabRoutes" :key="item.name" :label="item.meta.title" :name="item.path"></el-tab-pane>
        <el-scrollbar class="router-wrap" :class="{'has-tab':tabRoutes.length}">
          <router-view v-if="isRouteAlive" :key="key" />
        </el-scrollbar>
      </el-tabs>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },
  provide() { //vue局部刷新组件，不改变路由的情况下，使页面重新从created开始执行操作
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouteAlive: true,
      tabPath: "", //当前选中的头部菜单
      tabRoutes: [], //头部菜单
    }
  },
  methods: {
    reload() {
      this.isRouteAlive = false
      this.$nextTick(() => {
        this.isRouteAlive = true
      })
    },
    tabClick(tab) { //点击头部菜单
      // console.log(tab)
      this.$router.push({
        path: tab.name
      });
    },
    handleTabsEdit(target, action) { //移除头部菜单
      // console.log(target)
      if (action === "remove") {
        let tabs = this.tabRoutes;
        let activePath = this.tabPath;
        if (activePath === target) {
          tabs.forEach((tab, index) => {
            if (tab.path === target) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activePath = nextTab.path;
                this.$router.push({
                  path: nextTab.path
                })
              }
            }
          });
        }
        this.tabPath = activePath;
        this.tabRoutes = tabs.filter(tab => tab.path !== target);
      }
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.tabPath = val.path;
        if (val.meta.title) { //向头部菜单中加菜单项
          this.tabPath = val.path;
          let hasRoute = this.tabRoutes.some(item => item.path === val.path);
          // console.log(this.tabRoutes)
          if (!hasRoute) {
            this.tabRoutes.push(val);
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 50px); */
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style><style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

.head-tab {
  .el-scrollbar__wrap{
     overflow-x: hidden !important;
  }
  .router-wrap {
    height: calc(100vh - 77px);

    .el-scrollbar__thumb {
      left: 2px;
    }

    &.has-tab {
      height: calc(100vh - 112px);
    }
  }
}
</style>
