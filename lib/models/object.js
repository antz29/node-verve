module.exports = (function() {

	// Dependencies
	var	mongoose 	= require('mongoose'),
		_ 		= require('underscore'),
		async 		= require('async'),
		EventEmitter 	= require('events').EventEmitter,
		util		= require('util'),
		nn		= require('brain');

	// Setup mongoose schema
	var schema = new mongoose.Schema({
		type : { type : String },
		loc : Array,
		alive : false,
		age : { type : Number, default : 0 },
		meta : Object,
		object_brain : Object, default : null,
		action_brain : Object, default : null
	});
	schema.index({loc:'2d'},{min : 0,max : 1024});

	// Instanciate model
	var model = mongoose.model('Object',schema);
	var world = null;
	var timer;

	var brain = {
		object : null,
		action : null
	};

	// Constructor
	function VerveObject(new_world,id) {
		world = new_world;
		var that = this;

		var senses = {};

		// load current state
		// gather sense data
		async.parallel({
			'load_state' : function(callback) {
				model.findOne({ _id : id}, function (err, doc) {
					model = doc;

					var brain.object = new nn.NeuralNetwork();
					var brain.action = new nn.NeuralNetwork();

					if (model.object_brain !== null) {
						brain.object.fromJSON(object_brain);
					}

					if (model.action_brain !== null) {
						brain.action.fromJSON(action_brain);
					}
					
					callback(err,null);
				});
			},
			'sights' : function(callback) {
				that.see(function(err,sights) {
					callback(err,sights);
				});	
			},
			'smells' : function(callback) {
				that.smell(function(err,smells) {
					callback(err,smells);
				});	
			}
		},
		function(err,senses) {
			// sense objects
			
						
		});

		// assess available actions
		// assess next action
		// perform action
		// assess outcome
		// store state			
		});
	}

	// Extend EventEmitter
	util.inherits(VerveObject, EventEmitter);

	// Static Methods
	VerveObject.create(type) {
		
	}
	
	// Public methods
	VerveObject.prototype.getMeta(name) {
		
	}

	VerveObject.prototype.setMeta(name,value) {
		
	}
		
	VerveObject.prototype.see(callback) {
		callback(null,{
			'tl' : {
				'near' : ]
					[5,5,5,5],
					[4,2,1,4]
				],
				'mid' : [
					[6,3,1,3]
				],
				'far' : [
					[4,2,1,4]
				]
			}
		});
	}

	VerveObject.prototype.smell(callback) {
		callback(null,{
			1 : [
				
			],
			2 : [
			]
		});
	}

	VerveObject.prototype.touch(object, callback) {	
		callback(null,{});
	}

	VerveObject.prototype.taste(object, callback) {
		callback(null,{});
	}	

	return VerveObject;
}());


