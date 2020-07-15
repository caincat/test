import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/token',
    method: 'post',
    data
  })
}

//续期
export function renewal() {
  return request({
    url: '/token',
    method: 'patch'
  })
}

//退出
export function logout() {
  return request({
    url: '/token',
    method: 'delete'
  })
}

export function getMenus() {
  return request({
    url: '/menus/self?nature=1',
    method: 'get',
  })
}

