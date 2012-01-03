module.exports = (function() {

	// Dependencies
	var	async 		= require('async')
		_		= require('underscore');

	// Private members
	var 	mapDimension = 64,
		unitSize = 1,
		roughness = 16,
		map,
		types = {
			'I' : 0.99999,
			'R' : 0.95,
			'S' : 0.8,
			'L' : 0.3,
			'W' : 0
		};

	// Private methods
	function create2DArray(d1, d2) {
		var x = new Array(d1),
		i = 0,
		j = 0;

		for (i = 0; i < d1; i += 1) {
			x[i] = new Array(d2);
		}

		for (i=0; i < d1; i += 1) {
			for (j = 0; j < d2; j += 1) {
				x[i][j] = 0;
			}
		}

		return x;
	}

	// Random function to offset the center
	function displace(num){
		var max = num / (mapDimension + mapDimension) * roughness;       
		return (Math.random(1.0)- 0.5) * max;  
	}

	// Normalize the value to make sure its within bounds
	function normalize(value) {
		if ( value > 1) {
			value = 1;
		} else if(value < 0) {
			value = 0;
		}
		return value;
	}

	// Round to nearest pixel
	function round(n)
	{
		if (n-(parseInt(n)) >= 0.5) {
			return parseInt(n)+1;
		} else {
			return parseInt(n);
		}
	}

	// Get a cell given the coords. return null if cell doens't exist
	function getCell(x,y,map) {
		if (!map[x]) return null;
		return (map[x][y] || null);
	}

	// Get adjacent cells. Returns a hash or null.
	function getAdjacents(x,y,map,direct,distance) {

		distance = distance || 1;
		direct = direct || false;

		if (!getCell(x,y,map)) return null;

		return {
			t  : getCell(x,y-distance,map),
			tr : direct ? null : getCell(x+distance,y+distance,map),
			r  : getCell(x+distance,y,map),
			br : direct ? null : getCell(x+distance,y+distance,map),
			b  : getCell(x,y+distance,map),
			bl : direct ? null : getCell(x-distance,y+distance,map),
			l  : getCell(x-distance,y,map),
			tl : direct ? null : getCell(x-distance,y-distance,map)
		};

	}

	// Get surrounding cells
	function getSurrounds(x,y,dis) {
		var cells = [];
		
		var dir;
		for (var i = dis; i > 0; i--) {
			var adj = getAdjacents(x,y,map,false,i);
			for (dir in adj) {
				if (adj[dir]) cells.push(adj[dir]);
			}
		}

		return cells;
	}

	// Workhorse of the terrain generation.
	function midpointDisplacment(dimension) {
		var 	newDimension = dimension / 2, 
			top, topRight, topLeft, bottom, bottomLeft, 
			bottomRight, right, left, center,
			i, j;

		if (newDimension > unitSize) {
			for(i = newDimension; i <= mapDimension; i += newDimension){
				for(j = newDimension; j <= mapDimension; j += newDimension){
					x = i - (newDimension / 2);
					y = j - (newDimension / 2);

					topLeft = map[i - newDimension][j - newDimension]; 
					topRight = map[i][j - newDimension];
					bottomLeft = map[i - newDimension][j];
					bottomRight = map[i][j];

					// Center				
					map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
					map[x][y] = normalize(map[x][y]);
					center = map[x][y];	

					// Top
					if(j - (newDimension * 2) + (newDimension / 2) > 0){
						map[x][j - newDimension] = (topLeft + topRight + center + map[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);;
					}else{
						map[x][j - newDimension] = (topLeft + topRight + center) / 3+ displace(dimension);
					}

					map[x][j - newDimension] = normalize(map[x][j - newDimension]);

					// Bottom
					if(j + (newDimension / 2) < mapDimension){
						map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newDimension / 2)]) / 4+ displace(dimension);
					}else{
						map[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
					}

					map[x][j] = normalize(map[x][j]);


					//Right
					if(i + (newDimension / 2) < mapDimension){
						map[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4+ displace(dimension);
					}else{
						map[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
					}

					map[i][y] = normalize(map[i][y]);

					// Left
					if(i - (newDimension * 2) + (newDimension / 2) > 0){
						map[i - newDimension][y] = (topLeft + bottomLeft + center + map[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);;
					}else{
						map[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
					}

					map[i - newDimension][y] = normalize(map[i - newDimension][y]);
				}
			}
			midpointDisplacment(newDimension);
		}
	}

	// Starts off the map generation, seeds the first 4 corners
	function startDisplacement() {
		var x = mapDimension,
			y = mapDimension,
			tr, tl, t, br, bl, b, r, l, center;

		// top left
		map[0][0] = Math.random(1.0);
		tl = map[0][0];

		// bottom left
		map[0][mapDimension] = Math.random(1.0);
		bl = map[0][mapDimension];

		// top right
		map[mapDimension][0] = Math.random(1.0);
		tr = map[mapDimension][0];

		// bottom right
		map[mapDimension][mapDimension] = Math.random(1.0);
		br = map[mapDimension][mapDimension]

		// Center
		map[mapDimension / 2][mapDimension / 2] = map[0][0] + map[0][mapDimension] + map[mapDimension][0] + map[mapDimension][mapDimension] / 4;
		map[mapDimension / 2][mapDimension / 2] = normalize(map[mapDimension / 2][mapDimension / 2]);
		center = map[mapDimension / 2][mapDimension / 2];

		/* Non wrapping terrain */
		map[mapDimension / 2][mapDimension] = bl + br + center / 3;
		map[mapDimension / 2][0] = tl + tr + center / 3;
		map[mapDimension][mapDimension / 2] = tr + br + center / 3;
		map[0][mapDimension / 2] = tl + bl + center / 3;

		// Call displacment 
		midpointDisplacment(mapDimension);
	}
	
	function getTypeFromHeight(height) {
		var i;
		for (i in types) {
			if (height >= types[i]) return i;
		}
		return null;
	}

	// Turn to land / water / mountains
	function generateTerrainTypes() {
		for(var x = 0;x < map.length;x++) {
			for(var y = 0;y < map.length;y++) {
				map[x][y] = getTypeFromHeight(map[x][y]);
			}
		}
	}

	function countTypes(x,y) {
		var i,dir,adj = getAdjacents(x,y,map,true), cell = getCell(x,y,map);
		adj['cell'] = cell;
		var out = {'total':0,'diff':0,'types':{}};
		for (dir in adj) {
			if (!adj[dir]) continue;
			if (!out['types'][adj[dir]]) { 
				out['types'][adj[dir]] = 0;
				out['diff']++;
			}
			out['types'][adj[dir]]++;
			out['total']++;
		}

		return out;
	}

	// Tidy up
	function tidyUp() {
		for(var x = 0;x < map.length;x++) {
			for(var y = 0;y < map.length;y++) {
				var typ = countTypes(x,y);
				if (typ.diff != 2) continue;

				var cell = getCell(x,y,map);
				if (typ.types[cell] > 1) continue;

				for (i in typ.types) {
					if (i == cell) continue;
					map[x][y] = i;
					break;
				}
			}
		}
	}

	// Generate vegitation
	function generateVegitation(out_map) {
		var cell;

		var veg = [];
		for(var x = 0;x < map.length;x++) {
			if (!veg[x]) veg[x] = [];
			for(var y = 0;y < map.length;y++) {
				cell = getCell(x,y,map);
				if (cell != 'L' && cell != 'S') continue;

				var sur = getSurrounds(x,y,5);
				var base = (cell == 'L') ? 0.3 : 0.1;
				var prob = (_.filter(sur,function(val) { return (['L','W'].indexOf(val) != -1); }).length / sur.length) * base;
			
				if (Math.random() <= prob) {
					var typ = null;
					if (prob <= 0.1) {
						typ = 'plant';
					}
					else if (prob <= 0.25) {
						typ = 'bush';
					}
					else {
						if (cell == 'S') { 
							typ = 'bush';
						}
						typ = 'tree';
					}

					out_map.addObject(x,y,{type : typ});
				}
				else if (prob > 0.2 && (Math.random() * 0.5) < prob) {
					out_map.addObject(x,y,{type : 'plant'});	
				}
			}
		}

		return veg;
	}

	// Constructor
	function Generator() {}

	Generator.prototype.generate = function(callback) {
		var out_map = new Map();
	
		async.waterfall([   
			function(callback) {
				map = create2DArray(mapDimension+1, mapDimension+1);
				startDisplacement();
				callback(null,map);
			},
			function(map,callback) {
				generateTerrainTypes();
				callback(null,map);
			},
			function(map,callback) {
				tidyUp();tidyUp();
				callback(null,map);
			},
			function(map,callback) {
				generateVegitation(out_map);

				out_map.setGrid(map);

				callback(null);
			}
		],function(err) {
			callback(out_map);
		});
	}

	var Map = (function() {
	
		var base_grid = [];
		var objects = [];

		function Map() {
			
		}

		Map.prototype.getGrid = function() {
			return base_grid;
		}

		Map.prototype.setGrid = function(grid) {
			base_grid = grid;
		}

		Map.prototype.addObject = function(x,y,data) {
			if (!objects[x]) objects[x] = [];
			objects[x][y] = data;
		}

		Map.prototype.getObjects = function() {
			return objects;
		}

		return Map;
	}()) 

	return Generator;
}());
