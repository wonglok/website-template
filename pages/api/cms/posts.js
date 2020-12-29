module.exports = async (req, res) => {
  let Auth = require('./core/auth.js')
  let MongoDB = require('./core/mongodb.js')
  let DocOperation = MongoDB.DocOperation
  let DocClass = MongoDB.Posts

  if (req.method === 'POST') {
    // res.json({
    //   msg: 'ok',
    //   body: req.body
    // })

    let operation = new DocOperation({ req, res, DocClass, Auth })
    if (req.query.action === 'create') {
      await operation.create()
    } else if (req.query.action === 'list-mine') {
      await operation.listMine()
    } else if (req.query.action === 'find-one-public') {
      await operation.findOnePublic()
    } else if (req.query.action === 'find-one-mine') {
      await operation.findOneMine()
    } else if (req.query.action === 'filter-mine') {
      await operation.filterMine()
    } else if (req.query.action === 'get-by-slug') {
      await operation.getBySlug()
    } else if (req.query.action === 'set-featured') {
      await operation.setFeatured()
    } else if (req.query.action === 'get-featured') {
      await operation.getFeatured()
    } else if (req.query.action === 'update-mine') {
      await operation.updateMine()
    } else if (req.query.action === 'delete-mine') {
      await operation.deleteMine()
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
