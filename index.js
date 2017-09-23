var restify = require('restify')
var models = require('./models/index')

const server = restify.createServer({
  name: 'try_sequelize_cli',
  version: '1.0.0'
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params)
  return next()
})

function getUsers(req, res, next) {
  models.User.findAll({
    include: models.Task
  })
    .then(function (users) {
      var data = {
        error: 'false',
        data: users
      }

      res.send(data)
      return next()
    })
}

function getUser(req, res, next) {
  models.User.find({
    where: {
      'id': req.params.id
    },
    include: models.Task
  }).then(function (user) {
    var data = {
      error: 'false',
      data: user
    }
    res.send(data)
    next()
  })
}

function addUser(req, res, next) {
  models.User.create({
    name: req.body.name,
    email: req.body.email
  }).then(function (user) {
    var data = {
      error: 'false',
      message: 'User created',
      data: user
    }
    res.send(data)
    next()
  })
}

function updateUser(req, res, next) {
  models.User.find({
    where: {
      id: req.params.id
    }
  }).then(function (user) {
    if (user) {
      user.update({
        name: req.body.name,
        email: req.body.email
      }).then(function (user) {
        var data = {
          error: 'false',
          message: 'User updated',
          data: user
        }
        res.send(data)
        next()
      })
    }else{
      res.send()
      next()
    }
  })
}


function deleteUser(req, res, next) {
  models.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(function (user) {
    var data = {
      error: 'false',
      message: 'User removed',
      data: user
    }
    res.send(data)
    next()
  })
  }


function addTask(req,res,next){
  models.Task.create({
    user_id: req.params.id,
    title: req.body.title,
    description: req.body.desc
  }).then(function (task) {
    var data = {
      error: 'false',
      message: 'Task created',
      data: task
    }
    res.send(data)
    next()
  })
}

function updateTask(req, res, next) {
  models.Task.find({
    where: {
      id: req.params.id
    }
  }).then(function (task) {
    if (task) {
      task.update({
        title: req.body.title,
        description: req.body.desc
      }).then(function (task) {
        var data = {
          error: 'false',
          message: 'Task updated',
          data: task
        }
        res.send(data)
        next()
      })
    }else{
      res.send()
      next()
    }
  })
}

server.get('/api/v1/users', getUsers)
server.get('/api/v1/user/:id', getUser)
server.post('/api/v1/user', addUser)
server.put('/api/v1/user/:id', updateUser)
server.del('/api/v1/user/:id', deleteUser)

server.post('/api/v1/task/:id', addTask)
server.put('/api/v1/task/:id', updateTask)

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})