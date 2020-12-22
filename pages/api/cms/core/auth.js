// src/http/get-index
// let arc = require('@architect/functions')
// let bData = require('@begin/data')
// let Hashids = require('hashids')
const bcrypt = require('bcryptjs')
let mongodb = require('./mongodb')

// function getID () {
//   let hashids = new Hashids()
//   let epoch = Date.now() - 1525066366572
//   return hashids.encode(epoch)
// }

var jwtlib = require('jwt-simple');
var jwtSecret = process.env.JWT_SECRET || 'defaultabc123+++default123';

let issueJWT = ({ username, userID }) => {
  var payload = { username, userID };
  return jwtlib.encode(payload, jwtSecret);
}

let checkJWT = ({ jwt }) => {
  // var payload = { username, userID };
  return jwtlib.decode(jwt, jwtSecret);
}

// let getID = () => {
//   return '_' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9);
// }

let getHash = (pwtext) => new Promise((resolve, reject) => {
  var salt = bcrypt.genSaltSync(10);
  bcrypt.hash(pwtext, salt, function(err, hash) {
    if (err) {
      reject(err);
      return
    } else {
      resolve(hash)
    }
  });
})

let compare = (pwtext, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(pwtext, hash, function(err, result) {
    if (err) {
      reject(err);
      return
    } else {
      resolve(result)
    }
  });
})

let countHowManyUsers = module.exports.countHowManyUsers = async () => {
  let result = await mongodb.User.countDocuments({})

  if (result) {
    return result
  } else {
    return false
  }
}

let getUserByIdentity = async ({ identity }) => {
  let result = await mongodb.User.findOne({
    $or: [
      {
        username: identity
      },
      {
        email: identity
      }
    ]
  })

  // console.log(result)

  // let result = await data.user.scan({
  //   FilterExpression: 'username = :myidentity OR email = :myidentity',
  //   ExpressionAttributeValues: {
  //     ':myidentity': identity
  //   }
  // })

  if (result) {
    return result
  } else {
    return false
  }
}

module.exports.getUserByIdentity = getUserByIdentity

module.exports.checkJWT = async ({ jwt }) => {
  let item = checkJWT({ jwt })
  if (item) {
    return item
  } else {
    return Promise.reject(false)
  }
}

module.exports.checkIdentity = async ({ identity }) => {
  // let data = await arc.tables()
  let exist = await getUserByIdentity({ identity })

  if (exist) {
    return Promise.reject(new Error('duplicated'))
  } else {
    return {
      status: 'ok'
    }
  }
}

module.exports.register = async ({ username, password, email }) => {
  if (!username || !email || !password) {
    return Promise.reject(new Error('missing info'))
  }

  let existingUsername = await getUserByIdentity({ identity: username })
  let existingEmail = await getUserByIdentity({ identity: email })

  if (existingUsername || existingEmail) {
    return Promise.reject(new Error('user exist'))
  }

  let passwordHash = await getHash(password)
  // let compared = await compare(password, passwordHash)

  let howMany = await countHowManyUsers()

  let newUsr = new mongodb.User({
    displayName: username,
    username,
    passwordHash,
    email,
    isAdmin: howMany === 0,
    roles: [{ role: 'guest' }]
  })
  newUsr = await newUsr.save()

  await newUsr.save()

  let userID = newUsr._id

  let jwt = issueJWT({ username, userID, roles: newUsr.roles })
  return {
    user: {
      username, userID
    },
    jwt
  }
}

module.exports.login = async ({ identity, password }) => {
  // let data = await arc.tables()
  // let hash = await getHash(password)

  let user = await getUserByIdentity({ identity })

  // console.log(user)

  if (user && user.passwordHash) {
    let correct = await compare(password, user.passwordHash)
    if (correct) {
      let username = user.username
      let userID = user._id
      let jwt = issueJWT({ username, userID })
      return {
        user: {
          username, userID
        },
        jwt
      }
    } else {
      return Promise.reject('bad credentials')
    }
  } else {
    return Promise.reject('bad credentials')
  }
}
