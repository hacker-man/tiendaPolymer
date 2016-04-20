"use strict";

var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var Item = mongoose.model('Item');


router.get('/', function(req, res, next) {
    res.send('Hola Soy tu API');
});

router.get('/colec-name', function(req, res, next) {
    res.status(200).json({
        names: ["DC", "Marvel", "DarkHorse"]

    });
});
router.get('/colec-sub', function(req, res, next) {
  //DC,Marvel,DarkHorse
  switch (req.query.sub) {
    case "DC":
    res.status(200).json({
        subcateories: ["Superman", "Batman", "Flash"]
    });
    break;
    case "Marvel":
    res.status(200).json({
        subcateories: ["Spiderman", "Batman", "Spawn"]
    });
    break;
    case "DarkHorse":
    res.status(200).json({
        subcateories: ["Spawn", "Sin City", "HellBoy"]
    });
    break;
    default:  res.status(404).json({
          result: "No existe esa categoría"
      });

  }

});
router.get('/colec-item', function(req, res, next) {

    res.status(200).json({
        itemSpiderman: [{
            "nombre": "Spiderman 3",
            "precio": 10

        },
      {
        "nombre": "Spiderman 6",
        "precio": 10
      },{
        "nombre": "Spiderman 7",
        "precio": 7.5
      }]

    });
});
router.get('/users', function(req, res, next) {
    var sort = req.query.sort || 'nickname';
    Usuario.list(sort, function(err, rows) {
        if (err) {
            res.status(400).json({
                result: false,
                status: 'Bad Request',
                err: err
            });
        }
        res.status(200).json({
            result: true,
            status: 'OK',
            usuarios: rows
        });
    });
});

router.get('/items', function(req, res, next) {
    var sort = req.query.sort || 'titulo';
    var tipo = req.query.tipo;
    var filtro = {};
    if (typeof req.query.tipo !== "undefined")
        filtro.tipo = req.query.tipo;
    if (typeof req.query.genero !== "undefined")
        filtro.genero = req.query.genero;

    Item.list(filtro, sort, function(err, rows) {
        if (err) {
            res.status(400).json({
                result: false,
                status: 'Bad Request',
                err: err
            });
        }
        res.status(200).json({
            result: true,
            status: 'OK',
            items: rows
        });
    });
});
router.get('/items/:id', function(req, res) {
    var search_item = Item.find({
        _id: req.params.id
    });
    search_item.exec(function(err, row) {
        if (err) {
            res.status(400).json({
                result: false,
                status: 'Bad Request',
                err: err
            });
        }
        res.status(200).json({
            result: true,
            status: 'OK',
            item: row
        });

    });
});
router.post('/users', function(req, res) {

    var user = new Usuario(req.body);
    //req.body.password = hash.sha256().update(req.body.password).digest('hex');
    var nuevo_usuario = Usuario.find({
        nickname: req.body.nickname
    });
    nuevo_usuario.exec(function(err, rows) {
        if (err) {
            return;
        }
        if (rows.length > 0) {
            res.status(409).json({
                result: false,
                status: "conflict",
                info: "nicknameRegistrado",
            });
        } else {
            //guardamos usuario en la BD:
            user.save(function(err, newUser) {
                if (err) {
                    res.status(400).json({
                        result: false,
                        status: 'Bad Request',
                        err: err
                    });
                    return;
                }
                res.status(200).json({
                    result: true,
                    status: 'OK',
                    usuario: newUser
                });
            });
        }

    });


});

router.post('/items', function(req, res) {
    var item = new Item(req.body);
    item.save(function(err, newItem) {
        if (err) {
            res.status(400).json({
                result: false,
                status: 'Bad Request',
                err: err
            });
            return;
        }
        res.status(200).json({
            result: true,
            status: 'OK',
            item: newItem
        });
    });

});
router.post("/itemsCart", function(req, res) {
    var ItemsMiCarrito = Item.find({
        en_carrito: req.body.en_carrito
    });
    ItemsMiCarrito.exec(function(err, rows) {
        if (err) {
            res.status(400).json({
                result: false,
                status: 'Bad Request',
                err: err
            });
            return;
        }
        res.status(200).json({
            myItems: rows
        });
    });
});
router.post("/itemsContrib", function(req, res) {
    var ItemsMiCarrito = Item.find({
        uploadBy: req.body.uploadBy
    });
    ItemsMiCarrito.exec(function(err, rows) {
        if (err) {
            res.status(400).json({
                result: false,
                status: 'Bad Request',
                err: err
            });
            return;
        }
        res.status(200).json({
            myItems: rows
        });
    });
});
router.post('/datauser', function(req, res) {
    var data_user = Usuario.find({
        nickname: req.body.nickname
    });
    data_user.exec(function(err, row) {
        if (err) {
            return;
        }
        res.status(200).json({
            result: true,
            user: row
        });
    });
});
router.post('/login', function(req, res) {
    //var user = new Usuario(req.body);
    var login_usuario = Usuario.find({
        nickname: req.body.nickname,
        password: req.body.password
    });
    login_usuario.exec(function(err, row) {
        if (err) {
            return;
        }
        if (row.length == 0) {
            res.status(401).json({
                result: false,
                info: "passOrNickInvalid",
            });
        } else {
            res.status(200).json({
                result: true,
                info: "LoginOK",
                user: row
            });
        }

    });
});
router.put('/users/:id', function(req, res) {
    //req.body.password = hash.sha256().update(req.body.password).digest('hex');
    Usuario.update({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        multi: true
    }, function(err, data) {
        if (err) {
            res.json({
                result: false,
                err: err
            });
            return;
        }
        res.json({
            result: true,
            row: data
        });
    });

});

router.put('/items/:id', function(req, res) {
    Item.update({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        multi: true
    }, function(err, data) {
        if (err) {
            res.json({
                result: false,
                err: err
            });
            return;
        }
        res.json({
            result: true,
            row: data
        });
    });
});

router.delete("/items/:id", function(req, res) {
    Item.remove({
        _id: req.params.id
    }, function(err) {
        if (!err) {
            return res.send('Item deleted!');
        } else {
            return res.send('Error deleting item!');
        }
    });
});
module.exports = router;
