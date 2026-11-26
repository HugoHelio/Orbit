const CURRENT_CHAPTER = "Conception";
const chapter = 14;
const xpbonus = 0;
let starbonus = 0;   

const badge1 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 
const badge2 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 
const badge3 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 
const badge4 = 0;        // PLB:1, PRB:2, BUB:3, DEB: 4; 


const leveluppopup = document.getElementById("leveluppopup");




// check if games already played and sho solution if yes:

window.showSolution_Conception14 = function() {
  console.log("🎯 Showing solution for Chapter C 14");

  const info = document.getElementById('info');
     info.style.display = 'block'; 

   const SectionNameR = document.getElementById('SectionNameR');
      SectionNameR.style.display = 'block'; 

   const insights = document.getElementById('insights');
       insights.style.display = 'block';
  
};




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
  const headerOffset = 78; // px, same as your top value

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






// script to focus on the right target area when new content is displayed at the bottom of the page

document.querySelectorAll(".toggle-button").forEach(button => {
    button.addEventListener("click", function () {
        const content = document.querySelector(this.getAttribute("data-target"));
  
      //    var buttons = document.getElementsByClassName('ButtonNext1')[0];  // Select all elements with the class 'btn-warning'     
          var buttons = document.getElementsByClassName('ButtonNext')[0]; // Select all elements with the class 'btn-warning'     
  
                // Add a small delay before adjusting the position slightly up
              setTimeout(() => {
                  window.scrollBy(0, 220); // Adjust this value to fine-tune the offset
               }, 180);
     
         });
     });
  

 

// for definitions / why it matters - global

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".definition-box1").forEach(box1 => {
    const masterBtn = box1.querySelector(".toggle-all-btn");
    const masterArrow = masterBtn?.querySelector(".arrow");

    // Sections (entire boxes) and inner toggle buttons
    const sections = box1.querySelectorAll(".definition-box2, .definition-box3");
    const sectionBtns = box1.querySelectorAll(".toggle-btn");

    function updateMasterState() {
      const anyOpen = Array.from(sections).some(s => !s.classList.contains("collapsed"));
      if (masterArrow) masterArrow.classList.toggle("collapsed", !anyOpen);
      masterBtn?.setAttribute("aria-expanded", anyOpen ? "true" : "false");
    }

    // Individual section toggles (still collapse only inner content)
    sectionBtns.forEach(btn => {
      const arrow = btn.querySelector(".arrow");
      const content = btn.nextElementSibling; // the .toggle-content

      if (arrow && content) {
        arrow.classList.toggle("collapsed", content.classList.contains("collapsed"));
      }

      btn.addEventListener("click", () => {
        if (!content) return;
        const nowCollapsed = content.classList.toggle("collapsed");
        if (arrow) arrow.classList.toggle("collapsed", nowCollapsed);
        updateMasterState();
      });
    });

    // Master toggle: hide/show entire section boxes
    if (masterBtn) {
      masterBtn.addEventListener("click", () => {
        const anyOpen = Array.from(sections).some(s => !s.classList.contains("collapsed"));
        const shouldCollapse = anyOpen;

        sections.forEach(s => s.classList.toggle("collapsed", shouldCollapse));

        // Also collapse/expand individual arrows in case user opens sections again
        sectionBtns.forEach(b => {
          const a = b.querySelector(".arrow");
          if (a) a.classList.toggle("collapsed", shouldCollapse);
        });

        updateMasterState();
      });
    }

    updateMasterState();
  });
});



// roadmap on top UI
// timeline

const startCircle = document.getElementById("timeline3-center");
const timelineContent = document.querySelector(".timeline3-content");

startCircle.addEventListener("click", () => {
  timelineContent.classList.toggle("collapsed");
});








// https://www.youtube.com/watch?v=MCVU0w73uKI


// document.body.style.overflow = "hidden";

const scoreEl = document.querySelector("#scoreEl")
// const canvas = document.getElementById("canvas")
const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")


const restart = document.getElementById("restart");
const youlose = document.getElementById("youlose");
const insights = document.getElementById("insights");
const info = document.getElementById("info");

const youwon = document.getElementById("youwon");
const congrats = document.getElementById("congrats");
const congratsG = document.getElementById("congratsG");
const bravo = document.getElementById("bravo");

// Create a linear gradient
// The start gradient point is at x=5, y=0
// The end gradient point is at x=670, y=0
const gradient = c.createLinearGradient(5, 0, 670, 590);

// Add three color stops
gradient.addColorStop(0, "black");
gradient.addColorStop(1, "black");

canvas.width = 680
canvas.height = 600


let gameOn = false;

let gameStarted = false; 
let presults = false;


/*
setTimeout(() => {
   gameStarted = true
   }, 3400)
*/

 

class Player {

   constructor() {

    this.width = 64  //image.width
    this.height = 60  // image.height

        this.position = {
            x: canvas.width / 2,
            y: canvas.height - 50
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.opacity = 1

        // const image = new Image()
        // image.src = "./img/spaceship.png"
        // image.onload = () => {
            // const scale = 0.2
            // this.image = image
            // this.width = image.width * scale
            // this.height = image.height * scale
            // this.position = {
            //    x: canvas.width / 2 - this.width / 2,
            //    y: canvas.height - this.height - 20
            //}

        // } 


    }

draw() {
    
    c. save()
    c.globalAlpha = this.opacity

    c.fillStyle = 'red'
    c.beginPath();
    c.moveTo(this.position.x-32, this.position.y+30);
    c.lineTo(this.position.x+32, this.position.y+30);
    c.lineTo(this.position.x, this.position.y-30);
    c.lineTo(this.position.x-32, this.position.y+30);
    c.fill();
    
    // c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    c.restore()
}
   

update() {
    // if (this.image) {}
    this.draw()
    this.position.x += this.velocity.x
    
}

}


class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'orange'
        c.fill()
        c.closePath()
    }

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

        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'orange'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}

// to add in pre-pro to differentiate alien missile vs ship missile

// class InvaderProjectile {
//    constructor({position, velocity}){
//        this.position = position
//        this.velocity = velocity
//
//        this.width = 3
//        this.height = 9
//    }

//    draw() {
//        c.beginPath()
//        c.fillRect(this.position.x, this.position.y, this.width, this.height)
//        c.fillStyle = 'white'
//        c.fill()
//        c.closePath()
//    }

//    update() {
//        this.draw()
//        this.position.x += this.velocity.x
//        this.position.y += this.velocity.y
//    }

//}




class Invader {

    constructor({ position }) {
           this.position = {
                 x: position.x,
                 y: position.y
             }
 
    //     this.velocity = {
    //         x: 0,
    //         y: 0
    //     }
 
         // const image = new Image()
         // image.src = "./img/invader.png"
         // image.onload = () => {
             // const scale = 1
             // this.image = image
             // this.width = image.width * scale
             // this.height = image.height * scale
             // this.position = {
             //    x: canvas.width / 2 - this.width / 2,
             //    y: canvas.height /2 
             //}
 
         // }

         // this.width = 60
         // this.height = 60
  
         this.radius = 36  // alien radius    
 
     }
 
 draw() {
     
    c.fillStyle = 'rgb(4, 236, 62)'
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
    c.fill();
    c.closePath()
    
         // c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
 }
    
 
 update( { velocity }) {
     // if (this.image) {}
     this.draw()
     this.position.x += velocity.x
     this.position.y += velocity.y
  
 }
 
 shoot(invaderProjectiles) {

  //  setTimeout(() => {
           
    invaderProjectiles.push(
        new InvaderProjectile({
          position: {
            x: this.position.x,  // + this.width / 2 (when we switch to image in prod)
            y: this.position.y + this.radius // + this.height (when we switch to image in prod)
        },
        velocity: {
            x: 0,
            y: 3
        }

        }))
   //  }, 3000)
 }
}



function initializeGame() {
   
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


setTimeout(() => {
   gameStarted = true
   }, 2800)



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

        const columns = Math.floor(Math.random() * 1 + 3)   // initialement 4
        const rows = Math.floor(Math.random() * 1 + 1  )       // initialement 3

        this.width = columns * 92

        for (let x=0; x<columns; x++) {
            for (let y=0; y<rows; y++) {   
            this.invaders.push(
                new Invader({
                    position: {
                        x: x * 92 + 36,
                        y: y * 92 + 46
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width - 20 >= canvas.width || this.position.x <= 2) {
            this.velocity.x = -this.velocity.x
     //       this.velocity.y = 44
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
let randomInterval = Math.floor(Math.random() * 600 + 1000)
let game = {
    over: false,
    active: true
}

let score = 0
let won = false





// adding stars as particles to the background - in prod
for (let i = 0; i < 85; i++) {
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
      for (let i = 0; i < 14; i++) {
         particles.push(
           new Particle({
              position: {
                 x: object.position.x, // + object.width / 2,  (to add in prod when invader & ships are an image)
                 y: object.position.y  // + object.height / 2  (to add in prod when invader & ship are an image)
              },
              velocity: {
                 x: (Math.random() - 0.5) *2,
                 y: (Math.random() - 0.5) *2
                },
              radius: Math.random() * 5,
              color: color || 'rgb(4, 236, 62)',
              fades: true
    
               }))
           }
  }




function animate() {
    
    if (!game.active) return

    requestAnimationFrame(animate)
    c.fillStyle = gradient;
    c.fillRect(0, 0 , canvas.width, canvas.height)
    
    
  // to enable for particles explosions aliens and ship in pre-pro
  //  particles.forEach((particle, i) => {

  //      if (particle.position.y - particle.radius >= canvas.height) {
  //          particle.position.x = Math.random() * canvas.width
  //          particle.position.y = -particle.radius
  //      }


  //      if (particle.opacity <= 0) {
  //          setTimeout(() => {
  //              particles.splice(i, 1)
  //          }, 0)
  //      } else {
  //          particle.update()
  //      }
  //  })

    player.update()


    //Displaying the insights 
    
    
    if (presults) {
        setTimeout(() => {
        showinsights();
        },  1200)
       }

    setTimeout(() => {
            presults = true
            }, 3000)



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
            player.position.y - 30 && invaderProjectile.position.x + invaderProjectile.radius >= player.position.x - 32 &&
            invaderProjectile.position.x <= player.position.x + player.width/2
            ) {
                
                presults = true;

                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0)

                // lose condition - in pre-pro
                setTimeout(() => {
                    game.active = false
                    showYouLose()
                }, 700)
                
                createParticles({
                    object: player,
                    color: 'red',
                    fades: true
                })
            }      

    })

    // removing projectile for memory reasons
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <=0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    
    grids.forEach(grid => {
        grid.update()

    // spawn alien projectiles
        
    if (frames % 100 === 0 && grid.invaders.length >= 1 && gameStarted) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
        )
     } 
  
        grid.invaders.forEach((invader, i) => {
            invader.update( {velocity: grid.velocity} )

    // win condition
 //   if (grid.invaders.length <= 0) {
                
 //       console.log('you win')
 //       won = true;
 //      showYouWin()
     
 //    setTimeout(() => {
 //       game.over = true
 //   }, 0)

 //   setTimeout(() => {
 //       game.active = false
 //   }, 1100)

 //} 

            //projectiles hit Alien

            projectiles.forEach((projectile, j) => {
                if (projectile.position.y <=
                    invader.position.y + Math.sqrt(invader.radius * invader.radius/2) -2 && projectile.position.x >=
                    invader.position.x - Math.sqrt(invader.radius * invader.radius/2) + 2 && projectile.position.x <=
                    invader.position.x + Math.sqrt(invader.radius * invader.radius/2) - 2 && projectile.position.y >=
                    invader.position.y - Math.sqrt(invader.radius * invader.radius/2) + 2
                    ) {

      

                   // correct collision detection code apres playtest - prepro:     
                   //     projectiles.forEach((projectile, j) => {
                   //      if (projectile.position.y - projectile.radius <=
                   //             invader.position.y + invader.radius && projectile.position.x + projectile.radius >=
                   //             invader.position.x - invader.radius && projectile.position.x - projectile.radius <=
                   //             invader.position.x + invader.radius && projectile.position.y + projectile.radius >=
                   //             invader.position.y - invader.radius
                   //             ) {

                    



                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                            )

                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                            )

                            // remove invader and projectile
                            if (invaderFound && projectileFound) {   
                                score += 100 
                                scoreEl.innerHTML = score
                           // to enable in pre-pro with particles
                               createParticles({
                                object: invader,
                                fades: true
                                }
                               ) 
                              
                              grid.invaders.splice(i, 1)
                              projectiles.splice(j, 1)




                              // reducing grid width when invaders are shot on the side so that they reach the frame - for Pre-Pro
                           //    if (grid.invaders.length > 0) {
                           //         const firstInvader = grid.invaders[0]
                           //         const lastInvader = grid.invaders[grid.invaders.length - 1]
                          
                           //         grid.width = lastInvader.position.x - firstInvader.position.x + invader.radius * 2
                           //         grid.position.x = firstInvader.position.x - invader.radius
                                    
                           //         console.log(grid.width)
                           //   } 


                            } 

                    }, 0)

                    }
            })
        })
    })

    if (keys.LeftArrow.pressed && player.position.x >= 6) {
        player.velocity.x = -7
    } else if (keys.RightArrow.pressed && player.position.x + 5 <= canvas.width) {
        player.velocity.x = 7
    }
    else {
        player.velocity.x = 0
    }

// spawning enemies


    if (frames % randomInterval === 0) {
       grids.push(new Grid())
       randomInterval = Math.floor(Math.random() * 600 + 10000)
       frames = 0       
    }

 //   if (frames % randomInterval === 0) {
 //       grids.push(new Grid())
 //       randomInterval = Math.floor(Math.random() * 600 + 500)
 //       frames = 0       
 //   }

    frames++

}

animate()


addEventListener('keydown', function(event) {
    event.preventDefault();
    const key = event.key;

    if (game.over) return

    switch (key) {
        case "ArrowLeft":
            keys.LeftArrow.pressed = true
            break

        case "ArrowRight":
            keys.RightArrow.pressed = true
           break

        case ' ':
             projectiles.push(new Projectile({
                position: {
                    x: player.position.x,
                    y: player.position.y - 37
                },
                velocity: {
                    x: 0,
                    y: -4
                }
             }))
             keys.space.pressed = true
            
             break
    }
})


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






// CLICK ON INSIGHTS BUTTON
// insights.addEventListener("click", function(){
//    window.open("../SP-0-Chapters/index.html"); // open new page
// })



// SHOW YOU LOSE
function showYouLose(){
     restart.style.display = "block";
     youlose.style.display = "block";
     insights.style.display = "block";
}


// SHOW INSIGHTS
function showinsights(){
    info.style.display = "block";
    insights.style.display = "block";
 //   congrats.style.display = "block";
     }

     
function ShowReward() {
    var sectionnameR = document.getElementById('SectionNameR');
    var scorexp = document.getElementById("scorexp");
  
    sectionnameR.style.display = 'block';
  
  }
     
  





// Localization
  
function reloadPage() {
    setTimeout(function () {
      location.reload();
    }, 100);
    }
  
    
  
    // translations
  
    var language = {
  
            "en": {
                   
                    Stchapters: "Chapters",
                    Stintro: "PROTOTYPE VERSION PLAYTEST",
                    StAccount: "Account",            
                    StTerms: "By continuing, you are indicating that you accept our Terms of Services and Privacy Policy.",
  
                      String500: "User Test (Playtest)",
                      String501: "Definition",
                      String502: "Process of having players try a game to evaluate its mechanics, usability, and overall experience.",
                      String503: "Provides real user feedback.",
                      String504: "Why it matters",
                      String505: "Reveals issues and bugs early, so it allows to fail fast and cheaply.",
                      String506: "Validates (or not) design choices. Reduces risk.",


                    String0: "Our goal is to test the basics: our core gameplay accessibility, fun and potential.",
          
                    String01: "Good news, Luke managed to spawn 3 aliens to improve the experience.",
             
                    String1: "Objectives: Shoot Aliens & avoid their missiles.",
                    String2: "Controls: use ← & → to move, press the SPACE BAR to shoot.",
                                      
                    String3: "Unlucky, please try again!",
                    String4: "Check Playtest results",

                    String5: "Mission [6/7] part 1 completed",
  
                    String6: "Ok, our 16 players playtest results just came in!",
                    String7: "K6 is building insight cards from the data and comments we received.",
                    String8: "Once you are done testing our prototype, let's have a look:",
                    
                    String9: "Next Mission",
  
                    Terms: "Terms of Use",
                    Privacy: "Privacy Policy",
                    StrFeedback: "Feedback",
  
              
                },
  
            "fr": {
                
                  Stchapters: "Chapitres",
                  Stintro: "TEST UTILISATEUR DE LA VERSION PROTOTYPE",
                  StAccount: "Compte",
                             
                  StTerms: "En continuant, vous indiquez que vous acceptez nos conditions d’utilisation et notre politique de confidentialité.",
                            
                    String500: "Test Utilisateur (Playtest)",
                    String501: "Définition",
                    String502: "Processus consistant à faire essayer un jeu par des joueurs afin d’évaluer ses mécaniques, son ergonomie et l’expérience globale.",
                    String503: "Fournit de vrais retours utilisateurs.",
                    String504: "Pourquoi c’est important",
                    String505: "Révèle les problèmes et bugs tôt, ce qui permet d’échouer rapidement et à moindre coût.",
                    String506: "Valide (ou non) les choix de conception. Réduit les risques.",


                  String0: "Notre but est de tester les bases du concept : l'accessibilité, le fun et le potentiel du coeur du gameplay.", 
                  String01: "Bonne nouvelle, Luke a réussi à afficher 3 aliens pour améliorer l'expérience.",

                    String1: "Objectifs : tirer sur les aliens et éviter leurs missiles.",
                    String2: "Utiliser ← et → pour se déplacer, appuyer sur la BARRE D'ESPACE pour tirer.",

                    String3: "Pas de chance, veuillez réessayer !",
                    String4: "Obtenir les résultats du playtest",

                    String5: "Mission [6/7] part 1 complétée",

                    String6: "Ok, les résultats des playtests de 16 joueurs viennent d'arriver.",
                    String7: "K6 construit des cartes d'analyse à partir des données et des commentaires que nous avons reçus.",
                    String8: "Une fois que vous aurez fini de tester le prototype, regardons tout cela.",
                                  
                  String9: "Mission suivante",
    
                  Terms: "Conditions d'utilisation",
                  Privacy: "Politique de confidentialité",
                  StrFeedback: "Feed-back",  
  
                },
  
            "es": {
  
                  Stchapters: "Capítulos",
                  Stintro: "PRUEBAS DE USUARIO DE LA VERSIÓN PROTOTIPO", 
                  StAccount: "Cuenta",       
                  
                  StTerms: "Al continuar, indicas que aceptas nuestros términos de uso y nuestra política de privacidad.",
  
                    String500: "Prueba de Usuario (Playtest)",
                    String501: "Definición",
                    String502: "Proceso en el que los jugadores prueban un juego para evaluar sus mecánicas, usabilidad y experiencia general.",
                    String503: "Aporta retroalimentación real de los usuarios.",
                    String504: "Por qué importa",
                    String505: "Revela problemas y errores de manera temprana, lo que permite fallar rápido y a bajo costo.",
                    String506: "Valida (o no) las decisiones de diseño. Reduce el riesgo.",

          
                  String0: "Nuestro objetivo es probar los aspectos básicos: la accesibilidad, la diversión y el potencial de nuestra jugabilidad principal.", 
                  String01: "Buenas noticias, Luke logró generar 3 alienígenas para mejorar la experiencia.",

                  String1: "Objetivos: disparar a los alienígenas y evitar sus misiles.",
                  String2: "Controles: usa ← y → para moverte, presiona la BARRA ESPACIADORA para disparar.",
                  
                  String3: "Mala suerte, ¡inténtalo de nuevo!",
                  String4: "Verifica los resultados de la prueba de juego",
                  
                  String5: "Misión [6/7] parte 1 completada",
                  
                  String6: "Bien, ¡acaban de llegar los resultados de la prueba de juego de 16 jugadores.",
                  String7: "K6 está creando tarjetas de información a partir de los datos y comentarios que recibimos",
                  String8: "Una vez que hayas terminado de probar nuestro prototipo, echemos un vistazo:",
                  
                  String9: "Próxima misión",
    
                  Terms: "Términos de uso",
                  Privacy: "Política de Privacidad",
           
                  StrFeedback: "Comentario",
  
                    
                }
            
        };
  
  
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
    
    
  
      
  
  
        // Define language via window hash
        if (window.location.hash) {
  
  
           if (window.location.hash == "#fr") {
  
                lang = 1;   // init
                localStorage.setItem('lang', lang);   // init
  
              //  document.getElementById('background-image').src = "../../../assets/img/games/1-Conception/SP-C2-Puzzle1-Timeline/C1-puzzle-Background-FR.png";
  
           //     document.getElementById("board").style.backgroundImage = `url('../../../assets/img/games/1-Conception/SP-C2-Puzzle1-Timeline/C1-puzzle-Background-FR.png')`;
  
                stchapters.textContent = language.fr.Stchapters;
                stintro.textContent = language.fr.Stintro;
                staccount.textContent = language.fr.StAccount;         
  
             //   document.getElementById('concept').src = "../../../assets/img/presentation/Conception/Concept1SP-FR.jpg";
                           
                stterms.textContent = language.fr.StTerms;

              string500.textContent = language.fr.String500;
              string501.textContent = language.fr.String501;
              string502.textContent = language.fr.String502;
              string503.textContent = language.fr.String503;
              string504.textContent = language.fr.String504;
              string505.textContent = language.fr.String505;
              string506.textContent = language.fr.String506;
  
                string0.textContent = language.fr.String0;
                string01.textContent = language.fr.String01;
                string1.textContent = language.fr.String1;
                string2.textContent = language.fr.String2;
                string3.textContent = language.fr.String3;
                string4.textContent = language.fr.String4;
                string5.textContent = language.fr.String5;
                string6.textContent = language.fr.String6;
                string7.textContent = language.fr.String7;
                string8.textContent = language.fr.String8;
                string9.textContent = language.fr.String9;
                
                terms.textContent = language.fr.Terms;
                privacy.textContent = language.fr.Privacy;
              
                strfeedback.textContent = language.fr.StrFeedback;
              
           }
  
  
           else if (window.location.hash == "#es") {
  
            lang = 2;     // init
            localStorage.setItem('lang', lang);     //
            
        //    document.getElementById("board").style.backgroundImage = `url('../../../assets/img/games/1-Conception/SP-C2-Puzzle1-Timeline/C1-puzzle-Background-ES.png')`;
    
            stchapters.textContent = language.es.Stchapters;
            stintro.textContent = language.es.Stintro;
            staccount.textContent = language.es.StAccount;
                
            stterms.textContent = language.es.StTerms;

          string500.textContent = language.es.String500;
          string501.textContent = language.es.String501;
          string502.textContent = language.es.String502;
          string503.textContent = language.es.String503;
          string504.textContent = language.es.String504;
          string505.textContent = language.es.String505;
          string506.textContent = language.es.String506;
  
        //    document.getElementById('concept').src = "../../../assets/img/presentation/Conception/Concept1SP-ES.jpg";
       
            string0.textContent = language.es.String0;
            string01.textContent = language.es.String01;
            string1.textContent = language.es.String1;
            string2.textContent = language.es.String2;
            string3.textContent = language.es.String3;
            string4.textContent = language.es.String4;
            string5.textContent = language.es.String5;
            string6.textContent = language.es.String6;
            string7.textContent = language.es.String7;      
            string8.textContent = language.es.String8;
            string9.textContent = language.es.String9;
  
            terms.textContent = language.es.Terms;
            privacy.textContent = language.es.Privacy;
    
            strfeedback.textContent = language.es.StrFeedback;
  
  
           }
  
           else {
                    lang = 0;
                              
           //     document.getElementById("board").style.backgroundImage = `url('../../../assets/img/games/1-Conception/SP-C2-Puzzle1-Timeline/C1-puzzle-Background-EN.png')`;
       
                 }
  
  
  
  
        }
  
  
  
  


 