const slugify = require('slugify')
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
let DBNAME = `developerblog`
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
SchemaExport.Project = new Schema({
  featured: {
    type: Boolean,
    default: false
  },

  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  displayName: String,
  libs: [{
    name: String,
    url: String
  }],
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

module.exports.Project = mongoose.models.Project || mongoose.model('Project', SchemaExport.Project);

SchemaExport.SubCore = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  projectID: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  position: {
    x: Number,
    y: Number,
    z: Number
  },
  rID: String,
  color: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.SubCore = mongoose.models.SubCore || mongoose.model('SubCore', SchemaExport.SubCore);

SchemaExport.CodeBlock = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  projectID: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  position: {
    x: Number,
    y: Number,
    z: Number
  },
  rID: String,
  color: String,
  code: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports.CodeBlock = mongoose.models.CodeBlock || mongoose.model('CodeBlock', SchemaExport.CodeBlock);

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

  async listMine () {
    this.tryRun(async () => {
      let { userID } = await this.getInfoFromJWT()

      let result = await this.DocClass.find({ userID })
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
    console.log('owner-check', user)
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

  async deleteMine () {
    this.tryRun(async () => {
      let user = await this.checkOwner()

      let result = await this.DocClass.findOneAndDelete({ userID: user._id, _id: this.req.body.data._id })

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
