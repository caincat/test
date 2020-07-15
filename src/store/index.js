import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)
const state={//打印公用页面的状态 在form用
  printFbplan:"",//分包
  receivedfyb:"",//入库单
  recedein:"",//退料单
  printAdjust:"",//规格调整单
  subcorpId:"",//分包单位id
  resultSubcorpId:"",//分包单位id分包计划招标
}
const mutations={
  printFbplan(state,data){
      state.printFbplan=data
  },
  receivedfyb(state,data){
    state.receivedfyb=data
  },
  recedein(state,data){
    state.recedein=data
  },
  printAdjust(state,data){
    state.printAdjust=data
  },
  subcorpId(state,data){
    state.subcorpId=data
  },
  resultSubcorpId(state,data){
    state.resultSubcorpId=data
  },
}
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  state,
  mutations
})

export default store
