define([ 'simulation', 'ant', 'antGenetic', 'hive', 'hiveGenetic', 'food', 'collider', 'shape'], 
function(Simulation, Ant, AntGenetic, Hive, HiveGenetic, Food, Collider, Shape) {

return class Tutorial extends Simulation {
	constructor(canvas, userAntFunction, finishedFunc, part=0){
		super(canvas, AntType.CUSTOM, HiveType.DEFAULT, userAntFunction);
		// defines the part of the tutorial
		this.finishedFunc = finishedFunc;
		this.isFinished = false;
		this.part = part;
		
		// first check if ant has reached food location
		this.checkAreaFood;
		
		// then check if ant has reached hive location with food
		this.checkAreaHive;

		if (new.target === Tutorial) {
			this.init();
			this.clear();
			this.draw();
			this.loop();
		}		
	}
	
	init(){
		// don't let ants age
		this.settings.antDecayProb = 0;
		this.settings.foodDecayProb = 0;
		
		var foodPos = {x: this.canvas.width / 4*3, y: this.canvas.height / 2};
		var size = this.settings.getFoodAmount() * this.settings.getFoodSize();
		var newFood = new Food(this.canvas, foodPos, size, this.settings, this.allObjects);
		this.food.push(newFood);
		
		var hivePos = {x: this.canvas.width / 4, y: this.canvas.height / 2};
		this.hives.push(new HiveGenetic(this.canvas, hivePos, this.settings, this.allObjects));
		
		this.checkAreaFood = new Collider(this.canvas, foodPos, Shape.Type.CIRCLE, newFood.getSize()+5, 0, []);
		this.checkAreaHive = new Collider(this.canvas, hivePos, Shape.Type.CIRCLE, this.hives[0].getSize()+5, 0, []);			
		
		// First ant should be some kind of a scout.
		// Explain vision, smell and basic action concept.
		// Let it find the food and walk to it.
		var newGenes = [0.05,0.15,0.8];
		var antPos = { x: 30 + this.hives[0].getPosition().x , y: this.hives[0].getPosition().y };
		var rotation = 1.57; // downwards
		var newAnt = new AntGenetic(this.canvas, antPos, rotation, this.settings, newGenes, this.allObjects, this.hives[0].getID());
		this.hives[0].ants.push(newAnt);
		//this.hives[0].createAnt(this.allObjects);
		
		// Tutorial 2 should fortify this concept and the scout is to harvest 
		// and return back to the hive with food.
		// Explain that the hive can produce ants.
		if (this.part >= 1){
			
		}

		// In tutorial 3 create different ants good for harvesting and carrying food.
		// Introduce queen advising concept to user. This time though decide for "worker type"
		// Give hive some extra food and create 3 worker ants
		if (this.part >= 2){
			
		}
		
		// For tutorial 4 create strong soldier ants to fight off spider.
		// The scout ant should help them find the spider and fight it off.
		// let the user do that by "advising" the queen.
		if (this.part >= 3){
			
		}
	}
	
	simulate(){
		// Iterate through all hives
		this.hives[0].iterate(this.allObjects);
		
		var firstAnt = this.hives[0].getAnts()[0];
		if (this.part == 0
		&& firstAnt.collidesWith(this.checkAreaFood)
		&& firstAnt.getAngleToPos(this.checkAreaFood.getPosition()) < 0.1
		){
			// Ant has reached food 
			// end the first tutorial
			this.isFinished = true;
			this.finishedFunc();
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 1
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Ant is back at the hive
			// end the second tutorial
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 2
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Ant has "called" other ants with pheromones to food
			// they have returned all of the food back to the hive
			// end the third tutorial
		}
		
		else if (firstAnt.collidesWith(this.checkAreaHive) && this.part == 3
		&& firstAnt.getFoodStorage() == firstAnt.getMaxFoodStorage()){
			// Spider has been killed
			// end the fourth tutorial
		}
	}
	
	loop(){
		this.now = Date.now();
		this.delta = this.now - this.then;
		var interval = 1000/SettingsGlobal.getFramesPerSecond();
		if(this.delta > interval) {
			this.then = this.now - (this.delta % interval);
			this.simulate();
			this.clear();
			this.draw();
		}
		requestID = requestAnimationFrame( this.loop.bind(this) );		
	}
	
	draw(){
		super.draw();
		var ctx = this.canvas.getContext("2d")
		if (this.isFinished){
			ctx.font = "18px Times New Roman";
			ctx.textAlign = "center";
			ctx.lineWidth = 1;
			ctx.fillStyle = 'black';
			ctx.fillText("Congratulations!",this.canvas.width/2,this.canvas.height/5*4);
		}
	}
}

});