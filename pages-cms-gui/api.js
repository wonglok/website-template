import imageCompression from 'browser-image-compression'
import axios from 'axios'
// import create from 'zustand'
// import { compress, decompress } from 'shrink-string'
// import { proxy, useProxy } from 'valtio'

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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to get myself'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to get myself'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to get myself'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to get myself'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to get myself'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to login'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to register'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || 'unable to register'
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async adminListAll () {
    let action = `admin-list-all`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async findOneMine ({ query }) {
    let action = `find-one-mine`
    return this.axios({
      url: `${this.endpoint}?action=${action}`,
      baseURL: this.baseURL,
      method: 'POST',
      data: {
        jwt: this.jwt,
        "data": {
          query: query
        }
      }
    }).then(res => {
      return res.data
    }, (err) => {
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async adminFilter ({ filter }) {
    let action = `admin-filter`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async adminUpdate ({ doc }) {
    let action = `admin-update`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
      return Promise.reject(msg)
    })
  }

  async adminDelete ({ doc }) {
    let action = `admin-delete`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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
      let msg = (err.response || { data: { msg: 'err' } }).data.msg || `unable to ${action}`
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

export const Posts = new EndPointSDK({ SDK, endpoint: `/api/cms/posts` })
export const Folders = new EndPointSDK({ SDK, endpoint: `/api/cms/folders` })
export const Media = new EndPointSDK({ SDK, endpoint: `/api/cms/media` })

// export const removeCloudianryImage = async ({ media, account = 'loklok-keystone',  }) => {
//   let URL = `https://api.cloudinary.com/v1_1/${account}/delete_by_token`
//   let formData = new FormData()
//   formData.append('token', media.cloudinary.delete_token)
//   let config = {
//   }
//   await axios.post(URL, formData, config)
//     .then(console.log, console.error)
// }

export const uploadImageToCloudinary = async ({ inputFile, account = 'loklok-keystone' }) => {
  const options = {
    maxSizeMB: 2, // (default: Number.POSITIVE_INFINITY)
    maxWidthOrHeight: 2048, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
    useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
    maxIteration: 4 // optional, max number of iteration to compress the image (default: 10)
  }

  let compressedImage = await imageCompression(inputFile, options)

  // if (config) {

  // }

  let url = `https://api.cloudinary.com/v1_1/${account}/image/upload`
  let formData = new FormData()

  formData.append('file', compressedImage)
  if (process.env.NODE_ENV === 'development') {
    formData.append('upload_preset', 'wonglok-portfolio')
  } else {
    formData.append('upload_preset', '86deck-portfolio')
  }

  var config = {
    onUploadProgress: (progressEvent) => {
      var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log(percentCompleted)
    }
  }

  let res = await axios.post(url, formData, config)
  let cloudinary = res.data

  // console.log(cloudinary)

  // https://res.cloudinary.com/ht8mcws2o/image/upload/c_scale,w_150/v1570172749/spaceboard/fbb9uqtegper8vhy68dc.png
  // http://res.cloudinary.com/ht8mcws2o/image/upload/v1570172749/spaceboard/fbb9uqtegper8vhy68dc.png

  let thumb = cloudinary.secure_url.replace('/upload/', '/upload/w_512,h_512,c_fill,g_auto:0,q_auto/')
  let square = cloudinary.secure_url.replace('/upload/', '/upload/w_1024,h_1024,c_fill,g_auto:0,q_auto/')
  let auto = cloudinary.secure_url.replace(`/upload/`, `/upload/q_auto/`)
  let rawURL = cloudinary.secure_url
  // let base64 = await MyFiles.imageToURI(compressed.image)
  // let resCloud = await new Promise((resolve, reject) => {
  //   cloudinary.uploader.upload(base64, (error, result) => {
  //     if (error) {
  //       reject(error)
  //     } else {
  //       resolve(result)
  //     }
  //   })
  // })
  // console.log(resCloud)

  let mime = inputFile.type
  let filename = inputFile.name
  let ext = inputFile.name.split('.').pop()

  return {
    thumb,
    square,
    auto,
    rawURL,
    mime,
    filename,
    ext,
    ...cloudinary
  }
}

// export const usePost = create((set, get) => {
//   return {
//     post: false,

//     savePost: async ({ patch = {} }) => {
//       let post = JSON.parse(JSON.stringify(get().post))
//       if (!post) {
//         return
//       }

//       for (let key in patch) {
//         if (key) {
//           post[key] = patch[key]
//         }
//       }

//       let res = await Posts.updateMine({
//         doc: post
//       })

//       set({ post: res })
//     },

//     clearPost: async () => {
//       set({ post: false })
//     },

//     setPost: async ({ key, value }) => {
//       let post = get().post
//       if (post) {
//         post[key] = value
//         set({ post })
//       }
//     },

//     loadPost: async ({ _id }) => {
//       let post = await Posts.findOneMine({ query: { _id } })
//       set({ post })
//       return post
//     }
//   }
// })


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
