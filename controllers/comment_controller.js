// version closure
module.exports = function() {

var models = require('../models/models.js');

    return {
        load: function(req, res, next, commentId) {  // Autoload :commentId
            models.Comment.find({
                    where: { id: commentId}
                }).then(
                function(comment) {
                    req.comment = comment;
                    next();
                }, 
                function(err) {
                    next( new Error('No existe commentId = ' + commentId));
                }
            );
        },
        new: function(req, res) {  // GET /quizes/:quizId/comments/new
            var comment = {texto: '', QuizId: req.params.quizId};
            res.render('comments/new.ejs', {comment: comment, errors: {}});
        },
        create: function(req, res) {  // POST /quizes/:quizId/comments
            // version en forma´directa creacion objeto quiz
            var cm = {texto: req.body.comentario, QuizId: req.params.quizId};
            var comment = models.Comment.build(cm); 

            comment.save().then( 
                function() {
                    res.redirect('/quizes/' + req.params.quizId);
                }, 
                function(err) {
                    var errors = {};
                    for (var i=0; i< err.errors.length; i++)
                        errors[err.errors[i].path] = err.errors[i].message;   // Array to Object
                    
                    //console.log(Object.getOwnPropertyNames(err));
                    //console.log(Object.getOwnPropertyNames(errors));

                    res.render('comments/new.ejs', {comment: comment, errors: errors});
                }
            ).catch(function(error){next(error)});
        },
        publish: function(req, res) {  // GET /quizes/:quizId/comments/:commentId/publish
            // version en forma´directa creacion objeto quiz
            req.comment.publicado = true; 

            req.comment.save({ fields: ["publicado"]}).then( 
                function() {
                    res.redirect('/quizes/' + req.params.quizId);
                }
            ).catch(function(error){next(error)});
        }
    }
};
