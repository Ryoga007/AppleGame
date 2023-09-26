import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 250

const gameStartDiv=document.querySelector("#gameStartDiv")
const gameStartBtn=document.querySelector("#gameStartBtn")
const gameEndDiv=document.querySelector("#gameEndDiv")
const gameWinLoseSpan=document.querySelector("#gameWinLoseSpan")
const gameEndScoreSpan=document.querySelector("#gameEndScoreSpan")

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed=speedDown + 50;
    this.target;
    this.points = 0
    this.textScore
    this.textTime
    this.timeEvent
    this.remainingTime
    this.coinMusic
    this.bgMusic
    this.emitter
  }

  preload() {
    this.load.image("bg","/assets/bg.png")
    this.load.image("basket","/assets/basket.png")
    this.load.image("apple","/assets/apple.png")
    this.load.image("money","/assets/money.png")
    this.load.audio("coin","/assets/coin.mp3")
    this.load.audio("bgMusic","/assets/bgMusic.mp3")
  }

  create() {
    this.scene.pause("scene-game")

    this.coinMusic=this.sound.add("coin")
    this.bgMusic=this.sound.add("bgMusic")
    this.bgMusic.play()
    this.bgMusic.stop()

    this.add.image(0,0,"bg").setOrigin(0,0);

    this.target= this.physics.add.image(0,0,"apple").setOrigin(0,0);
    this.target.setMaxVelocity(0,speedDown);   //es para estavilizar la velocidad, por que si aceleraria mas y mas

    this.player=this.physics.add.image(0,sizes.height-100,"basket").setOrigin(0,0);
    this.player.setImmovable(true);    //Para que el obejto no se buena por la fisica
    this.player.body.allowGravity=false; //Para que el obejto no se buena por la fisica
    this.player.setCollideWorldBounds(true)  //Especificamente le dice al objeto que no puede salir del borde
    // this.player.setSize(80,15).setOffset(10,70)  //Redimenciona el cuerpo del objeto para la cualicion
    this.player.setSize(this.player.width-this.player.width/4,this.player.height/6).setOffset(this.player.width/10,this.player.height - this.player.height/10);


    this.physics.add.overlap(this.target,this.player,this.targetHit,null,this); //Para detectar una superposicion

    this.cursor=this.input.keyboard.createCursorKeys(); //Asigna las teclas del cursor al objeto cursor

    this.textScore=this.add.text(sizes.width-120,10,"Score:0",{ //Creamos el texto para para el Score
      font:"25px Arial",
      fill: "#000000",
    });
    this.textTime=this.add.text(10,10,"Remaining time: 00",{
      font:"25px Ariel",
      fill:"#000000",
    })

    this.timeEvent=this.time.delayedCall(30000,this.gameOver,[],this)

    this.emitter=this.add.particles(0,0,"money",{
      speed:100,
      gravityY:speedDown-200,
      scale:0.04,
      duration:100,
      emitting:false
    })
    this.emitter.startFollow(this.player,this.player.width / 2,this.player.height / 2,true)
  }

  update() {
    this.remainingTime=this.timeEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)

    if (this.target.y >= sizes.height){ //para qye la manza al llegar al borde vuelva a caer desde el punto 0
      this.target.setY(0)
      this.target.setX(this.getRandomX())  //Cambia la posicion X de manera aleatoria
    }

     const{left,right}=this.cursor;

     if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
     } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
     }else {
      this.player.setVelocityX(0);
     }
  }

  getRandomX(){       //Funcion que permite generar un valor aleatorio
    return Math.floor(Math.random() * 480)
  }

  targetHit(){      //Funcion para las cualiciones
    this.coinMusic.play()
    this.emitter.start()

    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;

    this.textScore.setText(`Score: ${this.points}`) //Cuenta las veces que colicionan
  }

  gameOver(){
    this.sys.game.destroy(true)
    if(this.points >=10){
      gameEndScoreSpan.textContent=this.points
      gameWinLoseSpan.textContent="Win"
    }else {
      gameEndScoreSpan.textContent=this.points
      gameWinLoseSpan.textContent="lose"
    }
    gameEndDiv.style.display="flex"
  }
  
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click",()=>{
  gameStartDiv.style.display="none"
  game.scene.resume("scene-game")
})