import axios from 'axios'


class LSStorage {
  constructor ({ AppName = 'EnjoyCreationStack', TypeName = 'JWT', onRemove = () => {} }) {
    this.AppName = AppName
    this.TypeName = TypeName
    this.onRemove = onRemove
  }
  get value () {
    return this.getLocal()
  }
  set value (v) {
    this.setLocal(v)
  }

  setLocal (value) {
    if (value && value !== 'false' && value !== 'null' && value !== null) {
      localStorage.setItem(this.AppName + this.TypeName, value)
    } else {
      localStorage.removeItem(this.AppName + this.TypeName)
      this.onRemove()
    }
  }
  getLocal () {
    let value = localStorage.getItem(this.AppName + this.TypeName)
    if (!value || value === 'false' || value === 'null') {
      localStorage.removeItem(this.AppName + this.TypeName)
      this.onRemove()
      return false
    } else {
      return value
    }
  }
}

class SDKCore {
  constructor ({ axios }) {
    let AppName = '86DeckPortfolio'
    let onRemove = () => {
      window.dispatchEvent(new Event('app-logout'))
    }
    this.ls = {
      jwt: new LSStorage({ onRemove, AppName, TypeName: '--jwt' }),
      userID: new LSStorage({ onRemove, AppName, TypeName: '--userID' }),
      username: new LSStorage({ onRemove, AppName, TypeName: '--username' })
    }
    this.axios = axios
  }
  get jwt () {
    return this.ls.jwt.value
  }
  get userID () {
    return this.ls.userID.value
  }
  get username () {
    return this.ls.username.value
  }

  getBaseURL () {
    return window.location.origin
  }

  get isLoggedIn () {
    return this.ls.jwt.value
  }
  logout () {
    this.ls.jwt.value = null
    this.ls.userID.value = null
    this.ls.username.value = null
  }
  async getMe () {
    return this.axios({
      url: '/api/cms/user?route=me',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        "action": "me",
        "jwt": this.jwt
      }
    }).then(res => {
      // this.ls.jwt.value = res.data.jwt
      // this.ls.userID.value = res.data.user.userID
      // this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to get myself'
      return Promise.reject(msg)
    })
  }

  async adminChangePassword ({ _id, password }) {
    return this.axios({
      url: '/api/cms/user?route=admin-change-password',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        action: "admin-change-password",
        data: {
          _id,
          password
        },
        jwt: this.jwt
      }
    }).then(res => {
      // this.ls.jwt.value = res.data.jwt
      // this.ls.userID.value = res.data.user.userID
      // this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to get myself'
      return Promise.reject(msg)
    })
  }

  async toggleIsAdmin ({ _id }) {
    return this.axios({
      url: '/api/cms/user?route=toggle-admin',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        action: "toggle-admin",
        data: {
          _id
        },
        jwt: this.jwt
      }
    }).then(res => {
      // this.ls.jwt.value = res.data.jwt
      // this.ls.userID.value = res.data.user.userID
      // this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to get myself'
      return Promise.reject(msg)
    })
  }

  async toggleCanLogin ({ _id }) {
    return this.axios({
      url: '/api/cms/user?route=toggle-can-login',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        action: "toggle-can-login",
        data: {
          _id
        },
        jwt: this.jwt
      }
    }).then(res => {
      // this.ls.jwt.value = res.data.jwt
      // this.ls.userID.value = res.data.user.userID
      // this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to get myself'
      return Promise.reject(msg)
    })
  }

  async getUsers () {
    return this.axios({
      url: '/api/cms/user?route=list-users',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        "action": "list-users",
        "jwt": this.jwt
      }
    }).then(res => {
      // this.ls.jwt.value = res.data.jwt
      // this.ls.userID.value = res.data.user.userID
      // this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to get myself'
      return Promise.reject(msg)
    })
  }

  async login ({ identity, password }) {
    return this.axios({
      url: '/api/cms/auth',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        "action": "login",
        "data": {
          "identity": identity,
          "password": password
        }
      }
    }).then(res => {
      this.ls.jwt.value = res.data.jwt
      this.ls.userID.value = res.data.user.userID
      this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to login'
      return Promise.reject(msg)
    })
  }

  async adminRegister ({ email, username, password }) {
    return this.axios({
      url: '/api/cms/user',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        "action": "admin-register",
        "data": {
          "email": email,
          "username": username,
          "password": password
        },
        "jwt": this.jwt
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to register'
      return Promise.reject(msg)
    })
  }

  async register ({ email, username, password }) {
    return this.axios({
      url: '/api/cms/auth',
      baseURL: this.getBaseURL(),
      method: 'POST',
      data: {
        "action": "register",
        "data": {
          "email": email,
          "username": username,
          "password": password
        }
      }
    }).then(res => {
      this.ls.jwt.value = res.data.jwt
      this.ls.userID.value = res.data.user.userID
      this.ls.username.value = res.data.user.username

      return res.data
    }, (err) => {
      let msg = err.response.data.msg || 'unable to register'
      return Promise.reject(msg)
    })
  }
}

class DocOperation {
  constructor ({ SDK, endpoint = `/api/project` }) {
    this.SDK = SDK
    this.axios = SDK.axios
    this.endpoint = endpoint
  }
  get jwt () {
    // console.log(this.SDK.jwt)
    return this.SDK.jwt
  }
  get userID () {
    return this.SDK.userID
  }
  get username () {
    return this.SDK.username
  }

  get baseURL () {
    return this.SDK.getBaseURL()
  }

  async create ({ doc }) {
    let action = `create`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": JSON.parse(JSON.stringify(doc))
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async listMine () {
    let action = `list-mine`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {}
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async filterMine ({ filter }) {
    let action = `filter-mine`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {
          filter
        }
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async getBySlug ({ slug }) {
    let action = `get-by-slug`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {
          slug: slug
        }
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async setFeatured ({ id, featured }) {
    let action = `set-featured`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {
          featured: featured,
          _id: id
        }
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async getFeatured () {
    let action = `get-featured`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        data: {}
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async updateMine ({ doc }) {
    let action = `update-mine`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {
          ...doc
        }
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async deleteMine ({ doc }) {
    let action = `delete-mine`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {
          _id: doc._id
        }
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = err.response.data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

}

class EndPointSDK extends DocOperation {
  constructor (props) {
    super(props)
    this.endpoint = props.endpoint
  }
}

export const SDK = new SDKCore({ axios })

// export const Project = new EndPointSDK({ SDK, endpoint: `/api/cms/project` })
// export const SubCore = new EndPointSDK({ SDK, endpoint: `/api/cms/subcore` })
// export const CodeBlock = new EndPointSDK({ SDK, endpoint: `/api/cms/codeblock` })

export const Pages = new EndPointSDK({ SDK, endpoint: `/api/cms/pages` })

// export const runTestProject = async () => {
//   if (process.env.NODE_ENV === 'development') {
//     let doc = await Project.create({
//       doc: {
//         displayName: `lok lok work ${Math.random()}`
//       }
//     }).then((doc) => {
//       return doc
//     }, (msg) => {
//       console.log(msg)
//     })
//     console.log('created', doc)

//     let mine = await Project.listMine()
//     console.log('list-mine', mine)

//     let updated1 = await Project.setFeatured({ id: doc._id, featured: true })
//     console.log('setFeatured-true', updated1)

//     let featured = await Project.getFeatured()
//     console.log('getFeatured', featured)

//     let updated2 = await Project.setFeatured({ id: doc._id, featured: false })
//     console.log('setFeatured-false', updated2)

//     updated2.displayName = 'wahahahah - ' + Math.random()
//     let updated3 = await Project.updateMine({ doc: updated2 })
//     console.log('updateMine', updated3)

//     let del = await Project.deleteMine({ doc: doc })
//     console.log('deletemine', del)

//     let mine2 = await Project.listMine()
//     console.log('list-mine', mine2)
//   }
// }
