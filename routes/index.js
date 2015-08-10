var express = require('express');
var router = express.Router();

// instanciamos controlador Primera pregunta
var qC = require('../controllers/quiz_controller');
var quizController = qC(); 

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Primera pregunta
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

// Autor
router.get('/author', function(req, res) {
  res.render('author');
});

module.exports = router;
