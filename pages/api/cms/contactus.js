module.exports = async (req, res) => {
  let MongoDB = require('./core/mongodb.js')

  if (req.method === 'POST') {
    let newContact = await MongoDB.Contact.create({
      email: req.body.email,
      message: req.body.message,
      date: req.body.date
    })
    res.status(200).json({
      msg: 'successfully sent',
      newContact
    })
  } else {
    res.status(406).json({
      msg: 'bad method'
    })
  }
}

/*
fetch('/api/cms/contact', {
method: 'POST',
headers: {
  'content-type': 'application/json'
},
body: JSON.stringify({ message: 123, email: 'lok@lok.com', date: new Date() })
}).then(e => e.json()).then(console.log)
*/