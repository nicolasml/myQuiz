// version closure
module.exports = function() {

var users = { admin: {id: 1, username: "admin", password: "1234"},
              pepe: {id: 2, username: "pepe", password: "5678"}
            };

    return {
        autenticar: function(login, password, callback) {  // comprueba si hay usuario registrado en users
            if (users[login]) {
                if (users[login].password === password)
                    callback(null, users[login]);           // firma callback (error, user)
                else
                    callback({ message: 'Password erróneo',
                               login: { error: false, value: login},
                               password: {error: true}
                            });
            } else {
                callback({ message: 'Este usuario no existe',
                           login: { error: true, value: login},
                           password: {error: null}
                        });
            }
        }
    }
};
