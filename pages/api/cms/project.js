let Auth = require('./shared/auth.js')
let MongoDB = require('./shared/mongodb.js')
let DocOperation = MongoDB.DocOperation
let DocClass = MongoDB.Project

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // res.json({
    //   msg: 'ok',
    //   body: req.body
    // })

    let scope = new DocOperation({ req, res, DocClass, Auth })
    if (req.query.action === 'create') {
      await scope.create()
    } else if (req.query.action === 'list-mine') {
      await scope.listMine()
    } else if (req.query.action === 'get-by-slug') {
      await scope.getBySlug()
    } else if (req.query.action === 'set-featured') {
      await scope.setFeatured()
    } else if (req.query.action === 'get-featured') {
      await scope.getFeatured()
    } else if (req.query.action === 'update-mine') {
      await scope.updateMine()
    } else if (req.query.action === 'delete-mine') {
      // await scope.deleteMine()
      scope.tryRun(async () => {
        let user = await scope.checkOwner()

        let project = await MongoDB.Project.findOne({ _id: scope.req.body.data._id, userID: user._id })
        if (project && user) {
          await Promise.all([
            MongoDB.SubCore.deleteMany({ userID: user._id, projectID: project._id }),
            MongoDB.CodeBlock.deleteMany({ userID: user._id, projectID: project._id })
          ])
          await MongoDB.Project.findOneAndDelete({ userID: user._id, _id: scope.req.body.data._id })
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
