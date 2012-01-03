module.exports = (function() {

	// Dependencies
	var	fs 		= require('fs'),
		_ 		= require('underscore'),
		async 		= require('async'),
		EventEmitter 	= require('events').EventEmitter,
		util		= require('util'),
		path 		= require('path'),
		mongoose	= require('mongoose');

	// Private members
	var size = 1024;
	var models = {};

	mongoose.connect('mongodb://127.0.0.1/verve');

	function loadObject(model,verve) {
		if (!models[model]) {
			var name = model.toLowerCase(model);
			var m = require(__dirname + '/models/' + name + '.js');
			models[model] = m;
		}
		return new models[model](verve);
	}

	// Constructor
	function Verve() {
	}
	
	// Extend EventEmitter
	util.inherits(Verve, EventEmitter);
	
	Verve.prototype.start = function() {
		
	}

	Verve.prototype.addObject(object) {

	}

	Verve.prototype.getObject(id) {

	}

	return Verve;
}());

