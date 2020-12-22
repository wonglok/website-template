let axios = require('axios')

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    axios({
      method: 'post',
      url: '/push',
      baseURL: 'https://lok-pusher.herokuapp.com',
      data: {
        "password": "wonglok831",
        "event": req.body.event || 'fun',
        "data": req.body.data || {}
      }
    }).then(ev => {
      res.json({
        msg: 'ok',
        result: ev.data
      })
    }, (log) => {
      console.log(log)
      res.status(403).json({
        msg: 'push failed'
      })
    })
  } else {
    res.status(406).json({
      msg: 'bad method'
    })
  }
}
