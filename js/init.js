var Mode = {
	TEASER : 0,
	TUTORIAL : 1
}

window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f) {
            window.setTimeout(f,1);
        }
}();

SettingsGlobal.setFramesPerSecond(document.getElementById('fps').value);
SettingsGlobal.setAutoIterateFrames(document.getElementById('autoFrame').checked);
SettingsGlobal.setShowUI(document.getElementById('showUI').checked);

Debug.setShowLife(document.getElementById('debugShowLife').checked);
Debug.setVisibility(document.getElementById('debugVisibility').checked);
Debug.setShowCollider(document.getElementById('debugCollider').checked);
Debug.setShowFoodAmount(document.getElementById('debugFoodAmount').checked);
Debug.setShowSmellingDistance(document.getElementById('debugSmellingDistance').checked);
Debug.setShowSmelledObjects(document.getElementById('debugSmelledObjects').checked);

var mode;
var sim;
var requestID;
window.onload = function(){
	setCustomContainerVisibility();
	startSimulation();
}
function setCustomContainerVisibility(){
	if (document.getElementById('AntType').value == 'Simple')
		document.getElementById('customContainer').style.display = 'none';      // Hide
	else
		document.getElementById('customContainer').style.display = 'block';      // show
}


function reset(){
	startTutorial();
	SettingsGlobal.setAutoIterateFrames(false);
	sim.clear();
	sim.draw();
}

function startSimulation(){
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	SettingsGlobal.setAutoIterateFrames(true);
	Math.seedrandom(document.getElementById('seed').value);
	sim = new Simulation();
	sim.init();
	sim.clear();
	sim.draw();
	sim.loop();
	mode = Mode.TEASER;
}

function startTutorial(){
	window.cancelAnimationFrame(requestID);
	requestID = undefined;
	SettingsGlobal.setAutoIterateFrames(true);
	sim = new TutorialRunCircle();
	sim.init();
	sim.clear();
	sim.draw();
	mode = Mode.TUTORIAL;
}