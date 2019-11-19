import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'
import { resolve } from 'q'

Vue.use(Vuex)
const qs = require('querystring')
export default new Vuex.Store({
  state: {
    loginUser: Cookies.get('loginUser'),
    token: Cookies.get('token'),
    addProduct:{},
    addSomain:{},
    isAddorUpdate:''
  },
  mutations: {
    setLogin(state, payload) {
      state.loginUser = payload
    },
    setToken(state, payload) {
      state.token = payload
    },
    addDetail(state, payload){
      state.addProduct=payload
      state.isAddorUpdate='update'
    },
    reset(state, payload){
      state.addProduct=payload
      state.isAddorUpdate='add'
    },
    addSoDetail(state, payload){
      state.addSomain=payload
      state.isAddorUpdate='update'
    },
    resetSo(state, payload){
      state.addSomain=payload
      state.isAddorUpdate='add'
    },

   
  },
  actions: {

    login({commit},payload){
      return new Promise((resolve,reject)=>{
        axios({
          url:'api/sys/login',
          method:'post',
          data:qs.stringify(payload)
        }).then(resp=>{
          console.log(resp);
          let result=resp.data;
          if(result.code==2){
            commit('setLogin', result.data.user.name)
            commit('setToken', result.data.token)
            Cookies.set('loginUser', result.data.user.account)
            Cookies.set('token', result.data.token)
            resolve(result.data)
          }else{
            reject(result.message)
          }
          
        }).catch(error => {
          console.log(error);
          reject(error)
      })
      })

    }
  },
  
})
