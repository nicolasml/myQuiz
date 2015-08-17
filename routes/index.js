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

router.param('quizId', quizController.load);		// Autoload de url con :quizId
router.param('commentId', commentController.load);	// Autoload :commentId

// Definición de rutas de session
router.get('/login', sessionController.new);		// formulario login
router.post('/login', sessionController.create);	// crear session
router.get('/logout', sessionController.destroy);	// destruir session (deberia ser DELETE)

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId', sessionController.loginRequired, quizController.destroy);

// Autor
router.get('/author', function(req, res) {
  res.render('author');
});

// Comments
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	sessionController.loginRequired, commentController.publish);	// deberia ser PUT

module.exports = router;
