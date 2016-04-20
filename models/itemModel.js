"use strict";

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    ISBN: String,
    titulo: String,
    url_portada: String,
    editorial: String,
    autor: String,
    genero: [String],
    num_paginas: Number,
    anio_edit: Date,
    tipo: String,
    precio: Number,
    uploadBy: String,
    overview: String,
    en_carrito: String
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
