
function initCanvas(ruta){
    
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); // nave
    var enemiespic1  = new Image(); // enemigo 1
    var enemiespic2 = new Image(); // enemigo 2
    

    // backgroundImage y naveImage
    backgroundImage.src = "images/"+ruta+".jpg"; //Background picture
    naveImage.src       = "images/spaceship-pic.png"; //Spaceship picture
    // Enemigos fotos
    enemiespic1.src     = "images/enemigo1.png";
    enemiespic2.src     = "images/enemigo2.png"; //Enemies picture
    
    // width and height (canvas)
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

    // template for naves
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    // To reduce a repetitive function or two I've made some slight changes to how you create enemies.
    var enemies = [
                   new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                   // Segundo grupo de enemigos
                   new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
                  ];

    // This allows for more enemies to be rendered without needing a function per set of enemies.
    // This also forces enemies to check if THEY are hitting the player 
    
    
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y +=0.5, enemyList[i].w, enemyList[i].h);
            // Detects when ships hit lower level
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        // bullet location (ubicación de balas)
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="red", // bullet color (color de bala)
        this.misiles = [];

         // If you wanted to use different fonts or messages for the player losing you can change it accordingly.
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            fuente: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            
            //deslizarse por la pantalla 
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }

            ctx.fillStyle = this.bg;//dibujar misil
            ctx.drawImage(backgroundImage, 0, 0); // dibujar fondo
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); // dibujar nave

            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // bullet direction
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){ // If a missile goes past the canvas boundaries, remove it
                    this.misiles.splice(i,1); // splice that missile out of the misiles array
                }
            }
            // codigo si ganas
            if (enemies.length === 0) {
                
                clearInterval(animateInterval); // Stop the game animation loop
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.fuente;
                ctx.fillText('Ganaste Hija', 50, 50);            
            }
        }
        // Detectar impacto de bullet (bala)
        this.hitDetect = function (m, mi) {
            //console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1); // Remove the missile
                    enemies.splice(i, 1); // Remove the enemy that the missile hit
                    document.querySelector('.barra').innerHTML = "Destroyed "+ e.id+ " ";
                }
            }
        }
        // Ask player ship if an enemy has passed or has hit the player ship
        this.hitDetectLowerLevel = function(enemy){
            // If location of ship is greater than 550 then we know it passed lower level
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'EL ENEMIGO PASO';
                
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> where is spaceship location
            //if(enemy.id === 'enemy3'){
                //console.log(this.y);
                //console.log(this.x);
            //}
            // a) If enemy y is greater than this.y - 25 => then we know there's a collision
            // b) If enemy x is gless than this.x + 45 && enemy x > this.x - 45 then we know theres a collision
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // Checking if enemy is on the left or right of spaceship
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'MORISTE TE ESTRELLASTE';
                   
                }

            if(this.gameStatus.over === true){ 
                
                clearInterval(animateInterval); // Stop the game animation loop
                ctx.fillStyle = this.gameStatus.fillStyle; // set color to text
                ctx.font = this.gameStatus.fuente;
                // To show text on canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // text x , y
            }
        }
    }
    
    var launcher = new Launcher();
   
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        retorno = launcher.render();
        renderEnemies(enemies);

    }
    var animateInterval = setInterval(animate, 10);

    
    
    var left_btn  = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn  = document.getElementById('fire_btn'); 
    botonesPressed(launcher);
    botonesAdd(left_btn,right_btn,fire_btn,launcher);
    
}




function botonesPressed(launcher){
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // left arrow
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // right arrow
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39) // right arrow
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 80) // restart game
         {
          location.reload();
         }
    });
    // This fires when clicking on space button from keyboard
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });

    // cambiar vel
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 13) {
          
        }
    });
}

function botonesAdd(left_btn,right_btn,fire_btn,launcher){
     // control buttons
     left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });
    //This code below fires bullets (balas)
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    
}


window.addEventListener('load', function(event) {
   // initCanvas();
    
});


var i =1;
var ruta;
var btnJugar = document.getElementById('jugar');
 btnJugar.addEventListener('mousedown', function(event){
        //if(i==1){
            //alert("entro al if1");
           // ruta ="lvl2";
           // initCanvas(ruta);

           // document.getElementById("lvl").innerHTML = "ganos: "+gano;
            //alert("valor de gano: "+gano);
            /*if(gano == 1){
                alert("Segundo nivel");
                 ruta ="lvl2";
                 initCanvas(ruta);
           }*/
       // }
       var sms = "kakaroto";
       setInterval(() => {
           var cc = sms;
            console.log("hola que tal::  "+cc);
       }, 1000,sms);

      
    
});




