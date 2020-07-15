<template>
<el-select :value="value" @clear="handleClear" v-bind="$attrs" v-on="$listeners" :disabled="$attrs.disabled || $attrs.readonly">
  <el-option ref="el-option" v-show="false" :label="optionLabel" :value="optionValue"></el-option>
  <el-tree ref="el-tree" class="select-tree" :data="treeData" :props="defaultPropsName" :node-key="defaultPropsName.value" highlight-current check-on-click-node :expand-on-click-node="false" default-expand-all @current-change="handleCurrentChange"></el-tree>
</el-select>
</template>

<script>
export default {
  name: "base-tree-select",
  props: {
    value: {
      default: "",
    },
  },
  data() {
    return {
      treeData: [],
      optionLabel: "",
      optionValue: "",
      defaultProps: {
        children: 'children',
        label: 'title',
        value: 'value'
      }
    }
  },
  computed: {
    defaultPropsName() {
      return this.$attrs.defaultProps || this.defaultProps
    }
  },
  watch: {
    "$attrs.api": {
      handler(val) {
        console.log(val);
        this.getTreeData();
      }
    }
  },
  methods: {
    handleCurrentChange(node) {
      this.optionLabel = node[this.defaultPropsName.label];
      this.optionValue = node[this.defaultPropsName.value];
      this.$nextTick(() => {
        this.$refs["el-option"].$el.click()
      })
    },
    handleClear() {
      this.$refs["el-tree"].setCurrentKey(null);
    },
    getTreeData() {
      this.API.get(this.$attrs.api).then(response => {
        this.treeData = response.list || response
        if (this.value) {
          this.$nextTick(() => {
            this.$refs["el-tree"].setCurrentKey(this.value)
            let node = this.$refs["el-tree"].getCurrentNode();
            if (node) {
              this.optionLabel = node[this.defaultPropsName.label];
              this.optionValue = this.value;
            }
          })
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$attrs.api) {
        this.getTreeData();
      }
    })
  }
};
</script>

<style lang="scss">
.select-tree {
  .el-tree-node:focus>.el-tree-node__content {
    background-color: transparent;
  }

  .el-tree-node.is-current:focus>.el-tree-node__content {
    background-color: #f0f7ff;
  }
}
</style>
