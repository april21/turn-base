//GLOBAL VARIABLES
var ctx;
var canvas;
var column = 10;
var row = 10;
var tileSize = 100;
var obstacleAmount = 10;
var mapData = mapConfig();
var tileOnMap = createMap(mapData);
var initialPlayerPosition = {};
var gameStarted = false;
var isGameOver = false;
var limitMoves = 3;
var changingTurn = false;

//MOVEMENTS AND GAME LOOP
window.onload = function() {
  window.addEventListener('keydown', pressArrowKeys, true);
  return setInterval(drawGame, 100); // Game Loop.
}


//STEP 1 - GENERATE MAP
var obstacles = getAllObstacles(tileOnMap);
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

//SETS CANVAS TRIGGERED BY START GAME BUTTON
function drawCanvas() {
  canvas = document.getElementById("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  var context = canvas.getContext("2d");
  context.fillStyle = '#CEBBFC';
  context.fillRect(0,0, 1000, 1000);
  ctx = context; 

  gameStarted = true;
  drawGame();
}

//HIDE START GAME BUTTON TRIGGERED BY START GAME BUTTON
function hideStartButton() {
  console.log(document.getElementById('buttonContainer'));

  document.getElementById('buttonContainer').style.display = "none";
  document.getElementById('playerTurn').style.display ='block';

  document.getElementById('center').style.display ='none';

  document.getElementById('gameLayoutWrapper').style.display ='contents';
}

function gameOver(winnerPlayer) {
  document.getElementById("gameLayoutWrapper").style.display = "none";
  document.getElementById("canvas").style.display = "none";

  document.getElementById('endGame').style.display = "block";
  document.getElementById('winnerImg').src = "img/player" + winnerPlayer.id + "head.png";
  document.getElementById('winnerImg').alt = "Player " + winnerPlayer.id
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

//Game looping every 0.1 sec
function drawGame() {
  if (!gameStarted) {
    return
  }

  if (isGameOver) {
    return
  }
  
  //clear contex.
  ctx.beginPath()
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#CEBBFC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath()

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