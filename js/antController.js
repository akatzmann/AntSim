define(['controller'], 
function(Controller) {

/**
 * The AntController enables the user to program his/hers ants behaviour.<br>
 * It has limited access to some of the ants current values.<br>
 * The action for the upcoming iteration is to be written by the user.<br>
 * @class
 * @augments Controller
 */
return class AntController extends Controller {
    /**
    * @ignore 
    */
	constructor(ant, userAntFunction){
		super(ant);
		this.parentID = 0;
		this.food = 0;
		this.foodMax = 0;
		this.canSetPheromone = false;
		// simulation constructor is called directly
		if (new.target === AntController)
			this.userAntFunction = userAntFunction;
		
		this.setAttributes(ant);
	}
	
	static createEditor(elementID, defaultValue){
		var antControllerWordCompleter = {
			getCompletions: function(editor, session, pos, prefix, callback) {
				var wordList = AntController.getAutoCompletionWordList();
				callback(null, wordList.map(function(word) {
					return {
						caption: word,
						value: word,
						meta: "This ant"
					};
				}));
			}
		}
		var globalWordCompleter = {
			getCompletions: function(editor, session, pos, prefix, callback) {
				var wordList = ["this."];
				callback(null, wordList.map(function(word) {
					return {
						caption: word,
						value: word,
						meta: "global"
					};
				}));
			}
		}
		ace.require("ace/ext/language_tools");
		var customAntEditor = ace.edit(elementID);
		customAntEditor.$blockScrolling = Infinity;
		customAntEditor.setTheme("ace/theme/chrome");
		customAntEditor.session.setMode("ace/mode/javascript");
		customAntEditor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});
		customAntEditor.completers = [globalWordCompleter, antControllerWordCompleter];
		customAntEditor.setValue(defaultValue);
		return customAntEditor;
	}
	
	static getAutoCompletionWordList(){
		return ["getFoodStorage()",
				"getLife()", 
				"getMaxFoodStorage()",
				"getNearestEnemyAnt()",
				"getNearestObjectType()",
				"getObjectOfID()",
				"getOwnHive()",
				"getParentID()",
				"getSmelledObjs()",
				"getVisibleObjs()", 
				];
	}
	
	setAttributes(ant){
		super.setAttributes(ant);
		this.parentID = ant.getParentID();
		this.food = ant.getFoodStorage();
		this.foodMax = ant.getMaxFoodStorage();
		this.canSetPheromone = ant.canSetPheromone();
	}
	
	getAction(){
		//eval('(' + document.getElementById("customIterate").value + ')');
		var result = [ActionType.NONE, 0, 0];
		try{
			var newResult;
			try{
				newResult = this.userAntFunction.call(this);
			}
			catch (runtimeError) {
				console.error("legal code; unforeseen result: ", runtimeError);
				console.info(runtimeError.name ,"-", runtimeError.message);
				window.cancelAnimationFrame(requestID);
				requestID = undefined;
			}
			//console.log(result);
			if (newResult == null) {throw "no result value given!"; }
			if (newResult.length != 3){throw "User input incorrect - return value needs 3 elements!"; }
			if (newResult[0] < 0 || newResult[0] > 4){throw "User input incorrect - First element has to be a ActionType!"; }
			else
				result = newResult;
		}
		catch (syntaxError) {
			console.error("illegal code; syntax errors: ", syntaxError);
			console.info(syntaxError.name ,"-", syntaxError.message);
			window.cancelAnimationFrame(requestID);
			requestID = undefined;
		}
		//console.log(result);
		return result;
	}
	
	/**
	* Get the ID of the ants hive
	* @return {number} parentID.
	*/
	getParentID(){return this.parentID;}

	/**
	* Get the current food the ant carries around.
	* @return {number} food.
	*/
	getFoodStorage(){return this.food;}

	/**
	* Get the maximum amount of food the ant can carry.
	* @return {number} maximum food.
	*/
	getMaxFoodStorage(){return this.foodMax;}

	
	getNearestEnemyAnt(){
		var minDist = 1000;
		var prey = null;
		for (var id in this.visibleObjs){
			if(this.visibleObjs[id].getType() == ObjectType.ANT
			&& this.visibleObjs[id].getParentID() != this.getParentID()
			&& this.visibleObjs[id].getDistanceToObj() < minDist){
				minDist = this.visibleObjs[id].getDistanceToObj();
				var prey = this.visibleObjs[id];
			}
		}
		if(prey==null){
			for (var id in this.smelledObjs){
				if(this.smelledObjs[id].getType() == ObjectType.ANT
				&& this.smelledObjs[id].getParentID() != this.getParentID()
				&& this.smelledObjs[id].getDistanceToObj() < minDist){
					minDist = this.smelledObjs[id].getDistanceToObj();
					var prey = this.smelledObjs[id];
				}
			}
		}
		return prey;		
	}
	
	getOwnHive(){
		var hive = null;
		for (var id in this.visibleObjs){
			if (this.visibleObjs[id].getType() == ObjectType.HIVE
			&& this.visibleObjs[id].getParentID() == this.getParentID()){
				hive = this.visibleObjs[id];
			}
		}
		
		// no food visible -> try smelling
		if (hive == null){
			for (var id in this.smelledObjs){
				if (this.smelledObjs[id].getType() == ObjectType.HIVE
				&& this.smelledObjs[id].getParentID() == this.getParentID()){
					hive = this.smelledObjs[id];
				}
			}
		}	
		return hive;
	}
}

});