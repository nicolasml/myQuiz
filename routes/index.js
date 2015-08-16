var express = require('express');
var router = express.Router();

// instanciamos controlador Primera pregunta
var qC = require('../controllers/quiz_controller');
var quizController = qC(); 

var cC = require('../controllers/comment_controller');
var commentController = cC(); 

var sC = require('../controllers/session_controller');
var sessionController = sC();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

// Definición de rutas de session
router.get('/login', sessionController.new);		// formulario login
router.post('/login', sessionController.create);	// crear session
router.get('/logout', sessionController.destroy);	// destruir session

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId', quizController.destroy);

// Autor
router.get('/author', function(req, res) {
  res.render('author');
});

// Comments
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
