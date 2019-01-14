
//TILE TYPES
var tileType = {
  0: { name: "free tile", type: "free"},
  1: { name: "washing machine", type: "obstacle"}
}

//MAP CONFIGURATION
function mapConfig() {
	var mapData = []
	for (var y = 0; y < column; y++) {
		mapData[y] = [];
		for (var x = 0; x < row; x++ ) {
			mapData[y][x] = 0;
		}
	}

	for (var i = 0; i < obstacleAmount; i++) {
		var x = getRandomTileRow()
		var y = getRandomTileColumn()
		mapData[y][x] = 1
	}
	return mapData
}

//CREATION OF TILES
function createMap(mapData) {
	var tileOnMap = []
	for (var y = 0; y < column; y++) {
		for (var x = 0; x < row; x++ ) {
			var type = mapData[y][x]
			var tile = new Tile(tileSize, tileType[type], x, y)
			tileOnMap.push(tile)
		}
	}
	return tileOnMap
}

function getAllObstacles(tileOnMap) {
    return tileOnMap.filter( element => element.type.type == 'obstacle')
}

//RANDOM RANGE
function getRamdomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//RANDOM ROW NUMBER FOR OBSTACLES
function getRandomTileRow() {
  return Math.floor((Math.random() * 10) % row);
}
//RANDOM COLUMN NUMBER FOR OBSTACLES
function getRandomTileColumn() {
  return Math.floor((Math.random() * 10) % column);
}

function isPositionAreaFree(position, occupied) {
    let x = position.x
    let y = position.y
    let combinations = [ 
      {x:x-1, y:y-1}, {x:x, y:y-1}, {x:x+1, y:y-1},
      {x:x-1, y:y}, {x:x, y:y}, {x:x+1, y:y},
      {x:x-1, y:y+1}, {x:x, y:y+1}, {x:x+1, y:y+1}
    ]
    for (var i = 0; i < combinations.length; i++) {
      let posI = combinations[i]
      if (occupied.some(e => e.x == posI.x && e.y == posI.y)) {
        return false
      }
    }
    return true
}

function getInitialPlayerPosition(obstacles) {

    var unAvailable = obstacles.slice(0); // clone array.
    
    var finalPos = []

    for (var i = 0; i < 6; i++) {

    	var randomX = getRandomTileRow();
    	var randomY = getRandomTileColumn();
    	var newPosition = {x: randomX, y: randomY}
    	while( !isPositionAreaFree(newPosition, unAvailable) ) {
    		randomX = getRandomTileRow();
    		randomY = getRandomTileColumn();

    		newPosition = {x: randomX, y: randomY} 
    	}

    	finalPos.push(newPosition)
    	unAvailable.push(newPosition)
    }

    return {
      player1 : finalPos.shift(), //shift removes 1 and returns it
      player2 : finalPos.shift(),
      weapons : finalPos
  };
}