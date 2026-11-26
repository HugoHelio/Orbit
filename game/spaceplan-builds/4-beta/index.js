// https://www.youtube.com/watch?v=MCVU0w73uKI
// https://www.youtube.com/watch?v=qCBiKJbLcFI


document.body.style.overflow = "hidden";

// const canvas = document.getElementById("canvas")
const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

const scoreEl = document.querySelector("#scoreEl")
const shield = document.querySelector("#shield")

const restart = document.getElementById("restart");
const reward = document.getElementById("reward");
const youlose = document.getElementById("youlose");
// const insights = document.getElementById("insights");
// const info = document.getElementById("info");

const youwon = document.getElementById("youwon");
const congrats = document.getElementById("congrats");
const congratsG = document.getElementById("congratsG");
const bravo = document.getElementById("bravo");

// Create a linear gradient
// The start gradient point is at x=15, y=10
// The end gradient point is at x=770, y=580
const gradient = c.createLinearGradient(15, 10, 770, 580);

// Add 2 color stops
gradient.addColorStop(0, "#0e0a8cf7");
gradient.addColorStop(1, "black");

canvas.width = 882
canvas.height = 600

let SHIELD = 2; // PLAYER HAS 3 LIVES
let gameStarted = false; 
let presults = false;


setTimeout(() => {
   gameStarted = true
   }, 200)


RewardSPP10 = JSON.parse(localStorage.getItem('RewardSPP10'));  

   if (RewardSPP10 >= 1) {
      presults = true;
   }


class Player {

   constructor() {

//   this.width =  52   
 //   this.height = 48 


     //   this.position = {
     //       x: 200,
     //       y: 200
     //   }

     this.velocity = {
        x: 0,
        y: 0
       }

        const image = new Image()
         image.src = "./img/spaceship.png"
         image.onload = () => {
             const scale = 0.2
             this.image = image
             this.width = image.width * scale
             this.height = image.height * scale

             this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 10
            }
  

        this.opacity = 1

         } 

    }

draw() {
    
    c. save()
    c.globalAlpha = this.opacity


   /////  when ship = triangle 
   // c.fillStyle = 'red'
   // c.beginPath();
   // c.moveTo(this.position.x-26, this.position.y+24);
   // c.lineTo(this.position.x+26, this.position.y+24);
   //  c.lineTo(this.position.x, this.position.y-24);
   // c.lineTo(this.position.x-26, this.position.y+24);
   // c.fill();
    

    // gunleft
    // c.fillStyle = 'red'
    // c.beginPath();
    // c.moveTo(this.position.x-26, this.position.y+24);
    // c.lineTo(this.position.x-26, this.position.y+8);
    // c.lineTo(this.position.x-23, this.position.y+8);
    // c.lineTo(this.position.x-23, this.position.y+24);
    // c.fill();
    

    // guncenter
    // c.fillStyle = 'red'
    // c.beginPath();
    // c.moveTo(this.position.x-2, this.position.y-23);
    // c.lineTo(this.position.x-2, this.position.y-30);
    // c.lineTo(this.position.x+2, this.position.y-30);
    // c.lineTo(this.position.x+2, this.position.y-23);
    // c.fill();
    
    
    // gunright
    // c.fillStyle = 'red'
    // c.beginPath();
    // c.moveTo(this.position.x+26, this.position.y+24);
    // c.lineTo(this.position.x+26, this.position.y+8);
    // c.lineTo(this.position.x+23, this.position.y+8);
    // c.lineTo(this.position.x+23, this.position.y+24);
    // c.fill();
    
   // if (this.image) 
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

    c.restore()
}
   

update() {
   if (this.image) {
    this.draw()
    this.position.x += this.velocity.x
    }
  }

}


class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'yellow'
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
        c.fillStyle = this.color
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

 class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 6
    }

  
    

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'orange'
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
           }
 
          const image = new Image()
          image.src = "./img/invader-green3.png"
          image.onload = () => {
              const scale = 0.11
              this.image = image
              this.width = image.width * scale
              this.height = image.height * scale
              this.position = {
                 x: position.x,                              // canvas.width / 2 - this.width / 2,
                 y: position.y                              // canvas.height /2 
             }
 
          }

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

    
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
 }
    
 
 update( { velocity }) {
     if (this.image) {
     this.draw()
     this.position.x += velocity.x
     this.position.y += velocity.y
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
            y: 3.5 //init:5
        }

        }))
   //  }, 3000)
 }
}

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

        const columns = Math.floor(Math.random() * 7 + 4)
        const rows = Math.floor(Math.random() * 4 + 2)

        this.width = columns * 56

        for (let x=0; x<columns; x++) {
            for (let y=0; y<rows; y++) {   
            this.invaders.push(
                new Invader({
                    position: {
                        x: x * 56 + 4,
                        y: y * 56 + 4
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width - 2 >= canvas.width || this.position.x <= 2) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 26
         }
    }

}



// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload();      // reload the page
})




const player = new Player()
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
let randomInterval = Math.floor(Math.random() * 600 + 800)
let game = {
    over: false,
    active: true
}

let score = 0
let won = false




// adding stars as particles to the background - in prod
for (let i = 0; i < 82; i++) {
    particles.push(
      new Particle({
         position: {
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height
         },
         velocity: {
            x: 0,
            y: 0.3
           },
         radius: Math.random() * 2,
         color: 'white'
          }))
      }


// to enable in pre-pro with particles
function createParticles({object, color, fades}) {
      for (let i = 0; i < 26; i++) {
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
              color: color || 'rgb(4, 236, 62)',    // 
              fades: true
    
               }))
           }
  }




function animate() {
    
    if (!game.active) return

    requestAnimationFrame(animate)
    c.fillStyle = gradient;
    c.fillRect(0, 0 , canvas.width, canvas.height)
    
    shield.innerHTML = SHIELD;

     player.update()
    
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
 


    //Displaying the insights   
    
  //  if (presults) {
  //      setTimeout(() => {
  //      showinsights();
  //      }, 3800)
  //  }

    setTimeout(() => {
            presults = true
            }, 14500)



    // removing projectile for memory
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.radius >= canvas.height  // change invaderProjectile.radius to invaderProjectile.height when changing projectile style in pre-pro
            ) {   
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()


        // projectile hit player
        if (
            invaderProjectile.position.y + invaderProjectile.radius >=   // change invaderProjectile.radius to invaderProjectile.height when changing projectile style in pre-pro
            player.position.y + 16 && invaderProjectile.position.x + invaderProjectile.radius >= player.position.x + 8 &&   // change invaderProjectile.radius to invaderProjectile.width when changing projectile style in pre-pro
            invaderProjectile.position.x - invaderProjectile.radius <= player.position.x + player.width - 8
            ) {
                
               // presults = true;

               if (SHIELD >= 1) {

              
                SHIELD--;
                
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0.06

                }, 0)

                createParticles({
                    object: player,
                    color: 'yellow',
                    fades: true
                })

                setTimeout(() => {
                                     
                    player.opacity = 0.72

                }, 160)

                setTimeout(() => {
                                     
                    player.opacity = 0.24

                }, 285)

                setTimeout(() => {
                                     
                    player.opacity = 1

                }, 465)
                
                }

                else if (SHIELD <= 1) {

                   

                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0

                    game.over = true
                }, 0)

                // lose condition - in pre-pro
                setTimeout(() => {
                    game.active = false
                    showYouLose()
                }, 1300)
                
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

        console.log(gridIndex)

    // spawn alien projectiles
        

    setTimeout(() => {      

    if (frames % 100 === 0 && grid.invaders.length >= 1 && gameStarted) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
        )
     } 

    }, 3800)
  
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
                }, 800)
                
                createParticles({
                    object: player,
                    color: 'yellow',
                    fades: true
                })
                                 
                createParticles({
                          object: invader,
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
   // if (grid.invaders.length <= 0) {
                
   //     won = true;
   //    showYouWin()
     
   //  setTimeout(() => {
   //     game.over = true
   // }, 0)

   // setTimeout(() => {
   //     game.active = false
   // }, 1000)

   // } 

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
                                score += 100 
                                scoreEl.innerHTML = score

                           // to enable in pre-pro with particles
                               createParticles({
                                object: invader,
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
                                                    score += 100 
                                                    scoreEl.innerHTML = score
                    
                                               // to enable in pre-pro with particles
                                                   createParticles({
                                                    object: invader,
                                                    fades: true
                                                    }
                                                   ) 
                    
                                                  // remove invader and projectile
                                                  grid.invaders.splice(i, 1)
                                                  projectiles.splice(j, 1)
                    

                                //       won = true;
                                //       showYouWin()
                                     
                                //       setTimeout(() => {
                                //       game.over = true
                                //    }, 0)
                                
                                //       setTimeout(() => {
                                //       game.active = false
                                //    }, 1300)  
                                    
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


    if (frames % randomInterval === 0) {
       grids.push(new Grid())
       randomInterval = Math.floor(Math.random() * 800 + 800)
       frames = 0       
    }


 //   if (frames % randomInterval === 0) {
 //       grids.push(new Grid())
 //       randomInterval = Math.floor(Math.random() * 600 + 10000)  // to make it so long tere is no new grid
 //       frames = 0       
 //   }

   

    frames++

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
       
        projectiles.push(new Projectile({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y - 4
            },
            velocity: {
                x: 0,
                y: -4
            }
         }))

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



//helper function-> return <DOMelement>
function elt(type, prop, ...childrens) {
    let elem = document.createElement(type);
    if (prop) Object.assign(elem, prop);
    for (let child of childrens) {
    if (typeof child == "string") elem.appendChild(document.createTextNode(child));
    else elem.appendChild(elem);
    }
    return elem;
    }
    
    class Progress {
    constructor(now, min, max, options) {
    this.dom = elt("div", {
    className: "progress-bar"
    });
    this.min = min;
    this.max = max;
    this.intervalCode = 0;
    this.now = now;
    this.syncState();
    if(options.parent){
    document.querySelector(options.parent).appendChild(this.dom);
    } 
    else document.body.appendChild(this.dom)
    }
    
    syncState() {
    this.dom.style.width = this.now + "%";
    }
    
    startTo(step, time) {
    if (this.intervalCode !== 0) return;
    this.intervalCode = setInterval(() => {
    
    if (this.now + step > this.max) {
     this.now = this.max;
     this.syncState();
     clearInterval(this.interval);
     this.intervalCode = 0;
     return;
    }
    this.now += step;
    this.syncState()
    }, time)
    }
    end() {
    this.now = this.max;
    clearInterval(this.intervalCode);
    this.intervalCode = 0;
    this.syncState();
    }
    }
  


// CLICK ON INSIGHTS BUTTON
// insights.addEventListener("click", function(){
//    window.open("../SP-0-Chapters/index.html"); // open new page
// })



// SHOW YOU LOSE
function showYouLose(){
     restart.style.display = "block";
     youlose.style.display = "block";
  //   insights.style.display = "block";

     RewardSPPP10 = JSON.parse(localStorage.getItem('RewardSPPP10'));  
     RewardSPPP10 = 1;
     localStorage.setItem('RewardSPPP10', JSON.stringify(RewardSPPP10));

}

var leveltop = JSON.parse(localStorage.getItem('level')); 
document.getElementById("leveltop").innerText = leveltop;


// SHOW INSIGHTS
// function showinsights(){
//    info.style.display = "block";
//    insights.style.display = "block";
//   congrats.style.display = "block";


  
  
//}



// SHOW YOU WIN
function showYouWin(){
    youwon.style.display = "block";
    bravo.style.display = "block";
    congrats.style.display = "block";

    RewardSPPP10 = JSON.parse(localStorage.getItem('RewardSPPP10'));  
    RewardSPPP10 = 1;
    localStorage.setItem('RewardSPPP10', JSON.stringify(RewardSPPP10));
}

// // SHOW REWARD
function showREWARD(){
    reward.style.display = "block";
    
// DELIVERY badge
// Star + 1

}