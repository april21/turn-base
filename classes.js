
//CLASSES FOR TILE, WEAPON AND PLAYER
class Tile { 

  constructor (size, type, x,y) {
    this.size = size
    this.type = type
    this.position = {x:x, y:y};
    this.image = new Image()
    this.x = x;
    this.y = y;
    var xPos = this.position.x * this.size
    var yPos = this.position.y * this.size 
    var anImage = this.image
    this.image.onload = function() {
       if (ctx) { ctx.drawImage(anImage, xPos, yPos) }
    }
    this.image.src = "img/washing_mashine.png"
  }
  
  draw() {
    // Store positions
    var xPos = this.position.x * this.size
    var yPos = this.position.y * this.size  
    
    ctx.beginPath();
    // Draw tile
    if(this.position.x == currentPlayer.currentPos.x && this.position.y == currentPlayer.currentPos.y) {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(xPos, yPos, 100, 100);
    } else if (this.type.type == "free") {
      
      ctx.fillStyle = '#CEBBFC';
      ctx.fillRect(xPos, yPos, 100, 100);
      
      ctx.rect(xPos,yPos,this.size,this.size);
      ctx.strokeStyle = '#6A34AE';
      ctx.stroke();
    } else {
      ctx.drawImage(this.image, xPos, yPos);
    } 

    ctx.closePath();
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