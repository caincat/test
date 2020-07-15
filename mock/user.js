export default [
  // user login
  {
    url: '/token',
    type: 'post',
    response: config => {
      return {
        content: "token",
        usercode: "测试账号",
        role:"1",
        userid:"10000"
      }
    }
  },

  {
    url: '/token',
    type: 'delete',
    response: config => {
      return [
        {
          success:true
        }
      ]
    }
  },

  // get user menu
  {
    url: '/menus/self',
    type: 'get',
    response: config => {
      return [
        {
          key:"1"
        }
      ]
    }
  }
]
