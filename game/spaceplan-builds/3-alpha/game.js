const CURRENT_CHAPTER = "Production";
const chapter = 13;
const xpbonus = 0;

let starbonus = 0;  


const badge1 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 
const badge2 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 
const badge3 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 
const badge4 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 

const leveluppopup = document.getElementById("leveluppopup");

 

// script to focus on the right target area when new content is displayed at the bottom of the page

document.querySelectorAll(".toggle-button").forEach(button => {
    button.addEventListener("click", function () {
        const content = document.querySelector(this.getAttribute("data-target"));
  
        var buttons = document.getElementsByClassName('btn-warning')[0]; // Select all elements with the class 'btn-warning'     
        var buttons = document.getElementsByClassName('btn-primary')[0]; // Select all elements with the class 'btn-warning'     
        var buttons = document.getElementsByClassName('ButtonNext1')[0]; // Select all elements with the class 'btn-warning'     
        var buttons = document.getElementsByClassName('ButtonNext')[0]; // Select all elements with the class 'btn-warning'     
  
                // Add a small delay before adjusting the position slightly up
              setTimeout(() => {
                  window.scrollBy(0, 180); // Adjust this value to fine-tune the offset
               }, 220);
     
    });
  });
  
  
 
  
 // Recap block:
 document.querySelectorAll('.recapHeader').forEach(header => {
  header.addEventListener('click', () => {
    const block = header.closest('.recapBlock');
    if (!block) return; // 🔒 safety guard
    block.classList.toggle('open');
  });
});




  
// to manage left side menu height to bottom

(function () {
  const sidebar = document.querySelector('.containerLeftBar');
  const footer = document.querySelector('footer'); // adjust selector if different
  const headerOffset = 89; // px, same as your top value

  if (!sidebar || !footer) return;

  function updateSidebarHeight() {
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Distance from top of viewport to footer top
    const footerTop = footerRect.top;

    if (footerTop >= viewportHeight) {
      // Footer is below viewport bottom -> sidebar should use full viewport height (minus header)
      sidebar.style.maxHeight = (viewportHeight - headerOffset) + 'px';
    } else {
      // Footer is visible (or above bottom) -> compute available space before footer
      // footerTop is number of pixels from viewport top to footer top
      // available space for sidebar starting at headerOffset:
      const available = Math.max(0, footerTop - headerOffset);
      sidebar.style.maxHeight = available + 'px';
    }
  }

  // Run on load, resize and scroll (debounce for perf)
  let timer = null;
  function scheduleUpdate() {
    if (timer) cancelAnimationFrame(timer);
    timer = requestAnimationFrame(updateSidebarHeight);
  }

  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('scroll', scheduleUpdate);
  // initial run
  updateSidebarHeight();
})();




  

// roadmap on top UI
// timeline

const startCircle = document.getElementById("timeline3-center");
const timelineContent = document.querySelector(".timeline3-content");

startCircle.addEventListener("click", () => {
  timelineContent.classList.toggle("collapsed");
});




// document.body.style.overflow = "hidden";

    
const starA = document.getElementById("starA");

const missions = document.getElementById("missions");

const restart = document.getElementById("restart");
const youwon = document.getElementById("youwon");
const congrats = document.getElementById("congrats");

const congratsG = document.getElementById("congratsG");
const bravo = document.getElementById("bravo");

const reward = document.getElementById("reward");
const youlose = document.getElementById("youlose");
const youwonUI = document.getElementById("youwonUI");

// selection panel





// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){

  //  window.location = "#toppage_section"; // show top page section
   
    resetGame();
//    initializeGame();

    setTimeout(() => {
       location.reload();      // reload the page
     }, 320)
   
}
)



// document.addEventListener("DOMContentLoaded", function(event) {
    // Scroll to the top of the page
//    window.scrollTo(0, 0);
// });


// const canvas = document.getElementById("canvas")
const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const toolbar = document.getElementById('toolbar');
const toolbox = document.getElementById('toolbox');


const scoreEl = document.querySelector("#scoreEl")
const shield = document.querySelector("#shield")

const shiplog = document.querySelector("#shiplog")
const scorelog = document.querySelector("#scorelog")

const alienwaveslog = document.querySelector("#alienwaveslog")
const shieldsusedlog = document.querySelector("#shieldsusedlog")

const containerShipSelection = document.getElementById("containerShipSelection");

// const starbonus = document.querySelector("#starbonus")


const back2chapters = document.getElementById("back2chapters");


// Create a linear gradient
// The start gradient point is at x=15, y=10
// The end gradient point is at x=770, y=580
const gradient = c.createLinearGradient(15, 10, 770, 580);


// countdown images
const ONE_IMG = new Image();
ONE_IMG.src = "../../../assets/img/games/countdown/one.png";

const TWO_IMG = new Image();
TWO_IMG.src = "../../../assets/img/games/countdown/two.png";

const THREE_IMG = new Image();
THREE_IMG.src = "../../../assets/img/games/countdown/three.png";


// Add 2 color stops
gradient.addColorStop(0, "#0e0a8cf7");
gradient.addColorStop(1, "black");

canvas.width = 882
canvas.height = 600


let gameOn = false;

let gameStarted = false; 
let enoughcards = true;

let selectedShipType = 0;
let selectedAlienType = 0;

let SHIELD = 0;
let shieldsused = 0;
let alienwaves = 0;

let gridcount = 1;      
let AlienGrids = 4;   // init: 4
let AlienGridsAlpha = 10;   // init: 4

let check = 0;


// ships selection menu toggle  

var buttons = document.getElementsByClassName("form-check-input");
var arr = [...buttons];

arr.forEach((element, index) => {
  element.addEventListener("click", () => {
    element.style.opacity = "1";
   
   
    // Adjusted conditions to match array indices  
    if (index == 0) {
        selectedShipType =0;
        SHIELD = 0;
        shiplog.innerHTML = 0; 
      
    } else if (index == 1) {
        selectedShipType =1;  
        SHIELD = 1; 
        shiplog.innerHTML = 1; 

    } else if (index == 2) {
        selectedShipType =2;
        SHIELD = 2;
        shiplog.innerHTML = 2; 
    }
   
    else if (index == 3) {
        selectedShipType =3;  
        SHIELD = 3;
        shiplog.innerHTML = 3; 
            
    } else if (index == 4) {
        selectedShipType =4;  
        SHIELD = 4;
        shiplog.innerHTML = 4; 
    } 
   
    
    // Create a new instance of Player with the selected ship type
      const player = new Player(selectedShipType);

    arr
      .filter(function (item) {
        return item != element;
      })
      .forEach((item) => {
        item.style.opacity = "0";
      });


  });
});




class Player {

   constructor(selectedShipType) {

     this.shiptype = selectedShipType || 0; // Set a default value if not provided
    
     this.velocity = {
        x: 0,
        y: 0
       }

       this.loadImage();

    }


       loadImage() {

        const image = new Image()
    
        if (this.shiptype ==  0) {
            image.src = "../../../assets/img/spaceships/spaceship00.png"
        }


        else if (this.shiptype ==  1) {
         image.src = "../../../assets/img/spaceships/spaceship01PH.png";

         }

         

        else if (this.shiptype == 2) {
        image.src = "../../../assets/img/spaceships/spaceship02PH.png";
      
        }


        else if (this.shiptype == 3) {
            image.src = "../../../assets/img/spaceships/spaceship03PH.png"
            }

       

        else if (this.shiptype == 4) {
            image.src = "../../../assets/img/spaceships/spaceship04PH.png"
            }
        
         image.onload = () => {
             const scale = 0.21
             this.image = image
             this.width = image.width * scale
             this.height = image.height * scale

             this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 11
            }
          
        this.opacity = 1

         }; 

    }

    
  draw() {
    
    c. save();
    c.globalAlpha = this.opacity;
   
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    c.restore();
  }
   


update() {
  
    if (this.image) {
        this.draw()
        this.position.x += this.velocity.x;
        }

}
 
}



const alien = {
    color: "#04ec3e", // Default color
    shape: "shape00" // Default shape
};

const colorButtons = document.querySelectorAll('.colorOption');
const shapeButtons = document.querySelectorAll('.shapeOption');

// Function to set the selected color
function setSelectedColor(color) {
    alien.color = color;
    console.log('Selected color:', color);
    updateAlienImage();
}

// Function to set the selected shape
function setSelectedShape(shape) {
    alien.shape = shape;
    console.log('Selected shape:', shape);
    updateAlienImage();
}

// Event listener for color buttons to set the selected color
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedColor = button.getAttribute('data-color');
        setSelectedColor(selectedColor);
    });
});

// Event listener for shape buttons to set the selected shape
shapeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedShape = button.getAttribute('data-shape');
        setSelectedShape(selectedShape);
    });
});



  let imageSrc;
  imageSrc = "../../../assets/img/invaders/invaderdesign-SP0.png";

  let particleColor;
  particleColor ="#04ec3e";


// Function to update the alien image based on color and shape
 function updateAlienImage() {
  
    switch (alien.color) {
        case "#04ec3e":
            imageSrc = "../../../assets/img/invaders/invader-SP00-";
            particleColor="#04ec3e";
            break;
        case "#ff6200":
            imageSrc = "../../../assets/img/invaders/invader-SP01-";
            particleColor="#ff6200";
            break;
        case "#ff06b4":
            imageSrc = "../../../assets/img/invaders/invader-SP02-";
            particleColor="#ff06b4";
            break;
        default:
            // Default image source in case alienColor doesn't match any predefined colors
            imageSrc = "../../../assets/img/invaders/default-invaderdesign.png";
    }

    imageSrc += alien.shape + ".png";

    // Now you can use imageSrc to update your alien image
    console.log("Updated alien image:", imageSrc);
 }




class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 5
    }

  

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'rgb(252, 220, 56)'
        c.fill()
        c.closePath()
    }

    
// to add in pre-pro to differentiate alien missile vs ship missile
// class InvaderProjectile {

//        this.width = 5
//        this.height = 11
//    }

//    draw() {
//        c.beginPath()
//        c.fillRect(this.position.x, this.position.y, this.width, this.height)
//        c.fillStyle = 'white'
//        c.fill()
//        c.closePath()

       // c.restore()
//    }

 
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
 

 }



class Invader {

    constructor({ position }) {

       //  this.position = {
       //        x: position.x,
       //        y: position.y
       //    }
 
         this.velocity = {
             x: 0,
             y: 0
           };

                      
         this.imageLoaded = false; // Flag to track image loading
 
     
    
         // Load the image
         this.image = new Image();
         this.image.src = imageSrc;
         this.image.onload = () => {
             const scale = 0.11
            // this.image = image
             this.width = this.image.width * scale
             this.height = this.image.height * scale

            // Initialize position after image is loaded
             this.position = {
               x: position.x,              //  canvas.width / 2 - this.width / 2,
               y: position.y,                         // canvas.height /2 
            };

            // Set imageLoaded to true when image is loaded
           this.imageLoaded = true;

         };

         // this.width = 60
         // this.height = 60
  
        // this.radius = 16  // alien radius    
 
     }
 
 draw() {
     
    // body circle
  //  c.fillStyle = 'rgb(4, 236, 62)'
  //  c.beginPath();
  //  c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
  //  c.fill();
  //  c.closePath()


    //Antena left
  //  c.beginPath()
  //  c.fillRect(this.position.x-this.radius-4, this.position.y-this.radius, 6, this.radius*2)
  //  c.fillStyle = 'rgb(4, 236, 62)'
  //  c.fill()

    //Antena right
 //  c.beginPath()
 //   c.fillRect(this.position.x+this.radius-2, this.position.y-this.radius, 6, this.radius*2)
 //   c.fillStyle = 'rgb(4, 236, 62)'
 //   c.fill()

  if (this.imageLoaded) {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }
 }
    
 
 update( { velocity }) {
     if (this.imageLoaded) {
     this.draw();
     this.position.x += velocity.x;
     this.position.y += velocity.y;
    }
 }
  

 shoot(invaderProjectiles) {

  //  setTimeout(() => {
 
           
    invaderProjectiles.push(
        new InvaderProjectile({
          position: {
            x: this.position.x + this.width / 2,  // + this.width / 2 (when we switch to image in prod)
            y: this.position.y + this.height // this.radius // + this.height (when we switch to image in prod)
        },
        velocity: {
            x: 0,
            y: 3.6 //init:5
        }

        }))
   //  }, 3000)
 }
}




function initializeGame() {
 
    var ButtonNext1 = document.getElementsByClassName('ButtonNext1')[0]; // Select the first element with the class 'NuttonNext'
    ButtonNext1.disabled = true; // Disable the button with the class 'ButtonNext'

     gameOn = true;              
     runGameSimulation();
   
   //  youwonUI.style.display = "none";
     youlose.style.display = "none";
   //  toolbox.style.display = "block";
   
     
setTimeout(() => {
    info.style.display = "block";      // display playtest results
  }, 5000)


}



function runGameSimulation() {


// countdown

let gamecount3 = false;
let gamecount2 = false;
let gamecount1 = false;


setTimeout(() => {
    gamecount3 = false;
    gamecount2 = false
    }, 200)


setTimeout(() => {
        gamecount2 = false;
        gamecount1 = false
        }, 500)


setTimeout(() => {
   gamecount3 = false;
   gamecount2 = false;
   gamecount1 = false
   }, 800)
    

// SHOW GAME START 3 2 1

function start() {
  if (gamecount3) {
        showGameStart(THREE_IMG, canvas.width-486, 138); 
    }  

  if (gamecount2) {
        showGameStart(TWO_IMG, canvas.width-486, 138); 
    }  

  if (gamecount1) {
        showGameStart(ONE_IMG, canvas.width-486, 138); 
    }  

}



setTimeout(() => {
   gameStarted = true
   }, 2200)





class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'rgb(255, 255, 115)'
        c.fill()
        c.closePath()
    }

 //       this.width = 4
   //     this.height = 8
  //  }

  //  draw() {
  //      c.beginPath()
  //      c.fillRect(this.position.x, this.position.y, this.width, this.height)
  //      c.fillStyle = 'white'
   //     c.fill()
      //  c.closePath()
  //  }


    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}


// a ajouter en pre-pro - explosions
class Particle {
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle =  this.color;
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades) this.opacity -= 0.01
    }

}


// to change with below in pre-pro to differentiate projectiles



// add here Class InvaderProjectile 



// add here colo selection functions and variables
    


 
// colorButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const selectedColor = button.getAttribute('data-color');
//     applyColor(selectedColor);
//   });
// });
  
//// add here class invader




///

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders =[]

        const columns = Math.floor(Math.random() * 4 + 8)   // was * 3 + 8
        const rows = Math.floor(Math.random() * 3 + 4)        // was *2 + 4

        this.width = columns * 60

        for (let x=0; x<columns; x++) {
            for (let y=0; y<rows; y++) {   
            this.invaders.push(
                new Invader({
                    position: {
                        x: x * 60 + 14,
                        y: y * 60 + 14
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width  >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x

                this.velocity.y = 22
            
            /*
            if (score < 10000) {
                this.velocity.y = 10
            }
            
            else if (score >= 10000 && score < 20000) {
                this.velocity.y = 20
            }

            else if (score >= 20000 && score < 30000) {
                this.velocity.y = 30
            }

            else {
                this.velocity.y = 40
            }
                */

         }
    }

}




const player = new Player(selectedShipType)

const projectiles = []

const grids = [] // enlever new Grid quand on active les waves et frames

const invaderProjectiles = []

const particles = []   // à ajouter en pre-pro 


const keys = {
   LeftArrow: {
       pressed: false
    },
   RightArrow: {
        pressed: false
    },
   space: {
        pressed: false
    },
}

 // player.draw()


let frames = 0
// to add in prod for waves of aliens

let randomInterval = Math.floor(Math.random() * 500 + 600)     // init: * 700 + 1000
let game = {
    over: false,
    active: true
}

let score = 0
let won = false
let gridskilled = 0;



// adding stars as particles to the background - in prod

   for (let i = 0; i < 110; i++) {
       particles.push(
         new Particle({
            position: {
               x: Math.random()*canvas.width,
               y: Math.random()*canvas.height
            },
            velocity: {
               x: 0,
               y: 0.04,
              },
            radius: 1.2,  
          //  radius: Math.random() * 2,
            color: 'white',
           
             }))
    }


 

// to enable in pre-pro with particles
function createParticles({object, color, fades}) {
      for (let i = 0; i < 18; i++) {
         particles.push(
           new Particle({
              position: {
                 x: object.position.x + object.width / 2, // + object.width / 2,  (to add in prod when invader & ships are an image)
                 y: object.position.y + object.height / 2 // + object.height / 2  (to add in prod when invader & ship are an image)
              },
              velocity: {
                 x: (Math.random() - 0.5) *2,
                 y: (Math.random() - 0.5) *2
                },
              radius: Math.random() * 5,
              color: color || 'rgb(255, 255, 153)',    // init  green'rgb(4, 236, 62)'   orange: 'rgb(250, 127, 32)'
              fades: true
    
               }))
           }
  }


  
// show game start 3 2 1 
function showGameStart(img, imgX, imgY){      
    // draw image
    c.drawImage(img, imgX, imgY, width = 100, height = 142);
    
}





function animate() {
    
    if (!gameOn) return

    if (!game.active) return


      
    c.fillStyle = gradient;
    c.fillRect(0, 0 , canvas.width, canvas.height)
    
    shield.innerHTML = SHIELD;
    shieldsusedlog.innerHTML = shieldsused; 

     start();
     requestAnimationFrame(animate)


  // to enable for particles explosions aliens and ship in pre-pro
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }


        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })
 
    player.update()
  
  

    // removing projectile for memory
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.radius >= canvas.height  // 
            ) {   
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()


        // projectile hit player
        if (
            invaderProjectile.position.y + invaderProjectile.radius >=   // 
            player.position.y + 26 && invaderProjectile.position.x + invaderProjectile.radius >= player.position.x + 8 &&   // 
            invaderProjectile.position.x - invaderProjectile.radius <= player.position.x + player.width - 8
            ) {
                

               if (SHIELD >= 1) {

              
                SHIELD--;

                shieldsused +=1;

                
                               
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0.04

                }, 0)

                createParticles({
                    object: player,
                    color: 'white',
                    fades: true
                })

                setTimeout(() => {
                                     
                    player.opacity = 0.16

                }, 80)

                setTimeout(() => {
                                     
                    player.opacity = 0.24

                }, 300)

                setTimeout(() => {
                                     
                    player.opacity = 1

                }, 660)
                
                }

                else if (SHIELD <= 1) {

                  

                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                     // init: not here, added in prod to avoid particles bugs 
                }, 0)                 // init 0

                // lose condition - in pre-pro
                setTimeout(() => {
                    game.active = false
                    showYouLose()
                  //  gameOn = false  
                }, 1100)                    // init: 1300 added in prod to avoid bugs in prod

                
                createParticles({
                    object: player,
                    color: 'yellow',
                    fades: true
                })
            }
           
            }      


})

    // removing projectile for memory reasons
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <=0) {    // changing to  + projectile.radius according to type
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    
    grids.forEach((grid, gridIndex) => {
        grid.update()

       // console.log(gridIndex)

    // spawn alien projectiles
        

    setTimeout(() => {      

    if (frames % 100 === 0 && grid.invaders.length >= 1 && gameStarted) {
        grid.invaders[Math.floor(Math.random() * (grid.invaders.length))].shoot(      // init: * (grid.invaders.length-1)
        invaderProjectiles
        )
     } 

    }, 3000)   // init: 3800 time added to make the testing easier in prod
  
    grid.invaders.forEach((invader, i) => {  
        invader.update( {velocity: grid.velocity} )



       if (gameStarted) {




       // loose condition if invader collides player


  
       if (grid.invaders.length >= 1) {

        grid.invaders.forEach((invader, k) => {

            
        if (
            invader.position.y + invader.height >=
            player.position.y + 2 && invader.position.x + invader.width >= player.position.x + 4 &&   // change invaderProjectile.radius to invaderProjectile.width when changing projectile style in pre-pro
            invader.position.x <= player.position.x + player.width - 4
            ) {

                                       
                setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                            )
                                           

                if (invaderFound) {   

                
                setTimeout(() => {
                    player.opacity = 0
                    game.over = true
                }, 0)

                // loose condition
                setTimeout(() => {
                    game.active = false
                    showYouLose()

                }, 1100)
                
          //      createParticles({        //bug introduced intentionnaly
          //          object: player,
          //          color: 'FFFF82', 
          //          fades: true
          //      })
                                 
                createParticles({
                          object: invader,
                          color: particleColor, 
                          fades: true
                }) 

                 // remove invader
                          grid.invaders.splice(i, 1)
                        
                }    

                }, 0)
            }
       })
       
      }




   // win condition

   
    if (grid.invaders.length <= 0) {
        gridskilled = gridskilled + 1;    
        alienwaves = alienwaves +1; 
        alienwaveslog.innerHTML = alienwaves;
        
        won = true;
       showYouWin()
     
       setTimeout(() => {
        game.over = true
     }, 0)

     setTimeout(() => {
         game.active = false
     }, 1000)

     } 


   if (grid.invaders.length > 1) {

            //projectiles hit Alien

       //     projectiles.forEach((projectile, j) => {
       //         if (projectile.position.y <=
       //             invader.position.y + Math.sqrt(invader.radius * invader.radius/2) -2 && projectile.position.x >=
       //             invader.position.x - Math.sqrt(invader.radius * invader.radius/2) + 2 && projectile.position.x <=
       //             invader.position.x + Math.sqrt(invader.radius * invader.radius/2) - 2 && projectile.position.y >=
       //             invader.position.y - Math.sqrt(invader.radius * invader.radius/2) + 2
       //             ) 
     

                   // correct collision detection code apres playtest - prepro:     
                    projectiles.forEach((projectile, j) => {
                       if (projectile.position.y - projectile.radius <=               // if radius: projectile.position.y - projectile.radius
                              invader.position.y + invader.height && projectile.position.x + projectile.radius >=    //  if radius: + projectile.radius instead of width  & invader height when image
                              invader.position.x && projectile.position.x - projectile.radius <=    // - projectile.radius if ball  & invader widh /2 when image
                              invader.position.x + invader.width && projectile.position.y + projectile.radius >=   // + projectile.radius  & invader widh when image
                              invader.position.y                                         // + projectile radius  - a ajuster aussi si image
                              ) 
                              
                              { 
                    
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                            )

                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                            )

                            
                            if (invaderFound && projectileFound) {  
                                                         
                                score += 100;
                                scoreEl.innerHTML = score
                                scorelog.innerHTML = score 

                           // to enable in pre-pro with particles
                               createParticles({
                                object: invader,
                                color: particleColor, 
                                fades: true
                                }
                               ) 

                              // remove invader and projectile
                              grid.invaders.splice(i, 1)
                              projectiles.splice(j, 1)


 // reducing grid width when invaders are shot on the side so that they reach the frame - for Pre-Pro
          const firstInvader = grid.invaders[0]
          const lastInvader = grid.invaders[grid.invaders.length - 1]

          grid.width = lastInvader.position.x - firstInvader.position.x + invader.width + 2
          grid.position.x = firstInvader.position.x 


                              }
                        }, 0)
  

                    }
                })
            }


                              // reducing grid width when invaders are shot on the side so that they reach the frame - for Pre-Pro
                              // if (grid.invaders.length > 1) {
                              //      const firstInvader = grid.invaders[0]
                              //      const lastInvader = grid.invaders[grid.invaders.length - 1]
                          
                              //     grid.width = lastInvader.position.x - firstInvader.position.x + invader.radius * 2 + 2
                              //      grid.position.x = firstInvader.position.x - invader.radius
                              // }


        // win condition if last invader shot

         if (grid.invaders.length == 1) {

         projectiles.forEach((projectile, j) => {
            if (projectile.position.y - projectile.radius <=        // if radius: projectile.position.y - projectile.radius
            invader.position.y + invader.height && projectile.position.x + projectile.radius >=    //  if radius: + projectile.radius instead of width
            invader.position.x && projectile.position.x - projectile.radius <=    // - projectile.radius if ball
            invader.position.x + invader.width && projectile.position.y + projectile.radius >=   // + projectile.radius
            invader.position.y ) 
                                    
                        {                                         
                                        setTimeout(() => {
                                            const invaderFound = grid.invaders.find(
                                                (invader2) => invader2 === invader
                                                )
                    
                                            const projectileFound = projectiles.find(
                                                (projectile2) => projectile2 === projectile
                                                )
                    
                                                
                                                if (invaderFound && projectileFound) {   

                                                    score += 100;                                                                                                                      
                                                    scoreEl.innerHTML = score
                                                    scorelog.innerHTML = score
                    
                                               // to enable in pre-pro with particles
                                                   createParticles({
                                                    object: invader,
                                                    color: particleColor, 
                                                    fades: true
                                                    }
                                                   ) 
                    
                                                  // remove invader and projectile
                                                  grid.invaders.splice(i, 1)
                                                  projectiles.splice(j, 1)
                    
                                       
                                       gridskilled = gridskilled + 1;  

                                       alienwaves = alienwaves +1; 
                                       alienwaveslog.innerHTML = alienwaves;

                                       check = 1;
                                                                        
                                       
                                       if (gridskilled >= AlienGridsAlpha) {

                                       won = true;
                                       showYouWin()
                                     
                                       setTimeout(() => {
                                       game.over = true
                                    }, 0)
                                
                                       setTimeout(() => {
                                       game.active = false
                                    }, 1300)     // init 1300
                                     }
                                }
                            }, 0)

                        }
            })
        }


        if (grid.invaders.length < 1) {
            grids.splice(gridIndex, 1)
        }

}

})

})  


    if (keys.LeftArrow.pressed && player.position.x >= 4) {
        player.velocity.x = -7
    } else if (keys.RightArrow.pressed && player.position.x + player.width +4 <= canvas.width) {
        player.velocity.x = 7
    }
    else {
        player.velocity.x = 0
    }



// spawning enemies

   // number of waves or aliens: 

   if (gameStarted) {
    
    // init:  si on veut spawn plusieurs gilles:

      

    if (frames % randomInterval === 0 && gridcount <= AlienGridsAlpha ) {
        console.log(gridcount)
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 390 + 550)    // init: 550 et 600
        frames = 0;
        gridcount += 1; 
      
     }


  
    // si on veut une seule grille:

   // if (frames % randomInterval === 0) {
   //     grids.push(new Grid())
   //     randomInterval = Math.floor(Math.random() * 600 + 800)  // to make it so long there is no new grid
   //     frames = 0       
   // }
   
    frames++

}
 
}

animate()



var fireBullet = 0;


addEventListener('keydown', function(event) {
    event.preventDefault();
    const key = event.key;
   

    if (game.over) return

    switch (key) {
        case "ArrowLeft":
          
        // player.velocity.x = -5
             keys.LeftArrow.pressed = true
            break

        case "ArrowRight":
            keys.RightArrow.pressed = true
           break

        case ' '        :

        if (!keys.repeat && !keys.space.pressed) {


      // shoot de plusieurs positions - en prod

     //   projectiles.push(new Projectile({
     //           position: {
     //               x: player.position.x - 32,
     //               y: player.position.y - 32
     //           },
     //           velocity: {
     //               x: 0,
     //               y: -4
     //           }
     //        }))

            fireBullet++;
            keys.space.pressed = true;
        }

                    
             break

    }

})


////////////

window.requestAnimationFrame(gameLoop);


function gameLoop() {

    while (fireBullet) {
        
        if (selectedShipType == 4) {

            //center left
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 - 4,
                    y: player.position.y - 2
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))

              //center right
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 + 4,
                    y: player.position.y - 2
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
            
             //left
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 - 29,
                    y: player.position.y + 6
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
    
             //right
             projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 + 29,
                    y: player.position.y + 6
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
    
         }



        else if (selectedShipType == 3) {

            
            //center
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y - 2
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
            
             //left
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 - 29,   // init -33
                    y: player.position.y + 52    // init 32
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
    
             //right
             projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 + 29,     // init + 33
                    y: player.position.y + 52     // init 32
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
    
         }


        else if (selectedShipType == 2) {        
       
            
            //left
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 - 29,   // init -25
                    y: player.position.y +  52    // init 13
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
    
             //right
             projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 + 29,   // init +25
                    y: player.position.y + 52      // init 13
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))

        }
       
             
         else {

            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y - 2
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
            }



        fireBullet--;
    }
    window.requestAnimationFrame(gameLoop);
}


addEventListener('keyup', function(event) {
    event.preventDefault();
    const key = event.key;
    switch (key) {
        case "ArrowLeft":
            keys.LeftArrow.pressed = false
            break

        case "ArrowRight":
            keys.RightArrow.pressed = false
           break

        case ' ':
             keys.space.pressed = false
             break

    }

})


 }


 
function resetGame() {
    gameOn = false;
 //   var P = document.getElementById("myBtnP");
 //   var V = document.getElementById("myBtnV");
 //   P.style.backgroundColor= '#00A9f0'
 //   V.style.backgroundColor= '#D3D3D3';
 //   P.value="ON";
 //   V.value="OFF";
        
 //   toolbox.style.display = "none";
 //   buttonTiming1 = true;
 //   buttonTiming2 = false;
      
    youlose.style.display = "none";
  
  //  SectionName0.style.display = "none";
 }



// SHOW YOU WIN - Game
function showYouWin(){
    youwon.style.display = "block";
    congrats.style.display = "block";
}


const info = document.getElementById("info");


// SHOW YOU LOSE
function showYouLose(){
    restart.style.display = "block";
    youlose.style.display = "block";
    info.style.display = "block";
 //   insights.style.display = "block";

}



// show and hide apres tuning values
    
 function ShowAndHide() {
    var x = document.getElementById('SectionName1');
    var y = document.getElementById('SectionName0');

    if (check) {
        x.style.display = 'block';
        y.style.display = 'none';
        missions.style.display = "block";
          
      } else {
        y.style.display = 'block';
        x.style.display = 'none';
        missions.style.display = "none";
      } 
  }



// // SHOW REWARD
function showREWARD(){
    reward.style.display = "block";   
    info.style.display = "block";   
    restart.style.display = "block";

}



function ShowReward() {
    var sectionnameR = document.getElementById('SectionNameR');
    
    var ButtonNext1 = document.getElementsByClassName('ButtonNext1')[0]; // Select the first element with the class 'NuttonNext'
  
    sectionnameR.style.display = 'block';
   
    ButtonNext1.disabled = true; // Disable the button with the class 'ButtonNext'
  }
     


  

// Localization

  
function reloadPage() {
    setTimeout(function () {
      location.reload();
    }, 100);
    }
  
  
    
        // set saved language
  
        lang = JSON.parse(localStorage.getItem('lang'));   // init
        console.log(lang)
  
       if (lang == 0) {
        //  window.location.hash == "#en";
        window.location.href = "#en";
        }
  
        else if (lang == 1) {
        window.location.href = "#fr";
        }
  
        else if (lang == 2) {
        window.location.href = "#es";
        }
  
  
  
  
    // translations
  
    var language = {
  
            "en": {
                  
                      Stchapters: "Chapters",
                      StAccount: "Account", 
  
                      StTerms: "By continuing, you are indicating that you accept our Terms of Services and Privacy Policy.",
             //         StForgotpw: "Forgot password?",
             //         StpwresetEmail: "Password reset email sent.",
             //         StEmailnotfound: "User Email not found.",


             String0: "2pm. Welcome to the Alpha Playtest!",

             String1: "Our goal is to test the ALPHA version difficulty and overall experience.",
             String2: "Please try each SpaceShip and save planet earth from an Alien attack.",
             String3: "Controls: use ← & → to move, press the SPACE BAR to shoot.",
             String4: "Please, select a SpaceShip.",
             String5: "Launch Mission",
             String6: "Ship used",
             String7: "Shields used:",
             String8: "Alien grids killed:",
             String9: "Score:",
             String10: "Check Playtest results",
             String11: "Mission [10/12] part 1 completed",
             String12: "Our 16 players playtest results just came in!",
             String13: "K6 is building insight cards from the data, logs and comments we received.",
             String14: "Once you are done testing our Alpha version, let's have a look:",
    
             String15: "Next Mission",

                  Terms: "Terms of Use",
                  Privacy: "Privacy Policy",
                  Stanalytics: "Analytics",
                  StrFeedback: "Feedback",
  
  
                },
  
            "fr": {
                 
              Stchapters: "Chapitres",
              StAccount: "Compte",          
              StTerms: "En continuant, vous indiquez que vous acceptez nos conditions d’utilisation et notre politique de confidentialité.",
          //    StForgotpw: "Mot de passe oublié?",
          //    StpwresetEmail: "Email de réinitialisation de mot de passe envoyé.",
          //    StEmailnotfound: "Adresse e-mail de l’utilisateur introuvable.",
            
          String0: "14h. Bienvenue à notre Playtest Alpha !",

          String1: "Notre objectif est de tester la difficulté et l'expérience globale de la version ALPHA.",
          String2: "Veuillez essayer chaque vaisseau et sauver la Terre d'une attaque extraterrestre.",
          String3: "Commandes : utilisez ← & → pour vous déplacer, appuyez sur la BARRE ESPACE pour tirer.",
          String4: "Veuillez sélectionner un vaisseau.",
          String5: "Lancer la mission",
          String6: "Vaisseau",
          String7: "Boucliers utilisés :",
          String8: "Grilles d'aliens détruites :",
          String9: "Score :",
          String10: "Voir les résultats du playtest",
          String11: "Mission [10/12] partie 1 accomplie",
          String12: "Les résultats du playtest de nos 16 joueurs viennent d'arriver !",
          String13: "K6 prépare des cartes d'analyse à partir des données, logs et commentaires reçus.",
          String14: "Une fois que vous aurez terminé de tester la version Alpha, jetons-y un œil :",        
                                            
                String15: "Mission suivante",
                        
                Stanalytics: "Analytique",
                Terms: "Conditions d'utilisation",
                Privacy: "Politique de confidentialité",
                StrFeedback: "Feed-back",
  
                },
  
            "es": {               
               
                Stchapters: "Capítulos",              
                StAccount: "Cuenta",       
                StTerms: "Al continuar, indicas que aceptas nuestros términos de uso y nuestra política de privacidad.",

              //      StForgotpw: "tbd forgot pw",
              //      StpwresetEmail: "tbd pw reset email",
              //      StEmailnotfound: "tbd email not found.",
              
              String0: "14 h. ¡Bienvenidos a nuestra Prueba Alpha!",

              String1: "Nuestro objetivo es probar la dificultad y la experiencia general de la versión ALPHA.",
              String2: "Por favor, prueba cada nave espacial y salva la Tierra de un ataque alienígena.",
              String3: "Controles: usa ← y → para moverte, presiona la BARRA ESPACIADORA para disparar.",
              String4: "Por favor, selecciona una nave espacial.",
              String5: "Iniciar misión",
              String6: "Nave utilizada",
              String7: "Escudos utilizados:",
              String8: "Rejillas de alienígenas eliminadas:",
              String9: "Puntuación:",
              String10: "Ver resultados de la prueba",
              String11: "Misión [10/12] partido 1 completada",
              String12: "¡Acaban de llegar los resultados de la prueba de nuestros 16 jugadores!",
              String13: "K6 está creando tarjetas de información a partir de los datos, registros y comentarios recibidos.",
              String14: "Una vez que hayas terminado de probar nuestra versión Alpha, echemos un vistazo:",
                          
                String15: "Próxima misión",

                Terms: "Términos de uso",
                Privacy: "Política de Privacidad",
                Stanalytics: "Análisis",
                StrFeedback: "Comentario",
  
                }
            
        };
  

  
        // Define language via window hash
        if (window.location.hash) {
  
           if (window.location.hash == "#fr") {
                lang = 1;   // init
                localStorage.setItem('lang', lang);   // init
  
                stchapters.textContent = language.fr.Stchapters;
                staccount.textContent = language.fr.StAccount;

                string0.textContent = language.fr.String0;
                           
                stterms.textContent = language.fr.StTerms;
              //  stforgotpw.textContent = language.fr.StForgotpw;
              //  stpwresetemail.textContent = language.fr.StpwresetEmail;
              //  stemailnotfound.textContent = language.fr.StEmailnotfound;
  
                string1.textContent = language.fr.String1;
                string2.textContent = language.fr.String2;
                string3.textContent = language.fr.String3;
                string4.textContent = language.fr.String4;
                string5.textContent = language.fr.String5;
                string6.textContent = language.fr.String6;
                string7.textContent = language.fr.String7;
  
                string8.textContent = language.fr.String8;
                string9.textContent = language.fr.String9;
                string10.textContent = language.fr.String10;
  
                string11.textContent = language.fr.String11;
                string12.textContent = language.fr.String12;
                string13.textContent = language.fr.String13;
                string14.textContent = language.fr.String14;
                string15.textContent = language.fr.String15;       

             //    document.getElementById('GCv6').src = "../../../assets/img/games/3-Production/SP-PR7-Dev/GCv6-fr.png";
                               
                terms.textContent = language.fr.Terms;
                privacy.textContent = language.fr.Privacy;
                stanalytics.textContent = language.fr.Stanalytics;
                strfeedback.textContent = language.fr.StrFeedback;
  
           }
  
           else if (window.location.hash == "#es") {
                lang = 2;     // init
                localStorage.setItem('lang', lang);     //init
              
                stchapters.textContent = language.es.Stchapters;
                staccount.textContent = language.es.StAccount;
             
                string0.textContent = language.es.String0; 
            
                stterms.textContent = language.es.StTerms;
          //      stforgotpw.textContent = language.es.StForgotpw;
          //      stpwresetemail.textContent = language.es.StpwresetEmail;
          //      stemailnotfound.textContent = language.es.StEmailnotfound;

                string1.textContent = language.es.String1;
                string2.textContent = language.es.String2;
                string3.textContent = language.es.String3;
                string4.textContent = language.es.String4;
                string5.textContent = language.es.String5;
                string6.textContent = language.es.String6;
                string7.textContent = language.es.String7;
                string8.textContent = language.es.String8;
                string9.textContent = language.es.String9;
                string10.textContent = language.es.String10;
              
                string11.textContent = language.es.String11;
                string12.textContent = language.es.String12;
                string13.textContent = language.es.String13;
                string14.textContent = language.es.String14;
                string15.textContent = language.es.String15;
                           

          //     document.getElementById('GCv6').src = "../../../assets/img/games/3-Production/SP-PR7-Dev/GCv6-es.png";
             
                terms.textContent = language.es.Terms;
                privacy.textContent = language.es.Privacy;
                stanalytics.textContent = language.es.Stanalytics;
                strfeedback.textContent = language.es.StrFeedback;
  
           }
  
          else {
             lang = 0;
         
       
       }
  
        }
  
  

