module.exports = async (req, res) => {
  let Auth = require('./core/auth.js')
  let MongoDB = require('./core/mongodb.js')
  let DocOperation = MongoDB.DocOperation
  let DocClass = MongoDB.Contact

  if (req.method === 'POST') {
    // res.json({
    //   msg: 'ok',
    //   body: req.body
    // })

    // admin-filter-mine

    let operation = new DocOperation({ req, res, DocClass, Auth })
    if (req.query.action === 'create') {
      await operation.create()
    } else if (req.query.action === 'admin-list-all') {
      await operation.adminListAll()
    } else if (req.query.action === 'admin-update') {
      await operation.adminUpdate()
    } else if (req.query.action === 'list-mine') {
      await operation.listMine()
    } else if (req.query.action === 'find-one-public') {
      await operation.findOnePublic()
    } else if (req.query.action === 'find-one-mine') {
      await operation.findOneMine()
    } else if (req.query.action === 'filter-mine') {
      await operation.filterMine()
    } else if (req.query.action === 'admin-filter') {
      await operation.adminFilter()
    } else if (req.query.action === 'get-by-slug') {
      await operation.getBySlug()
    } else if (req.query.action === 'set-featured') {
      await operation.setFeatured()
    } else if (req.query.action === 'get-featured') {
      await operation.getFeatured()
    } else if (req.query.action === 'update-mine') {
      await operation.updateMine()
    } else if (req.query.action === 'delete-mine') {
      // await operation.deleteMine()
      // await scope.deleteMine()
      let scope = operation
      scope.tryRun(async () => {
        let user = await scope.checkOwner()
        let folder = await MongoDB.Contact.findOne({ _id: scope.req.body.data._id, userID: user._id })
        if (folder && user) {
          // await Promise.all([
          //   MongoDB.Contact.deleteMany({ userID: user._id, folderID: folder._id }),
          // ])

          await MongoDB.Contact.findOneAndDelete({ userID: user._id, _id: scope.req.body.data._id })

          scope.res.status(200).json({
            msg: 'successfully removed',
            _id: scope.req.body.data._id
          })
        } else {
          scope.res.status(404).json({
            msg: 'not found',
            _id: scope.req.body.data._id
          })
        }
      })
    } else if (req.query.action === 'admin-delete') {
      // await operation.deleteMine()
      // await scope.deleteMine()
      let scope = operation
      scope.tryRun(async () => {
        let user = await scope.checkAdmin()
        let folder = await MongoDB.Contact.findOne({ _id: scope.req.body.data._id })
        if (folder && user) {
          // await Promise.all([
          //   MongoDB.Contact.deleteMany({ folderID: folder._id }),
          // ])

          await MongoDB.Contact.findOneAndDelete({ _id: scope.req.body.data._id })

          scope.res.status(200).json({
            msg: 'successfully removed',
            _id: scope.req.body.data._id
          })
        } else {
          scope.res.status(404).json({
            msg: 'not found',
            _id: scope.req.body.data._id
          })
        }
      })

    } else {
      res.status(404).json({
        msg: 'action not found'
      })
    }
  } else {
    res.status(406).json({
      msg: 'bad method'
    })
  }
}


// module.exports = async (req, res) => {
//   let Auth = require('./core/auth.js')
//   let MongoDB = require('./core/mongodb.js')
//   let DocOperation = MongoDB.DocOperation
//   let DocClass = MongoDB.Contact

//   if (req.method === 'POST') {
//     // res.json({
//     //   msg: 'ok',
//     //   body: req.body
//     // })

//     let operation = new DocOperation({ req, res, DocClass, Auth })
//     if (req.query.action === 'create') {
//       await operation.create()
//     } else if (req.query.action === 'list-mine') {
//       await operation.listMine()
//     } else if (req.query.action === 'find-one-public') {
//       await operation.findOnePublic()
//     } else if (req.query.action === 'find-one-mine') {
//       await operation.findOneMine()
//     } else if (req.query.action === 'filter-mine') {
//       await operation.filterMine()
//     } else if (req.query.action === 'get-by-slug') {
//       await operation.getBySlug()
//     } else if (req.query.action === 'set-featured') {
//       await operation.setFeatured()
//     } else if (req.query.action === 'get-featured') {
//       await operation.getFeatured()
//     } else if (req.query.action === 'update-mine') {
//       await operation.updateMine()
//     } else if (req.query.action === 'delete-mine') {
//       await operation.deleteMine()
//     } else {
//       res.status(404).json({
//         msg: 'action not found'
//       })
//     }
//   } else {
//     res.status(406).json({
//       msg: 'bad method'
//     })
//   }
// }
