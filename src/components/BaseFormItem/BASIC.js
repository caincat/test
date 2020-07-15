
export default {
  input: {//输入框
    component: "el-input",
    attrs: {
      placeholder:"请输入",
      clearable: true,
      size:"mini"
    }
  },
  select: {
    component: "base-select", //自定义组件,为了在el-select添加options能够生成el-options节点
    attrs: {
      placeholder:"请选择",
      clearable: true,
      size:"mini"
    }
  },
  "table-select": {//表格选择
    component: "base-table-select", //自定义组件
    attrs: {
      placeholder:"请选择",
      clearable: true,
      size:"mini",
      tableColumns:[],
      searchItems: null,
    }
  },
  "tree-select": {//树选择
    component: "base-tree-select", //自定义组件
    attrs: {
      placeholder:"请选择",
      clearable: true,
      size:"mini"
    }
  },
  date: {//日期
    component: "el-date-picker",
    attrs: {
      placeholder:"选择",
      clearable: true,
      type: "date",
      format: "yyyy-MM-dd",
      ["value-format"]: "yyyy-MM-dd HH:mm:ss",
      size:"mini"
    }
  },
  daterange: {//日期范围
    component: "base-daterange",
    attrs: {
      placeholder:"选择",
      clearable: true,
      type: "daterange",
      "start-placeholder":"开始日期",
      "end-placeholder":"结束日期",
      format: "yyyy-MM-dd",
      ["value-format"]: "yyyy-MM-dd HH:mm:ss",
      size:"mini"
    }
  },
  radio: {//单选
    component: "base-radio-group", //自定义组件,为了在el-radio-group添加options能够生成el-radio节点
    value: [],
    attrs: {
      placeholder:"请选择",
      clearable: true,
      size:"mini"
    }
  },
  checkbox: {//多选
    component: "el-checkbox",
    attrs: {
      placeholder:"请勾选",
      size:"mini"
    }
  },
  "checkbox-group": {//多选组
    component: "base-checkbox-group", //同上
    attrs: {
      placeholder:"请勾选",
      size:"mini"
    }
  },
  cascader: {
    component: "el-cascader",
    attrs: {
      clearable: true,
      placeholder:"请选择",
      size:"mini"
    }
  },
  textarea: {//文本框
    component: "el-input",
    attrs: {
      type: "textarea",
      placeholder:"请输入",
      rows:3,
      size:"mini"
    }
  },
  number: {//数字
    component: "el-input",
    attrs:{
      type:'number',
      placeholder:"请输入",
      size:"mini"
    }
  },
  upload:{//上传文件
    component: "base-upload",
    attrs:{
      placeholder:"选取",
      size:"mini"
    }
  },
  time: {//时间
    component: "el-time-picker",
    attrs:{
      placeholder:"选择",
      format: "HH:mm",
      ["value-format"]: "HH:mm",
      size:"mini"
    }
  },
  datetime: {//日期时间
    component: "el-date-picker",
    attrs: {
      placeholder:"选择",
      clearable: true,
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
      ["value-format"]: "yyyy-MM-dd HH:mm:ss",
      size:"mini"
    }
  }
};
