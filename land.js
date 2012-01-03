module.exports = (function() {

	// Dependencies
	var	fs 		= require('fs'),
		_ 		= require('underscore'),
		async 		= require('async'),
		util		= require('util'),
		VerveObject	= require('object');

	// Private members

	// Constructor
	function Land() {

		this.type = 'land';
	
	}
	
	// Extend EventEmitter
	util.inherits(Land, VerveObject);
	
	return Land;
}());


