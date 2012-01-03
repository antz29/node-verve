//var Verve = require('./lib/verve.js');
//var v = new Verve();

var Gen = require('./lib/generator.js');
var colors = require('colors');

var g = new Gen();

g.generate(function(omap) {
	
	map = omap.getGrid();

	for(var x = 0;x < map.length;x++) {
		var row = "";
		for(var y = 0;y < map[x].length;y++) {
			switch (map[x][y]) {
				case 'W':
					row += 'x'.blue;
					break;
				case 'L':
					row += 'x'.green;	
					break;
				case 'S':
					row += 'x'.yellow;	
					break;
				case 'R':
					row += 'x'.grey;	
					break;
				case 'I':
					row += 'x'.white;	
					break;

			}		
		}
		console.log(row);
	}

	map = omap.getObjects();

	for(var x = 0;x < map.length;x++) {
		var row = "";
		for(var y = 0;y < map[x].length;y++) {
			if (!map[x] || !map[x][y]) {
				row += 'x'.black;
			}
			else if (map[x][y].type == 'tree') {
				row += 'x'.green;
			}
			else if (map[x][y].type == 'bush') {
				row += 'x'.yellow;
			}
			else if (map[x][y].type == 'plant') {
				row += 'x'.grey;
			}	
		}
		console.log(row);
	}
	
	console.log('done');

});

