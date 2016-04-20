"use strict";

var mongoose = require('mongoose');

var coleccionSchema = mongoose.Schema({
  "use strict";

  var mongoose = require('mongoose');

  var itemSchema = mongoose.Schema({
    nombre:String,
    subcategorias:[],
    items:[]
  });
  itemSchema.statics.list = function (filtro,sort,cb) {
      var query = Item.find(filtro);
      query.sort(sort);
      query.exec(function (err, rows) {
          if (err) {
              cb(err);
              return;
          }
          cb(null, rows);
          return;
      });
  }
  var Item = mongoose.model('Item', itemSchema);

});
itemSchema.statics.list = function (filtro,sort,cb) {
    var query = Item.find(filtro);
    query.sort(sort);
    query.exec(function (err, rows) {
        if (err) {
            cb(err);
            return;
        }
        cb(null, rows);
        return;
    });
}
var Item = mongoose.model('Item', itemSchema);
