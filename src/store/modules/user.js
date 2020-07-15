import { login, logout, renewal, getMenus } from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  getUserName,
  setUserName,
  setUserId,
  getUserRole,
  setUserRole
} from "@/utils/auth";
import {
  resetRouter,
  asyncRouterMap,
  constantRoutes,
  notFoundRoute,
} from "@/router";
import utils from "@/utils";
import defaultSettings from "@/settings.js";
import router from "@/router";

const state = {
  token: getToken(),
  name: getUserName(),
  routes: null,
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
};

const actions = {
  // user login
  login({ commit }, req) {
    return new Promise((resolve, reject) => {
      login(req)
        .then((response) => {
          commit("SET_TOKEN", response.content);
          commit("SET_NAME", response.usercode);
          setToken(response.content);
          setUserName(response.usercode);
          setUserId(response.userid);
          setUserRole(response.role);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getMenus({ commit, state }) {
    return new Promise((resolve, reject) => {
      //可以根据用户角色分别设置菜单
      // console.log(getUserRole())

      //不从后台获取菜单
      if(!defaultSettings.getMenus){
        const Routes = constantRoutes.concat(asyncRouterMap).concat(notFoundRoute);
        router.addRoutes(Routes); // 动态添加可访问路由表
        commit("SET_ROUTES", Routes);
        resolve();
        return;
      }
      //从后台动态获取菜单
      getMenus(state.token)
        .then((response) => {
          let routes = utils.getRouteList(response, asyncRouterMap);
          let routeList = [asyncRouterMap[0], ...routes];
          const Routes = constantRoutes.concat(routeList).concat(notFoundRoute);
          router.addRoutes(Routes); // 动态添加可访问路由表
          console.log(Routes);
          commit("SET_ROUTES", Routes);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", "");
      commit("SET_ROUTES", null);
      removeToken();
      resetRouter();
      resolve();
    });
  },

  //续期
  renewal({ commit, state }) {
    return new Promise((resolve, reject) => {
      renewal()
        .then((response) => {
          commit("SET_TOKEN", response.content);
          commit("SET_NAME", response.usercode);
          setToken(response.content);
          setUserName(response.usercode);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  setRoutes({ commit }, routes) {
    commit("SET_ROUTES", routes);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
