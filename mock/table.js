import Mock from 'mockjs'

const data = Mock.mock({
  'list|30': [{
    id: '@id',
    code:'@id',
    label: '@ctitle',
    title:'@ctitle',
    value:'@ctitle',
    name: '@ctitle',
    "no|+1": 1,
    level:'@integer(1, 20)',
    upper:'@ctitle',
    remark: '@cparagraph(0,5)',
    'status|1': ['1', '0'],
    addTime: '@datetime',
    tel:"18000000000",
    phone:"025-00000000",
    email:"@email",
    fileName:"@url",
    role:"@ctitle,@ctitle",
    description: '@cparagraph(0,5)'
  }]
})

const treeData = Mock.mock({
  'list|5': [{
    id: '@id',
    key: '@id',
    title:'@ctitle',
    "value|+1": 1,
    "key|+1": 1,
    label: '@ctitle',
    name: '@ctitle',
    level:'@integer(1, 20)',
    upper:'@ctitle',
    remark: '@cparagraph(0,5)',
    description: '@cparagraph(0,5)',
    'children|3':[
     {
        id: '@id',
        key: '@id',
        label: '@ctitle',
        name: '@ctitle',
        level:'@integer(1, 20)',
        upper:'@ctitle',
        title:'@ctitle',
        "value|+1": 10,
        "key|+1": 10,
        remark: '@cparagraph',
        description: '@cparagraph(0,5)'
     }
    ] 
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      let {pageNum,pageSize} = config.query;
      pageNum =pageNum || 1;
      pageSize= pageSize || 100;
      const startIndex= (pageNum-1)*pageSize;
      const endIndex=startIndex+pageSize*1;
      const curList = data.list.slice(startIndex,endIndex);

      return {
        total: data.list.length,
        list: curList
      }
    }
  },
  {
    url: '/tree/list',
    type: 'get',
    response: config => {
      return treeData.list
    }
  },
  {
    url: '/table/list',
    type: 'post',
    response: config => {
      return true
    }
  },
  {
    url: '/table/list',
    type: 'delete',
    response: config => {
      return true
    }
  },
  {
    url: '/table/list',
    type: 'put',
    response: config => {
      return true
    }
  },
  {
    url: '/table/list',
    type: 'patch',
    response: config => {
      return true
    }
  }
]
