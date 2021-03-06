const slugify = require('slugify')
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { DB_NAME } = require('../../../../site-template.config');
mongoose.set('useCreateIndex', true);
let DBNAME = DB_NAME
let KADB = process.env.MONGO_URL || `mongodb://localhost:27017/${DBNAME}?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
mongoose.connect(KADB, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

let Schema = mongoose.Schema
let SchemaExport = {}

module.exports.SchemaExport = SchemaExport

SchemaExport.User = new Schema({
  username: {
    type: String,
    unique: true,
    index: true
  },
  email: String,
  passwordHash: String,
  displayName: String,
  canLogin: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  roles: [{ role: String }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.User = mongoose.models.User || mongoose.model('User', SchemaExport.User);

// ---------------------- //

SchemaExport.Folder = new Schema({
  //
  featured: {
    type: Boolean,
    default: false
  },

  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  displayName: String,
  title: String,
  text: String,
  slug: {
    type: String,
    unique: true,
    index: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.Folder = mongoose.models.Folder || mongoose.model('Folder', SchemaExport.Folder);

// ---------------------- //

SchemaExport.Media = new Schema({
  //
  featured: {
    type: Boolean,
    default: false
  },

  folderID: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
  },

  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  type: {
    type: String,
    default: 'cloudinary'
  },

  cloudinary: {
    type: Schema.Types.Mixed
  },

  // displayName: String,
  title: String,
  text: String,

  // slug: {
  //   type: String,
  //   unique: true,
  //   index: true
  // },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.Media = mongoose.models.Media || mongoose.model('Media', SchemaExport.Media);

// ---------------------- //

SchemaExport.Posts = new Schema({
  //
  featured: {
    type: Boolean,
    default: false
  },

  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  displayName: String,
  title: String,
  text: String,
  slug: {
    type: String,
    unique: true,
    index: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.Posts = mongoose.models.Posts || mongoose.model('Posts', SchemaExport.Posts);

// ----------------------- //


SchemaExport.Contact = new Schema({
  email: String,
  message: String,
  date: { type: Date }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.Contact = mongoose.models.Contact || mongoose.model('Contact', SchemaExport.Contact);

// ----------------------- //

module.exports.DocOperation = class DocOperation {
  constructor ({ req, res, DocClass, Auth }) {
    this.req = req
    this.res = res
    this.DocClass = DocClass
    this.Auth = Auth
  }

  async getInfoFromJWT () {
    let jwt = this.req.body.jwt || 'bad jwt'
    let { userID, username } = await this.Auth.checkJWT({ jwt }) || {}
    if (!userID || !username) {
      throw new Error('bad jwt')
    }
    return {
      userID, username
    }
  }

  async tryRun (func) {
    try {
      await func({ req: this.req, res: this.res })
    } catch (e) {
      console.log(e)
      this.res.status(500).json({
        isError: true,
        msg: e.message || 'error'
      })
    }
  }

  async create () {
    this.tryRun(async () => {
      let { userID } = await this.getInfoFromJWT()
      let newDoc = this.req.body.data

      if (newDoc.displayName) {
        newDoc.slug = slugify(newDoc.displayName, {
          replacement: '-',  // replace spaces with replacement character, defaults to `-`
          lower: true,      // convert to lower case, defaults to `false`
          strict: true     // strip special characters except replacement, defaults to `false`
        })
      }

      let result = new this.DocClass({
        ...newDoc,
        userID
      })
      await result.save()

      this.res.status(200).json(result)
    })
  }

  async adminListAll () {
    this.tryRun(async () => {
      await this.checkAdmin()
      let result = await this.DocClass.find({}).sort('-created_at')
      this.res.status(200).json(result)
    })
  }

  async listMine () {
    this.tryRun(async () => {
      let { userID } = await this.getInfoFromJWT()

      let result = await this.DocClass.find({ userID }).sort('-created_at')
      this.res.status(200).json(result)
    })
  }

  async findOnePublic () {
    this.tryRun(async () => {
      let query = this.req.body.data.query
      let result = await this.DocClass.findOne({ ...query })
      this.res.status(200).json(result)
    })
  }

  async findOneMine () {
    this.tryRun(async () => {
      let { userID } = await this.getInfoFromJWT()

      let query = this.req.body.data.query
      let result = await this.DocClass.findOne({ ...query, userID })
      this.res.status(200).json(result)
    })
  }

  async adminFilter () {
    this.tryRun(async () => {
      await this.checkAdmin()

      let filter = this.req.body.data.filter
      let result = await this.DocClass.find({ ...filter }).sort('-created_at')
      this.res.status(200).json(result)
    })
  }

  async filterMine () {
    this.tryRun(async () => {
      let { userID } = await this.getInfoFromJWT()

      let filter = this.req.body.data.filter
      let result = await this.DocClass.find({ ...filter, userID })
      this.res.status(200).json(result)
    })
  }

  async getBySlug () {
    this.tryRun(async () => {
      let result = await this.DocClass.findOne({ slug: this.req.body.data.slug })

      if (!result) {
        throw new Error('slug not found')
      }
      this.res.status(200).json(result)
    })
  }
  // getUserByIdentity
  async getFeatured () {
    this.tryRun(async () => {
      // module.exports.Project.find({  })
      let result = await this.DocClass.find({ featured: true })

      if (!result) {
        this.res.status(200).json([])
      }
      this.res.status(200).json(result)
    })
  }

  async checkAdmin () {
    let { username } = await this.getInfoFromJWT()
    let user = await this.Auth.getUserByIdentity({ identity: username })
    if (!user.isAdmin) {
      throw new Error('not admin')
    }
    console.log('admin-check', user)
    return user
  }

  async checkOwner () {
    let { username } = await this.getInfoFromJWT()
    let user = await this.Auth.getUserByIdentity({ identity: username })
    if (user.username !== username) {
      throw new Error('not owner')
    }
    let cloned = JSON.parse(JSON.stringify(user))
    delete cloned.passwordHash
    console.log('owner-check', cloned)
    return user
  }

  // getUserByIdentity
  async setFeatured () {
    this.tryRun(async () => {
      await this.checkAdmin()

      // module.exports.Project.
      let result = await this.DocClass.findOneAndUpdate({ _id: this.req.body.data._id }, { featured: this.req.body.data.featured })
      if (result === null) {
        this.res.status(404).json({
          msg: 'obj not found',
          _id: this.req.body.data._id
        })
      } else {
        result = await this.DocClass.findOne({ _id: this.req.body.data._id })
        this.res.status(200).json(result)
      }
    })
  }

  async updateMine () {
    this.tryRun(async () => {
      let user = await this.checkOwner()

      let newData = this.req.body.data
      delete newData.featured
      delete newData.userID

      if (newData.displayName) {
        newData.slug = slugify(newData.displayName, {
          replacement: '-',  // replace spaces with replacement character, defaults to `-`
          lower: true,      // convert to lower case, defaults to `false`
          strict: true     // strip special characters except replacement, defaults to `false`
        })
      }

      // module.exports.Project.
      await this.DocClass.findOneAndUpdate({ userID: user._id, _id: this.req.body.data._id }, newData)
      let result = await this.DocClass.findOne({ _id: this.req.body.data._id })

      if (result === null) {
        this.res.status(404).json({
          msg: 'obj not found',
          _id: this.req.body.data._id
        })
      } else {
        this.res.status(200).json(result)
      }
    })
  }

  async adminUpdate () {
    this.tryRun(async () => {
      let user = await this.checkOwner()

      if (!user.isAdmin) {
        throw new Error('is not admin')
      }

      let newData = this.req.body.data
      delete newData.featured
      delete newData.userID

      if (newData.displayName) {
        newData.slug = slugify(newData.displayName, {
          replacement: '-',  // replace spaces with replacement character, defaults to `-`
          lower: true,      // convert to lower case, defaults to `false`
          strict: true     // strip special characters except replacement, defaults to `false`
        })
      }

      // module.exports.Project.
      await this.DocClass.findOneAndUpdate({ _id: this.req.body.data._id }, newData)
      let result = await this.DocClass.findOne({ _id: this.req.body.data._id })

      if (result === null) {
        this.res.status(404).json({
          msg: 'obj not found',
          _id: this.req.body.data._id
        })
      } else {
        this.res.status(200).json(result)
      }
    })
  }

  async deleteMine () {
    this.tryRun(async () => {
      let user = await this.checkOwner()

      let result = await this.DocClass.findOneAndDelete({ userID: user._id, _id: ObjectId(this.req.body.data._id) })

      if (result === null) {
        this.res.status(404).json({
          msg: 'already removed',
          _id: this.req.body.data._id
        })
      } else {
        this.res.status(200).json({
          msg: 'removed',
          _id: this.req.body.data._id
        })
      }
    })
  }
}
