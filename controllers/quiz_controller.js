// version closure
module.exports = function() {

var models = require('../models/models.js');

    return {
    	index: function(req, res) {	// GET /quizes
    		if (!req.query.search) {
        		models.Quiz.findAll().then(function (quizes){
        			res.render('quizes/index.ejs', {quizes: quizes});
        		}).catch( function(error){ next(error); });
        	}
        	else {
        		var search = "%" + req.query.search.replace(/\s/g, "%") + "%";
        		models.Quiz.findAll({where: ["pregunta like ?", search]})
        		.then(function (quizes){
        			res.render('quizes/index.ejs', {quizes: quizes});
        		}).catch( function(error){ next(error); });
        		console.log("search: " + search);
        	}
        },
        load: function(req, res, next, quizId) {	// Autoload - factoriza el código si incluye ruta :quizId
        	models.Quiz.find(req.params.quizId).then( function(quiz) {
        		if (quiz){
        			req.quiz = quiz;
        			next();
        		} else {
        			next(new Error('No existe quizId=' + quizId));
        		}
        	});
        },
        show: function(req, res) {	// GET /quizes/:id
            res.render('quizes/show', {quiz: req.quiz});
        },
        answer: function(req, res) {	// GET /quizes/:id/answer
        	var resultado = 'Incorrecto :-(';
        	if ( req.query.respuesta === req.quiz.respuesta ) resultado = 'Correcto :-)';
            res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
        },
        new: function(req, res) {  // GET /quizes/new
            //var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta"});
            var quiz = {pregunta: "Pregunta", respuesta: "Respuesta"};
            res.render('quizes/new', {quiz: quiz});
        },
        create: function(req, res) {  // POST /quizes/create
            // nuevo objeto no persistente asociado a la tabla Quiz
            var qz = {pregunta: req.body.pregunta, respuesta: req.body.respuesta};
            var quiz = models.Quiz.build(qz); 

            // inserta el objeto quiz, guarda en BBDD los campos pregunta y respuesta
            quiz.save({ fields: ["pregunta","respuesta"]}).then( function(){
                res.redirect('/quizes');
            });
        }
    }
};

/*
exports.question = function(req, res) {
            res.render('quizes/question', {pregunta: 'Capital de Italia'});
        };

exports.answer = function(req, res) {
        	if ( req.query.respuesta === 'Roma' )
            	res.render('quizes/answer', {	respuesta: 'Correcto :-)'});
            else
            	res.render('quizes/answer', {	respuesta: 'Incorrecto :-('});
        };
*/