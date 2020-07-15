<template>
  <!--表单验证组件-->
  <ValidationProvider :name="_item.label||'该项'" :rules="($attrs.disabled||$attrs.readonly)?'':_item.rule" v-slot="{ errors }">
    <div :class="['base-form-item','el-form-item',{'is-required':_item.rule && _item.rule.match('required'),'is-error':errors[0]}]">
      <label v-if="_item.label" class="el-form-item__label" v-bind:style="{width:_labelWidth}">{{_item.label}}</label>
      <div class="el-form-item__content" v-bind:style="{'margin-left':_labelWidth}">
        <!--作用域插槽-->
        <slot v-if="_item.slot" :name="_item.slot" :scope="Model" />
        <!--表单组件-->
        <component v-else :is="_item.tag" :placeholder="($attrs.disabled||$attrs.readonly)?'':_item.attrs.placeholder" v-model="Model" v-bind="_item.attrs || {}" v-on="_item.listeners || {}"  @mousewheel.native.prevent></component>
        <!--错误提示-->
        <div v-show="errors[0]" class="el-form-item__error">{{errors[0]}}</div>
      </div>
    </div>
  </ValidationProvider>
</template>

<script>
import basic from "./BASIC";

export default {
  name: "base-form-item",
  props: {
    item: {
      type: Object,
      required: true
    },
    model: {
      default:""
    }
  },
  model: {
    prop: 'model',
    event: 'on-model-change',
  },
  data() {
    return {
      labelWidth: 100,//默认的标签宽度100px
      Model: ""
    };
  },
  computed: {
    _item() {
      return this.computeFormItem(this.item, this.model)
    },
    _labelWidth() {
      let width = 0;
      if (this._item.label) {
        width = this._item.labelWidth || this.$attrs.labelWidth || this.labelWidth
      }
      return width + 'px'
    }
  },
  watch: {
    _item: {
      handler(item) {
        //console.log(item)
        if (item.slot) return;
        if(this.model===0||item.attrs.value===0){
          this.Model=0
        }else{
          this.Model = this.model || item.attrs.value || null
        }
   
        //去掉字符串首尾空格
        if(this.Model && this.Model.constructor==String){
          this.Model =this.Model.trim().replace("","")
        }
        this.handleModelChange();
      },
      immediate: true
    },
    Model:{
      handler(){
        // console.log(this.Model)
        this.handleModelChange();
      },
      deep:true
    }
  },
  methods: {
    //处理表单项
    computeFormItem(item, model) {
      const _item = {
        ...item
      };
      // 表单控件的类型
      let tag = _item.tag || "input";
      // 对应到组件映射表
      let basicItem = basic[tag];
      //初始化attrs属性
      _item.attrs = _item.attrs || {};
      // 处理提示语
      if (!_item.attrs.placeholder) {
        _item.attrs.placeholder = basicItem.attrs.placeholder && `${basicItem.attrs.placeholder}${_item.label || ""}`
      }
      _item.tag = basicItem.component;
      //继承基类的属性
      _item.attrs = Object.assign({}, basicItem.attrs, this.$attrs, _item.attrs);
      //继承事件
      _item.listeners = Object.assign({}, this.$listeners, _item.listeners);
      
      // 获取动态 Attributes
      if (_item.getAttrs) {
        _item.attrs = Object.assign(_item.attrs, _item.getAttrs(model));
      }

      //统一限制不能超过的最大字符数和上传文件大小
      let limitMax = tag === 'textarea' ? 300 : 100
      if (_item.rule) {
        if (tag === 'upload') {
          _item.rule += `|size:1024`
        } else {
          if(_item.rule.indexOf("max:")==-1){
            _item.rule += `|max:${limitMax}`
          }
        }
      } else {
        if (tag === 'upload') {
          _item.rule = `size:1024`
        } else {
          _item.rule = `max:${limitMax}`
        }
      }

      //统一限制日期范围控制的验证规则，开始时间不能大于结束时间
      if (tag === 'daterange') {
        if (_item.rule) {
          _item.rule += `|daterange`
        } else {
          _item.rule = `daterange`
        }
      }

      return _item;
    },
    handleModelChange() {
      this.$emit("on-model-change", this.Model)
    }
  }
};
</script>

<style lang="scss">
.base-form-item {

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .el-form-item__label {
    line-height: 130%;
    height: 40px;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 8px 0 5px;
    font-size: 13px;
  }

  .el-select>.el-input {
    line-height: 100%;
  }

  .el-form-item__error {
    padding-top: 1px;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
}
</style>
