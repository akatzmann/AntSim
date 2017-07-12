class Simulation {
	constructor(){
		this.canvas = document.getElementById("terrarium");
		this.now;
		this.then = Date.now();
		this.delta;
		this.iteration = 0;
		this.collisionObjects = [];
		this.hive;
		this.food = [];
		this.environmentObjs = [];
		this.settings = new SettingsSimulation();
		this.graph = new Graph();
	}

	init(){
		var context = this.canvas.getContext("2d");
		var hivePos = { x: this.canvas.width/2, y: this.canvas.height/2 };
		this.hive = new Hive(this.canvas, hivePos, this.settings, this.collisionObjects);
	}
	
	simulate(){
		this.hive.iterate();
		this.foodDecay();
		this.foodCreation();
	}
	
	foodDecay(){
		for (var i = 0; i < this.food.length; i++) {
			this.food[i].decay();
			// remove food if it is "empty"
			if (this.food[i].isEmpty() && i > -1){
				for (var a =0; a < this.collisionObjects.length; a++){
					if (this.collisionObjects[a] == this.food[i])	
						this.collisionObjects.splice(a, 1);
				}
				this.food.splice(i, 1);
			}
		}
	}
	
	foodCreation(){
		// food creation
		var maxFoodNmb = this.settings.getFoodMaxSiteNumber();
		var reduceByTime = this.iteration/1000.0*this.settings.getFoodCreationPropability()/10;
		var reduceBySiteNumber = (maxFoodNmb-this.food.length)/maxFoodNmb;
		var probability = (this.settings.getFoodCreationPropability()-reduceByTime)*reduceBySiteNumber;
		var createFood = Math.floor(rand(0,1+probability));
		if (createFood && this.food.length < this.settings.getFoodMaxSiteNumber()){
			// food is positioned all over the ground
			var foodPos = { x: rand(0,this.canvas.width), y: rand(0,this.canvas.height) };
			var newFood = new Food(this.canvas, foodPos, this.settings, this.collisionObjects);
			this.food.push(newFood);
			this.collisionObjects.push(newFood);
		}
	}
	
	clear(){
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	loop(){

		// game ended
		if (this.hive.getAnts().length == 0){
			this.clear();
			this.draw();
			document.getElementById('frame').value = this.iteration;
			showGraph();
			this.updateGraph();
			return;
		}
		
		this.now = Date.now();
		this.delta = this.now - this.then;
		var interval = 1000/SettingsGlobal.getFramesPerSecond();
		if (SettingsGlobal.getShowUI()){
			if(this.delta > interval) {
				this.then = this.now - (this.delta % interval);
				this.simulate();
				this.clear();
				this.draw();
				this.graph.addPoint(this.iteration, this.hive.getAnts().length);
			}
				
			if (SettingsGlobal.getAutoIterateFrames()){
				requestID = requestAnimationFrame( this.loop.bind(this) );
			}
		}
		else {
			this.simulate();
			this.graph.addPoint(this.iteration, this.hive.getAnts().length);
			window.setZeroTimeout(this.loop.bind(this));
		}
		
		this.iteration++;
		if (SettingsGlobal.getShowUI() || this.iteration % 50 == 0 )
			document.getElementById('frame').value = this.iteration;
	}

	draw()
	{		
		for (var i = 0; i < this.environmentObjs.length; i++) {
			this.environmentObjs[i].draw();
		}
		if (typeof(this.hive) !== "undefined")
			this.hive.draw();

		for (var i = 0; i < this.food.length; i++) {
			this.food[i].draw();
		}
		if (this.hive instanceof Hive){
			for (var i = 0; i < this.hive.getAnts().length; i++) {
				this.hive.getAnts()[i].draw();
			}
		}
	}
	
	updateGraph(){
		this.graph.updateView();
	}
}