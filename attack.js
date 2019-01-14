///STEP 3 - FIGHT
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
