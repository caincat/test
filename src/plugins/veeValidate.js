import Vue from 'vue';
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import zh from 'vee-validate/dist/locale/zh_CN';


/*  内置规则

    "alpha": "{_field_}只能包含字母字符",
    "alpha_dash": "{_field_}能够包含字母数字字符、破折号和下划线",
    "alpha_num": "{_field_}只能包含字母数字字符",
    "alpha_spaces": "{_field_}只能包含字母字符和空格",
    "between": "{_field_}必须在{min}与{max}之间",
    "confirmed": "{_field_}不能和{target}匹配",
    "digits": "{_field_}必须是数字，且精确到{length}位数",
    "dimensions": "{_field_}必须在{width}像素与{height}像素之间",
    "email": "{_field_}不是一个有效的邮箱",
    "excluded": "{_field_}不是一个有效值",
    "ext": "{_field_}不是一个有效的文件",
    "image": "{_field_}不是一张有效的图片",
    "oneOf": "{_field_}不是一个有效值",
    "integer": "{_field_}必须是整数",
    "length": "{_field_}长度必须为{length}",
    "max": "{_field_}不能超过{length}个字符",
    "max_value": "{_field_}必须小于或等于{max}",
    "mimes": "{_field_}不是一个有效的文件类型",
    "min": "{_field_}必须至少有{length}个字符",
    "min_value": "{_field_}必须大于或等于{min}",
    "numeric": "{_field_}只能包含数字字符",
    "regex": "{_field_}格式无效",
    "required": "{_field_}是必须的",
    "required_if": "{_field_}是必须的",
    "size": "{_field_}必须小于{size}KB"
*/ 

// loop over all rules
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: rule==='required'?"{_field_}为必填项": zh.messages[rule] // add its message
  });
}

// Add rules
// 手机号
extend('phone', {
  validate: value => value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value),
  message(label){
    return label+'不是正确的手机号码'
  }
});

//正数
extend('amount', {
  validate: value => /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value),
  message(label){
    return label+'必须是正数'
  }
});

//日期范围控件  开始时间不能大于结束时间
extend('daterange', {
  validate(value){
    let rule=true
    if(value[0] && value[1]){
      rule=value[0]<=value[1]
    }
    return rule
  },
  message(){
    return '开始时间不能大于结束时间'
  }
});

// Register it globally
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);