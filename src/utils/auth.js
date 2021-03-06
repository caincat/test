import Cookies from 'js-cookie'

const TokenKey = 'z-token' //token

const UserNameKey = 'user-name' //用户名

const UserIdKey = 'user-id' //用户id

const UserRoleKey="user-role" //用户角色

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function setUserName(name) {
  return Cookies.set(UserNameKey, name)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(name) {
  return Cookies.set(UserIdKey, name)
}

export function getUserRole() {
  return Cookies.get(UserRoleKey)
}

export function setUserRole(role) {
  return Cookies.set(UserRoleKey, role)
}
