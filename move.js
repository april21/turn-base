

//STEP 2 - MOVEMENTS
// actions: more or attack.
/// Returns true if an movement is valid.
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

  //can move? - VERSION 1: ATTACKED ON THE DIRECTION OF THE OTHER PLAYER
  // if (futurePosition.x == otherPlayerPosition.x && futurePosition.y == otherPlayerPosition.y) {
  //   console.log("Is trying to step into the other player", futurePosition);
  //   return true 
  // }

  //can move?
  if(!canMoveToPosition(futurePosition, obstaclesPositions)) {
    console.log("Is trying to move to a obstacle position ", futurePosition);
    return false;
  }

  //can move?
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
function canMoveToPosition(nextPos, obstaclesPosition) { //what i need to get
   //console.log('canMoveToPosition', nextPos, obstaclesPosition);
  if (obstaclesPosition.some(e => e.x == nextPos.x && e.y == nextPos.y)) {
    // console.log('its dimmed, you cannot move');
    return false;
  }
  return true;

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


// Weapons - after i move i check if theres a weapon to pick up or not
function weaponTileCheck(weapons, player) {

  var aPosition = player.currentPos
  var aWeapon = weapons.find(e => e.currentPos.x == aPosition.x && e.currentPos.y == aPosition.y)
  if(aWeapon == undefined) { //if theres no weapon dont do anything
    return;
  }
  console.log("This tile has a weapon!", aWeapon);
  
  pickUpWeapon(aWeapon, player);

  var anIndex = weapons.indexOf(aWeapon)
  if (anIndex > -1) {
    weapons.splice(anIndex, 1); ///using .splice() to remove the weapon from the array
  }
}

//pick up the weapon
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

function canFight(currentPlayer, otherPlayer) {
  var currentPlayerPosition = currentPlayer.currentPos;
  var otherPlayerPosition = otherPlayer.currentPos;
  
  if(checkFightRange(currentPlayer, otherPlayer)) {
    return true
  }
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
