import { Message, MessageBox, Loading } from 'element-ui';
import api from '@/api'
import Vue from 'vue'

const sha1 = require('js-sha1'); //秒传的Hash处理

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

//提示弹窗
function tip(title, msg, call) {
  MessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    call && call();
  }).catch(() => { });
}

//消息弹窗
function message(type, msg, call) {
  if (document.getElementsByClassName("el-message").length === 0) {
    Message({
      showClose: true,
      message: msg,
      type: type,
      duration: 2000,
      onClose() {
        call && call();
      }
    });
  }
}

//重写JSON方法
function stringify(json) {
  return JSON.stringify(json, function (k, v) {
    if (typeof v === 'function') {
      return v + '';
    }
    return v;
  });
}
function parse(str) {
  return JSON.parse(str, function (k, v) {
    if (v !== null && v.indexOf && v.indexOf('function') > -1) {
      return eval("(function(){return " + v + " })()")
    }
    return v;
  });
}

//深度克隆
function clone(obj) {
  return parse(stringify(obj))
}

//下载文件
function download(data, fileName) {
  if (!data) {
    return
  }
  let url = window.URL.createObjectURL(data);
  let aLink = document.createElement("a");
  aLink.style.display = "none";
  aLink.href = url;
  aLink.setAttribute("download", fileName);
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink); //下载完成移除元素
  window.URL.revokeObjectURL(url); //释放掉blob对象
  message('success', '下载成功！')
}

//调用接口下载文件
function downloadFile(url, fileName) {
  api.get(url, null, {
    responseType: 'blob'
  }).then(response => {
    download(response, fileName)
  })
}

//调用接口上传文件
async function saveFile(hashUploadUrl, uploadUrl, uploadParam, fileRaw,uploadCallBack,event='post') {
  //秒传hash处理
  uploadParam.fileHash = sha1(fileRaw)
  //调用秒传接口
  let hashUpload = await api[event](hashUploadUrl, uploadParam);
  let upload=false;
  //10-文件已存在  20-文件不存在
  if (hashUpload == 20) {
    //若文件不存在，则调用普通上传接口
    let formData = new FormData();
    let fileName = uploadParam.fileName ? 'fileName' : 'fileFullname'
    formData.append(fileName, fileRaw);
    Object.keys(uploadParam).map(key => {
      if (key !== fileName) {
        formData.append(key, uploadParam[key])
      }
    })
    //调用普通上传接口
    upload = await api.post(uploadUrl, formData);
  }

  if (hashUpload != 20 || upload) {
    message('success', '上传成功!')
    uploadCallBack && uploadCallBack();
  }
}

//动态获取路由
function getRouteList(response,asyncRouterMap) {
  let routes = [];
  for (let i=0;i<response.length;i++) {
    let item = response[i];
    let routeList = asyncRouterMap.filter(i => {
      if(i.path === item.action){
        i.meta.title=item.title
      }
      return i.path === item.action
    });
    if (routeList.length > 0) {
      let route = {
        ...routeList[0]
      };
      if (item.children && item.children.length>0) {
        route.children = getRouteList(item.children, routeList[0].children);
      }
      else {
        route.children = [];
      }
      routes.push(route);
    }
  }
  return routes;
}

let loadingInstance;
function loading() {
  let options = {
    fullscreen: false,
    background: 'rgba(0,0,0,0.1)',
    target: '.main-container'
  };
  loadingInstance = Loading.service(options);
}
function endLoading() {
  Vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    loadingInstance.close();
  });
}

function uniq(array) { //数组去重
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}

export default {
  param2Obj,
  tip,
  message,
  clone,
  download,
  downloadFile,
  saveFile,
  getRouteList,
  loading,
  endLoading,
  parseTime,
  uniq
}



