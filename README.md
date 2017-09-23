Try Sequelize-CLI to:

- connect to a postgres database
- model 2 tables with a 1:M relationship using multiple migation steps
- Perform some CRUD operations over http

## Setup
```
mkdir try_sequelize_cli
cd try_sequelize_cli
npm init
npm install sequelize pg --save
npm install sequelize-cli --save
npm install restify
```
Run the sequelize `init` to setup some project directories.
Sequelize CLI was installed locally to the node_modules folder so run using:

```
./node_modules/.bin/sequelize init
```

Update the generated [./config/config.json](./config/config.json) file with database name and login credentials and dialect.
```
  "development": {
    "username": "username",
    "password": "password",
    "database": "try_sequelize_cli",
    "host": "localhost",
    "dialect": "postgres"
  },

```

## Create the database

Use sequelize CLI `db:create` to create the database as defined in the [./config/config.json](./config/config.json) 
```
./node_modules/.bin/sequelize db:create
```

## Use CLI to generate a model and migration file

Generate a model and it's accompanying migration file.

```
./node_modules/.bin/sequelize model:create --name User --attributes name:string,email:string --underscored
```

Run the migration file to create the table in the database.

```
./node_modules/.bin/sequelize db:migrate
```

That was fun, lets add another model and migration.

```
./node_modules/.bin/sequelize model:create --name Task --attributes title:string,description:string --underscored
```
Run migration again to create the second table in the database.
```
./node_modules/.bin/sequelize db:migrate
```

## Continue the migration dance

Generate a migration file without a model to add a column to the existing table.

```
./node_modules/.bin/sequelize migration:generate --name task_add_userid
```

Edit the migration file to create a new column 
```javascript 
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Tasks','user_id',{
      type: Sequelize.INTEGER,
      allowNull:false
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Tasks', 'user_id')
  }
};

```


Generate another migration file without a model to add a FK constraint

```
./node_modules/.bin/sequelize migration:generate --name task_user_fk
```

Edit migration file to add constraint
```javascript 
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Tasks', ['user_id'], {
      type: 'FOREIGN KEY',
      name: 'task_user_fk',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Tasks','task_user_fk')
  }
};
```

Run and apply these migrations.
```bash
./node_modules/.bin/sequelize db:migrate
```

Next update the Models to expess the 1:M associatons between them.

Open the [./models/user.js](./models/user.js) file and add the `associate` function with the `hasMany` relationship:

```javascript
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    underscored: true
  })
  User.associate = function(models) {
      User.hasMany(models.Task, {
        foreignKey: 'user_id'
      })
  }

  return User
};

```
Note sequelize v4 introduces a breaking change with the  `classMethods` and `instanceMethods` being removed:

http://docs.sequelizejs.com/manual/tutorial/upgrade-to-v4.html#breaking-changes



Open the [./models/task.js](./models/task.js) file and edit the `associate` function to add the `belongsTo` relationship:

```javascript
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
      underscored: true,
    }
  )

  Task.associate = function (models) {
    Task.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    })
  }

  return Task
}
```

## Create a CRUD API

See [index.js](index.js) for routes and handlers.

## Start server

```
node index.js
```
## Use curl to hit the API

Add a user
```
curl --data "name=user1&email=user1@email" http://127.0.0.1:3000/api/v1/user
```

Get a User

```
curl http://127.0.0.1:3000/api/v1/user/1
```

Update a User

```
curl -X PUT --data "name=user1&email=user1@email.edited" http://127.0.0.1:3000/api/v1/user/1
```

Add Task for a  User

```
curl --data "title=dishes&desc=user1 must do the dishes" http://127.0.0.1:3000/api/v1/task/1
```

A user will now be returned with tasks array.


Update a User's task

```
curl -X PUT --data "title=cook dinner&desc=user1 can do the cooking" http://127.0.0.1:3000/api/v1/task/1
```

Delete User (and all their tasks)

```
curl -X DELETE http://127.0.0.1:3000/api/v1/user/1
```


## Clean up

Drop the datebase
```
./node_modules/.bin/sequelize db:drop
```