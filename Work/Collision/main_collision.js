uclearColor = [0, 0, 0, 0];
use2D = true;
//initGame("canvas");

//Create a screen class
function Screen(alwaysUpdate, alwaysDraw) {
    //Call the Sprite constructor to copy any object properties
    Sprite.call(this);
    
    //These determine if the screen should be update/drawn when it is not the top screen
    this.alwaysUpdate = alwaysUpdate;
    this.alwaysDraw = alwaysDraw;
    
    //Has the screen been initialized
    this.initialized = false;
    
    //Create a stage for the screen that we can add sprites to
    this.stage = new Sprite();
    this.addChild(this.stage);
    
    //Create a gui object which extends sprite and supports buttons
    this.gui = new GUI(gInput);
    this.addChild(this.gui);
}
//Inherit all Sprite properties
Screen.prototype = new Sprite();

//Called once to set up anything that needs to be called after the game is initialized
//some values aren't available before initGame such as any canvas property
Screen.prototype.init = function(){
}

//Create a screen manager class
function ScreenManager() {
    //Call the Sprite constructor to copy any object properties
    Sprite.call(this);

    this.screens = new List();
}
//Inherit all Sprite properties
ScreenManager.prototype = new Sprite();

//Push a screen on to the stack
ScreenManager.prototype.push = function(screen){
    this.screens.remove(screen);
    this.screens.push(screen);
}

//Pop a screen off of the stack
ScreenManager.prototype.pop = function(){
    this.screens.tail.item.gui.visible = false;
    return this.screens.pop();
}

//Remove a screen from the stack
ScreenManager.prototype.remove = function(screen){
    screen.gui.visible = false;
    this.screens.remove(screen);
}

//Override th defult update function
ScreenManager.prototype.update = function (d) {
    var screens = this.screens;
    
    //Loop through the screens and update if they are supposed to always update or if they ar the top screen
    for (var node = screens.head; node != null; node = node.link) {
        var screen = node.item;
        
        //The gui wasn't exactly made for this situation so we need to hide it if it's not in the current screen
        if(node != screens.tail){
            screen.gui.visible = false;
        }else{
            screen.gui.visible = true;
        }
        
        if (screen.alwaysUpdate || node == screens.tail) {
            if(!screen.initialized){
                screen.init();
                screen.initialized = true;
            }
            screen.update(d);
        }
    }
}

//Override the defualt draw function the same as the update function except we're drawing
ScreenManager.prototype.draw = function (ctx) {
    var screens = this.screens;
    
    for (var node = screens.head; node != null; node = node.link) {
        var screen = node.item;
        if (screen.alwaysDraw || node == screens.tail) {
            screen.draw(ctx);
        }
    }
}

//Create a new screen manager
var screenMan = new ScreenManager();
//Add it as a child of the world.
//Here we're taking advantage of the sprite hierarchy structure
world.addChild(screenMan);

//Create a main menu screen
var mainMenu = new Screen(false, false);
//Optionally set a background for the screen
mainMenu.image = Textures.load("http://www.jar42.com/brine/lab1/images/samson.png");
screenMan.push(mainMenu);

//Override the empty init function to set some properties
mainMenu.init = function(){
    //Since we set a background we want the screen to fill  the canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.gui.x = canvas.width/2;
    this.gui.y = canvas.height/2;
    
    //Add some sprites to the main menu
    var logo = new Sprite();
    logo.x = canvas.width/2;
    logo.y = canvas.height/2;
    logo.xoffset = -logo.width/2;
    logo.yoffset = -logo.height/2;
    logo.image = Textures.load("http://www.jar42.com/brine/lab1/images/crichton.jpg");
    logo.update = function(d){
        logo.rotation += 0.01;
    }
    mainMenu.stage.addChild(logo);
    
    var newGame = new TextButton("New Game");
    newGame.center = true;
    newGame.label.dropShadow = true;
    newGame.label.fontSize = 30;
    newGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(newGame);
    
    newGame.func = function(){
        screenMan.push(gameScreen);
    }
    
    var resumeGame = new TextButton("Resume Game");
    resumeGame.y = 50;
    resumeGame.center = true;
    resumeGame.label.dropShadow = true;
    resumeGame.label.fontSize = 30;
    resumeGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(resumeGame);
}

var gameScreen = new Screen(false, true);
gameScreen.image = Textures.load("http://i.imgur.com/5BOdpGT.png");

//Override the empty init function to set some properties
gameScreen.init = function(){
    //Since we set a background we want the screen to fill  the canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    //Create new Sprites
			var mySprite = new Sprite();
			var mySpriteCol = new Sprite();
			var metSprite = new Sprite();
			var metSpriteCol = new Sprite();
			
			//Set dimensions
			mySprite.width = 256;
			mySprite.height = 256;
			mySpriteCol.width = 256;
			mySpriteCol.height = 256;
			metSprite.width = 256;
			metSprite.height = 256;
			metSpriteCol.width = 256;
			metSpriteCol.height = 256;
			
			//Shift the sprite so that its origin is at its center
			//The offset is negative because we are moving the sprite relative to its origin and not the origin relative to the sprite
			mySprite.xoffset = -mySprite.width/2;
			mySprite.yoffset = -mySprite.height/2;
			mySpriteCol.xoffset = -mySpriteCol.width/2;
			mySpriteCol.yoffset = -mySpriteCol.height/2;
			metSprite.xoffset = -metSprite.width/2;
			metSprite.yoffset = -metSprite.height/2;
			metSpriteCol.xoffset = -metSpriteCol.width/2;
			metSpriteCol.yoffset = -metSpriteCol.height/2;
			
			//Set the sprite's texture
			mySprite.image = Textures.load("http://i.imgur.com/1zAqAlr.png");
			mySpriteCol.image = Textures.load("http://i.imgur.com/mMPbkg3.png");
			metSprite.image = Textures.load("http://i.imgur.com/Yo95hzI.png");
			metSpriteCol.image = Textures.load("http://i.imgur.com/oE1Juk7.png");
			
			//x and y start for meteor sprites
			metSprite.x = canvas.width/2;
			metSprite.y = canvas.height/2;
			metSpriteCol.x = canvas.width/2;
			metSpriteCol.y = canvas.height/2;
			
			//Add the sprite to the world
			this.stage.addChild(mySpriteCol);
			this.stage.addChild(metSpriteCol);
			//this.stage.addChild(metSprite);
			//this.stage.addChild(mySprite);
			
			//A
			gInput.addBool(65, "left");
			//D
			gInput.addBool(68, "right");
			//S
			gInput.addBool(83, "down");
			//W
			gInput.addBool(87, "up");
			//Q
			gInput.addBool(37, "rotL");
			//E
			gInput.addBool(39, "rotR");
			
			//Override the default update function
			//Define some variables to hold the sprite's x and y velocities
			var xvel = 1;
			var yvel = 1;
			mySprite.update = function(d){
				//Define a speed to move at
				var speed = 2;
				
				//If the A key is pressed move to the left
				if(gInput.left){
					this.x -= speed;
				}
				
				//If the D key is pressed move to the right
				if(gInput.right){
					this.x += speed;
				}
				
				//If the S key is pressed move down
				if(gInput.down){
					//Note that an increasing y means moving down the screen
					this.y += speed;
				}
				
				//If the W key is pressed move up
				if(gInput.up){
					this.y -= speed;
				}
				
				if(gInput.rotL){
					this.rotation -= 0.1;
				}
				
				if(gInput.rotR){
					this.rotation += 0.1;
				}
				
				//Make the sprite warp to the opposite side of the canvas when it goes off a side
				//If it goes off the left or right edge
				if(this.x < 0){
					this.x = canvas.width; //Place it on the right side
				}else if(this.x > canvas.width){
					this.x = 0; //Place it on the left side
				}
				
				//If it goes off the top or bottom edge
				if(this.y < 0){
					this.y = canvas.height; //Place it at the bottom
				}if(this.y > canvas.height){
					this.y = 0; //Place it at the top
				}
				
				//Find the horizontal distance between the sprite and the mouse
				var xDis = gInput.mouse.x-this.x;
				
				//Find the vertical distance between the sprite and the mouse
				var yDis = gInput.mouse.y-this.y;
			}
			
			mySpriteCol.update = function(d){
				
				//to check if basic collision is working
				if( hitbox(this, metSpriteCol) ){
					if(collision(this, this.x, this.y, metSpriteCol, metSpriteCol.x, metSpriteCol.y)){
						console.log("INTERSECTION!!!!");
					}
				}
				
				//Define a speed to move at
				var speed = 2;
				
				//If the A key is pressed move to the left
				if(gInput.left){
					this.x -= speed;
				}
				
				//If the D key is pressed move to the right
				if(gInput.right){
					this.x += speed;
				}
				
				//If the S key is pressed move down
				if(gInput.down){
					//Note that an increasing y means moving down the screen
					this.y += speed;
				}
				
				//If the W key is pressed move up
				if(gInput.up){
					this.y -= speed;
				}
				
				if(gInput.rotL){
					this.rotation -= 0.1;
				}
				
				if(gInput.rotR){
					this.rotation += 0.1;
				}
				
				//Make the sprite warp to the opposite side of the canvas when it goes off a side
				//If it goes off the left or right edge
				if(this.x < 0){
					this.x = canvas.width; //Place it on the right side
				}else if(this.x > canvas.width){
					this.x = 0; //Place it on the left side
				}
				
				//If it goes off the top or bottom edge
				if(this.y < 0){
					this.y = canvas.height; //Place it at the bottom
				}if(this.y > canvas.height){
					this.y = 0; //Place it at the top
				}
				
				//Find the horizontal distance between the sprite and the mouse
				var xDis = gInput.mouse.x-this.x;
				
				//Find the vertical distance between the sprite and the mouse
				var yDis = gInput.mouse.y-this.y;
			}
}

var pauseMenu = new Screen(false, true);
//Override the empty init function to set some properties
pauseMenu.init = function(){
    //Since we set a background we want the screen to fill  the canvas
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.gui.x = canvas.width/2;
    this.gui.y = canvas.height/2;
    
    var resumeGame = new TextButton("Resume Game");
    resumeGame.center = true;
    resumeGame.label.dropShadow = true;
    resumeGame.label.fontSize = 30;
    resumeGame.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(resumeGame);
    resumeGame.func = function(){
        screenMan.remove(pauseMenu);
    }
    
    var returnToMenu = new TextButton("Main Menu");
    returnToMenu.y = 50;
    returnToMenu.center = true;
    returnToMenu.label.dropShadow = true;
    returnToMenu.label.fontSize = 30;
    returnToMenu.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.gui.addChild(returnToMenu);
    returnToMenu.func = function(){
        screenMan.remove(pauseMenu);
        screenMan.remove(gameScreen);
    }
}

gInput.addFunc(27, function(){
    if(screenMan.screens.find(gameScreen) && !screenMan.screens.find(pauseMenu)){
        screenMan.push(pauseMenu);
    }
});

//determines if sprite is within the bounds of another sprite
function hitbox(spriteA, spriteB){
    var cornerDistA = Math.sqrt(((spriteA.width/2) * (spriteA.width/2))+(((spriteA.height/2) * (spriteA.height/2))));
    var cornerDistB = Math.sqrt(((spriteB.width/2) * (spriteB.width/2))+(((spriteB.height/2) * (spriteB.height/2))));
    
    //horizontal and vertical distance between the two sprites
    var dx = spriteB.x - spriteA.x;
    var dy = spriteB.y - spriteA.y;
    
    //distance between two sprites squared (accounts for negative)
    var distSqr = dx * dx + dy * dy;
    
    //the total amount of distance from the bounding boxs' radii
    var cornerDistSum = cornerDistA + cornerDistB;
    
    //test coordinates
    //console.log(dx, dy, distSqr, cornerDistSum);
    
    //determines if two sprites are within each others boundaries
    if(distSqr < cornerDistSum * cornerDistSum) return true;
    else return false;
}

function collision(spriteA, ax, ay, spriteB, bx, by){
	
	//no floating points for exact pixels
	ax = Math.round(ax);
	ay = Math.round(ay);
	bx = Math.round(bx);
	by = Math.round(by);
	
	//adjustable width and heights of sprites
	var aw = spriteA.width,
	    ah = spriteA.height,
	    bw = spriteB.width,
	    bh = spriteB.height;
	    
	//account for centering assuming all sprites have origin at center
	ax -= (aw/2 + 0.5) << 0;
	ay -= (ah/2 + 0.5) << 0;
	bx -= (bw/2 + 0.5) << 0;
	by -= (bh/2 + 0.5) << 0;
	
	//find top left and bottom right corners of overlapping area
	//added constants to account for rotation
	var xLeft = Math.max(ax, bx),
		yLeft = Math.max(ay, by),
		xRight = Math.min(ax+aw, bx+bw),	 
		yRight = Math.min(ay+ah, by+bh);
		
	//automatically return false if top left is not to the left of bottom right
	if( xLeft >= xRight || yLeft >= yRight) return false;
	
		
	//checking all pixels in overlapping area for collision
	for(var xPix = xLeft; xPix < xRight; xPix++){
		for(var yPix = yLeft; yPix < yRight; yPix++){
			if((spriteA.alpha[((xPix-ax) + (yPix-ay)*aw)] >= 0.5)
			   &&
			   (spriteB.alpha[((xPix-bx) + (yPix-by)*bw)] >= 0.5)){
			   		return true;
			}
			console.log(spriteA.alpha[((xPix-ax) + (yPix-ay)*aw)]);
			console.log(spriteB.alpha[((xPix-bx) + (yPix-by)*bw)]);
		}
	}
	
	return false;
}
