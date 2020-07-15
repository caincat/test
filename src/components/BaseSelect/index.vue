<template>
  <el-select v-bind="$attrs" :value="value" v-on="$listeners" :disabled="$attrs.disabled || $attrs.readonly">
    <el-option v-for="item in _options" :key="item[defaultPropsName.value]" :label="item[defaultPropsName.label]" :value="item[defaultPropsName.value]" :disabled="item.disabled">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "base-select",
  props: {
    value: {
      default: ""
    }
  },
  data() {
    return {
      options: [],
      defaultProps: {
        label: 'label',
        value: 'value'
      }
    }
  },
  watch: {
    "$attrs.api": {
      handler: function (value) {
        if (value) {
          this.getDataSource()
        }else{
          this.options = []
        }
      },
      immediate: true
    }
  },
  computed: {
    _options() {
      return this.$attrs.options || this.options
    },
    defaultPropsName() {
      return this.$attrs.defaultProps || this.defaultProps
    }
  },
  methods: {
    getDataSource() {
      this.API.get(this.$attrs.api).then(response => {
        if (response.list) {
          this.options = response.list
        } else {
          this.options = response
        }
      })
    }
  }
};
</script>
