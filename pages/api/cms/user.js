module.exports = async (req, res) => {
  let Auth = require('./core/auth.js')

  if (req.method === 'POST') {
    // res.json({
    //   msg: 'ok',
    //   body: req.body
    // })
    if (req.body.action === 'me') {
      let info = await Auth.checkJWT({ jwt: req.body.jwt })
      let user = await Auth.getUserByIdentity({ identity: info.username })
      // console.log(user)

      res.status(200).json({
        isSelectedInfo: true,
        isAdmin: user.isAdmin,
        _id: user._id,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        roles: user.roles,
        created_at: user.created_at,
        updated_at: user.updated_at
      })
    } else if (req.body.action === 'admin-register') {
      try {
        let { username, email, password } = req.body.data || {}

        let info = await Auth.checkJWT({ jwt: req.body.jwt })
        let user = await Auth.getUserByIdentity({ identity: info.username })

        if (!user.isAdmin) {
          throw new Error('not admin')
        }

        let result = await Auth.register({ username, email, password })
        /*
        {
          "user": {
            "username": "wonglok831",
            "userID": "5f9e0ad02040eb3978d4c949"
          },
          "jwt": "..."
        }
        */
        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        res.status(403).json({
          msg: e.message || 'cant login'
        })
        // throw e
      }
    } else if (req.body.action === 'list-users') {
      try {
        let info = await Auth.checkJWT({ jwt: req.body.jwt })
        let user = await Auth.getUserByIdentity({ identity: info.username })

        if (!user.isAdmin) {
          throw new Error('not admin')
        }

        let result = await Auth.listUsers()

        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        res.status(403).json({
          msg: e.message || 'bad credentials'
        })
        // throw e
      }
    } else if (req.body.action === 'toggle-can-login') {
      try {
        let info = await Auth.checkJWT({ jwt: req.body.jwt })
        let user = await Auth.getUserByIdentity({ identity: info.username })

        if (!user.isAdmin) {
          throw new Error('not admin')
        }

        let result = await Auth.toggleCanLogin({ _id: req.body.data._id })

        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        res.status(403).json({
          msg: e.message || 'bad credentials'
        })
        // throw e
      }
    } else if (req.body.action === 'toggle-admin') {
      try {
        let info = await Auth.checkJWT({ jwt: req.body.jwt })
        let user = await Auth.getUserByIdentity({ identity: info.username })

        if (!user.isAdmin) {
          throw new Error('not admin')
        }

        let result = await Auth.toggleAdmin({ _id: req.body.data._id })

        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        res.status(403).json({
          msg: e.message || 'bad credentials'
        })
        // throw e
      }
    } else if (req.body.action === 'admin-change-password') {
      try {
        let info = await Auth.checkJWT({ jwt: req.body.jwt })
        let user = await Auth.getUserByIdentity({ identity: info.username })

        if (!user.isAdmin) {
          throw new Error('not admin')
        }

        let result = await Auth.adminChangePassword({ _id: req.body.data._id, password: req.body.data.password })

        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        res.status(403).json({
          msg: e.message || 'bad credentials'
        })
        // throw e
      }
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