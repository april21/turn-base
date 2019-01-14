//GLOBAL VARIABLES
var ctx;
var column = 10;
var row = 10;
var tileSize = 100;
var obstacles = 10;
var tileOnMap = [];
var mapData = [];
var initialPlayerPosition = {};
var gameStarted = false;
var isGameOver = false;
var limitMoves = 3;
var changingTurn = false;

//MOVEMENTS AND GAME LOOP
window.onload = function() {
  window.addEventListener('keydown', pressArrowKeys, true);
  return setInterval(drawGame, 1); // Game Loop.
}

class Tile { 

  constructor (size, type, x,y) {
    this.size = size
    this.type = type
    this.position = {x:x, y:y};
    this.image = new Image()
    this.x = x;
    this.y = y;
  }
  
  draw() {
    // Store positions
    var xPos = this.position.x * this.size
    var yPos = this.position.y * this.size  
    // Draw tile
    if(this.position.x == currentPlayer.currentPos.x && this.position.y == currentPlayer.currentPos.y) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(xPos, yPos, 100, 100);
    } else if (this.type.type == "free") {
        ctx.fillStyle = '#CEBBFC';
        ctx.fillRect(xPos, yPos, 100, 100);
    } else {
    var anImage = this.image
    this.image.onload = function() {
      ctx.drawImage(anImage, xPos, yPos);
    }
    this.image.src = "img/washing_mashine.png"//"https://i.imgur.com/P33f3Vb.png";
    // console.log("tiledraw", this.image, xPos, yPos);
   }       
  }
};

class Player {

  constructor(id, life, initialPos, damage){
    this.id = id
    this.life = life
    this.currentPos = initialPos
    this.damage = damage
    this.weapon = new Weapon(initialPos, 5, "soap")
    this.weapon.isHidden = true
    this.image = new Image()
    this.size = tileSize
    this.isDefending = false

    var xPos = this.currentPos.x * this.size
    var yPos = this.currentPos.y * this.size  
    var anImage = this.image
    this.image.onload = function() {
      if (ctx) { ctx.drawImage(anImage, xPos, yPos); }
    }
    this.image.src = "img/player" + this.id + ".png"  
  }

  draw() {
    // Store positions
    var xPos = this.currentPos.x * this.size
    var yPos = this.currentPos.y * this.size  
       
    ctx.drawImage(this.image, xPos, yPos);
  }

  getTotalDamage() {
    var totalDamage = this.damage
    if (this.weapon != undefined) {
      totalDamage += this.weapon.damage
    }
    return totalDamage
  }
};

class Weapon {

  constructor(initialPos, damage, name){
    this.currentPos = initialPos
    this.name = name
    this.damage = damage
    this.image = new Image()
    this.size = tileSize
    this.isHidden = false

    var xPos = this.currentPos.x * this.size
    var yPos = this.currentPos.y * this.size  
   
    var anImage = this.image
    this.image.onload = function() {
      if (ctx) { ctx.drawImage(anImage, xPos, yPos); }
    }
    this.image.src = "img/" + this.name + ".png"  
  }

  draw() {
    if(this.isHidden) { return }
    // Store positions
    var xPos = this.currentPos.x * this.size
    var yPos = this.currentPos.y * this.size  
   
    ctx.drawImage(this.image, xPos, yPos);    
  }
};

//TILE TYPES
var tileType = {
  0: { name: "free tile", type: "free"},
  1: { name: "washing machine", type: "obstacle"}
}

mapConfig();
createMap();
var obstacles = getAllObstacles()
initialPlayerPosition = getInitialPlayerPosition(obstacles)
var obstaclesPositions = obstacles.map(e => e.position) // get only {x,y} of obstacles

var player1 = new Player("1", 100, initialPlayerPosition.player1, 0);

var player2 = new Player("2", 100, initialPlayerPosition.player2, 0);

var weapons = [new Weapon(initialPlayerPosition.weapons[0], getRamdomInRange(10, 20), "detergent"),
                new Weapon(initialPlayerPosition.weapons[1], getRamdomInRange(20, 30), "coins"),
                new Weapon(initialPlayerPosition.weapons[2], getRamdomInRange(30, 40), "lonely_sock"),
                new Weapon(initialPlayerPosition.weapons[3], getRamdomInRange(40, 50), "dirty_panties")
              ];

var currentPlayer = player1;
var otherPlayer = player2;

function drawCanvas() {
  var canvas = document.getElementById("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  var context = canvas.getContext("2d");
  context.fillStyle = '#CEBBFC';
  context.fillRect(0,0, 1000, 1000);
  ctx = context; 

  gameStarted = true;
  drawGame();
}

//HIDE START GAME BUTTON WHEN CLICKED
function hideStartButton() {
  console.log(document.getElementById('buttonContainer'));

  document.getElementById('buttonContainer').style.display = "none";
  document.getElementById('playerTurn').style.display ='block';

  document.getElementById('center').style.display ='none';

  document.getElementById('gameLayoutWrapper').style.display ='contents';
}



//GET RANDOM 0 OR 1
function getRamdom0_1() {
  var random = Math.floor((Math.random() * 10) % 2); 
  return random;
}

//RANDOM RANGE
function getRamdomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//function for random tiles
function getRandomTileRow() {
  return Math.floor((Math.random() * 10) % row);
}
//function for random tiles
function getRandomTileColumn() {
  return Math.floor((Math.random() * 10) % column);
}

//CREATION OF MAP
function mapConfig() {

  var obstacleAmount = 10

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

}

function createMap() {
  for (var y = 0; y < column; y++) {
      for (var x = 0; x < row; x++ ) {
        var type = mapData[y][x]
        var tile = new Tile(tileSize, tileType[type], x, y)
        tileOnMap.push(tile)
      }
    }
}

function getAllObstacles() {
    return tileOnMap.filter( element => element.type.type == 'obstacle')
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
      player1 : finalPos.shift(),
      player2 : finalPos.shift(),
      weapons : finalPos
      };
}


// actions: more or attack.
/// Returns true if an action is valid.
/// returns false otherwise
function action(direction) {
  var futurePosition = {x: currentPlayer.currentPos.x, y: currentPlayer.currentPos.y }
  var otherPlayerPosition = otherPlayer.currentPos;

  switch (direction) {
    case 'up':
      futurePosition.y -= 1;
      break;
    case 'down':
      futurePosition.y += 1;
      break;
    case 'left':
      futurePosition.x -= 1;
      break;
    case 'right':
      futurePosition.x += 1;
      break;
    default:
      return false;
  }

  //can move?
  if (futurePosition.x == otherPlayerPosition.x && futurePosition.y == otherPlayerPosition.y) {
    console.log("Is trying to step into the other player", futurePosition);
    return true
  }

  //can move?
  if(!canMoveToPosition(futurePosition, obstaclesPositions)) {
    console.log("Is trying to move to a obstacle position ", futurePosition);
    return false;
  }

  if(!isInsideTheBoard(futurePosition)) {
    console.log("Is trying to move outside the board ", futurePosition);
    return false;
  }

  //move
  currentPlayer.currentPos = futurePosition
  return true;
}

function isInsideTheBoard(aPosition) {

  if (aPosition.x >= 0 && aPosition.x <= column - 1
    && aPosition.y >= 0 && aPosition.y <= row - 1) {
    return true
  }
  alert('You hit a wall player ' + currentPlayer.id);
  return false
}


//Obstacles - i have the dimmedPositions already
//if position is dimmed "return false", if position is weapon "pick up", if position is available "move"

/// If i can move to next position
/// nextPos{x, y} : position to evaluate 
/// dimmedPosition[{x, y}] : unavailable positions
function canMoveToPosition(nextPos, obstaclesPosition) { //what i need to get, it doesnt exist!!!!!!!!!!!!!!
   console.log('canMoveToPosition', nextPos, obstaclesPosition);
  if (obstaclesPosition.some(e => e.x == nextPos.x && e.y == nextPos.y)) {
    // console.log('its dimmed, you cannot move');
    return false;
  }
  return true;

}

/// Weapons - after i move i check if theres a weapon to pick up or not
function weaponTileCheck(weapons, player) {

  var aPosition = player.currentPos
  var aWeapon = weapons.find(e => e.currentPos.x == aPosition.x && e.currentPos.y == aPosition.y)
  if(aWeapon == undefined) {
    return;
  }
  console.log("This tile has a weapon!", aWeapon);
  
  pickUpWeapon(aWeapon, player);

  var anIndex = weapons.indexOf(aWeapon)
  if (anIndex > -1) {
    weapons.splice(anIndex, 1); ///using .splice() to remove the weapon from the array
  }
}

///pick up the weapon
function pickUpWeapon(weapon, player) {
  // console.log("pickUpWeapon");
  if (player.weapon != undefined) {
    weapons.push(player.weapon);
    player.weapon.currentPos = player.currentPos;
    player.weapon.isHidden = false;
  }
  player.weapon = weapon; //instance of the player and weapon object

  weapon.isHidden = true;
}

//Alert fight range
function canFight(currentPlayer, otherPlayer) {
  var currentPlayerPosition = currentPlayer.currentPos;
  var otherPlayerPosition = otherPlayer.currentPos;
  
  if(checkFightRange(currentPlayer, otherPlayer)) {
    return true
  }
  //document.getElementById("text").innerHTML = "";
  return false
}

function checkFightRange(playerA, playerB ) {

  var positionA = playerA.currentPos;
  var positionB = playerB.currentPos;

  if (positionA.x - 1 == positionB.x 
    && positionA.y == positionB.y) {
    return true
  }

  if (positionA.x == positionB.x 
    && positionA.y - 1 == positionB.y) {
    return true
  }

  if (positionA.x == positionB.x 
    && positionA.y + 1 == positionB.y) {
    return true
  }

  if (positionA.x + 1 == positionB.x 
    && positionA.y == positionB.y) {
    return true
  }

  return false
}


function gameOver(winnerPlayer) {
  document.getElementById("gameLayoutWrapper").style.display = "none";
  document.getElementById("canvas").style.display = "none";

  document.getElementById('endGame').style.display = "block";
  document.getElementById('winnerImg').src = "img/player" + winnerPlayer.id + "head.png";
  document.getElementById('winnerImg').alt = "Player " + winnerPlayer.id
}

//player life(100)
//ALERT WINNER
function attack(playerA, playerB) {
  var damage = playerA.getTotalDamage()

  if (playerB.isDefending) {
    damage = damage / 2.0
    playerB.isDefending = false
  }
  playerB.life -= damage

  if (playerB.life <= 0) {
    playerB.hidden = true;
    // window.alert("Player: "  + playerA.id + " win")
    isGameOver = true;
    gameOver(playerA);
  }
}


function defend(aPlayer) {
  aPlayer.isDefending = true
}

//Change player turn
function switchTurn() {
  console.log("change player turn");
  var auxiliarPlayer = currentPlayer;
  currentPlayer = otherPlayer;
  otherPlayer = auxiliarPlayer;
  changingTurn = false;
}

//Event key listener for 
function pressArrowKeys (event) {
  // console.log(event.keyCode);
  if (!gameStarted || changingTurn) { 
    return; 
  }

  let isFightMode = canFight(currentPlayer, otherPlayer);
  console.log("isFightMode: " + isFightMode);
  if (isFightMode) {
    fightMode(event.keyCode)
  }else{
    boardMode(event.keyCode)
  }

  drawGame();
}

function boardMode(keyCode) {

  switch (keyCode) {
    case 38: 
      if(!action('up')) {return;} //If NO action occured dont count it
      break;

    case 40:
      if(!action('down')) {return;}
      break;

    case 37:
      if(!action('left')) {return;}
      break;

    case 39:
      if(!action('right')) {return;}
      break;

    default: //ignoring all other keys.
      alert('Invalid key!');
      console.log(event.keyCode)
      return;
  }


  limitMoves -= 1; //rest 1 to limitMoves
  weaponTileCheck(weapons, currentPlayer);

  if(limitMoves <= 0) {
    // switchTurn()
    //ALLOW THE SCREEN TO REFRESH
    window.setTimeout(switchTurn, 100);
    changingTurn = true;
    limitMoves = 3;
  }
  if (canFight(currentPlayer, otherPlayer)) {
    setTimeout(function(){ alert("To Attack press A, to Defend press D"); }, 100);
    // alert("To Attack press A, to Defend press D");
  }
}

function fightMode(keyCode) {

  if (isGameOver) {
    return
  }

  switch (keyCode) {
    case 65: //a : attack
      attack(currentPlayer, otherPlayer);
      break;
    case 68: //d: defend
      defend(currentPlayer);
      break;
    default: //ignoring all other keys.
      console.log(event.keyCode)
      return;
  }

  switchTurn()
}


//Game looping every 1 sec
function drawGame() {
  if (!gameStarted) {
    return
  }

  if (isGameOver) {
    return
  }

  for (var i = 0; i < tileOnMap.length; i++) {
    let tile = tileOnMap[i]
    tile.draw()
  }

  for (var i = 0; i < weapons.length; i++) {
    let weapon = weapons[i];
    weapon.draw();
  }
  player1.draw()
  player2.draw()

  
  document.getElementById("playerTurn").innerHTML = "CURRENT TURN: PLAYER " + currentPlayer.id;

  document.getElementById("p1stats").innerHTML = "P" + player1.id + " life: " + player1.life;
  document.getElementById("p2stats").innerHTML = "P" + player2.id + " life: " + player2.life;

  document.getElementById("p1weapon").innerHTML = "Weapon: " + player1.weapon.name;
  document.getElementById("p2weapon").innerHTML = "Weapon: " + player2.weapon.name;

  //CHANGE CURRENT IMAGE WEAPON

  document.getElementById("imgWeapon1").src = player1.weapon.image.src
  document.getElementById("imgWeapon2").src = player2.weapon.image.src
}

function callAlerts() {

}