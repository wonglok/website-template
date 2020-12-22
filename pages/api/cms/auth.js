module.exports = async (req, res) => {
  let Auth = require('./core/auth.js')

  if (req.method === 'POST') {
    // res.json({
    //   msg: 'ok',
    //   body: req.body
    // })

    if (req.body.action === 'login') {
      try {
        let { identity, password } = req.body.data || {}
        let result = await Auth.login({ identity, password })
        /*
        {
          "user": {
            "username": "wonglok831",
            "userID": "5f9e0ad0db31533977768ee2"
          },
          "jwt": "..."
        }
        */
        console.log(result)

        res.status(200).json(result)
      } catch (e) {
        console.log(e)
        res.status(403).json({
          msg: e.message || 'bad credentials'
        })
        // throw e
      }
    } else if (req.body.action === 'register') {
      try {
        let { username, email, password } = req.body.data || {}
        let count = await Auth.countHowManyUsers()
        if (count >= 1) {
          throw new Error('Admin already registered')
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