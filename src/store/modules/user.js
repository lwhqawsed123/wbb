import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    userType:'',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      
      state.permissions = permissions
      // console.log(permissions,'1231321');
      
    },
    SET_USERTYPE: (state, userType) => {
      state.userType = userType
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          console.log(res);
          // console.log(res.user.userType,'用户类型');
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/image/gr.png") : process.env.VUE_APP_BASE_API + user.avatar;
          
          commit('SET_ROLES', res.roles)
          commit('SET_PERMISSIONS', res.permissions)
          //  if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', res.roles)
          //   commit('SET_PERMISSIONS', res.permissions)
          // } else {
          //   commit('SET_ROLES', ['ROLE_DEFAULT'])
          // }
          // 保存用户类型
          commit('SET_USERTYPE',user.userType)
          commit('SET_NAME', user.username)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
