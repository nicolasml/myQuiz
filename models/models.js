var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// ORM
var Sequelize = require('sequelize');

// conectar ORM a BBDD SQLite
// var sequelize = new Sequelize( null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// importar definición de tabla Quiz segun quiz.js; se invoca desde models.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
// importar definición tabla Comments y 
var Comment = sequelize.import(path.join(__dirname,'comment'));

//enlazar relacion 1:N entre Comment:Quiz
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exportamos objeto Quiz (BBDD) para hacerlo disponible al resto de la aplicación
exports.Quiz = Quiz;
// exportamos objeto Comment (BBDD)
exports.Comment = Comment;

// realiza conexión a BBDD
sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if(count===0){
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'
			}).then(function(){
				console.log('Base de datos inicializada');
			});
		}
	});
});
