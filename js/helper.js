
function rand(min, max){
	return Math.random() * (max - min) + min;
}

function degToRad(degrees){
	return degrees * Math.PI / 180;
}

function radToDeg(radians){
	return radians * 180 / Math.PI;
}

function convertPointToMat(p){
	return math.matrix([ p.x, p.y ]);
}

function convertMatToPoint(mat){
	return { x: mat.valueOf()[0], y: mat.valueOf()[1] };
}

function getDistance(a, b){
	var dx = (a.x-b.x);
	var dy = (a.y-b.y);
	return Math.sqrt(dx*dx+dy*dy);
}

function angleBetweenVectorsRad(fromVec, toVec){
	var fromVecLength = getDistance(fromVec,{x:0,y:0});
	fromVec.x /= fromVecLength;
	fromVec.y /= fromVecLength;
	var toVecLength = getDistance(toVec,{x:0,y:0});
	toVec.x /= toVecLength;
	toVec.y /= toVecLength;
	return Math.atan2(toVec.y,toVec.x) - Math.atan2(fromVec.y,fromVec.x);
}

function angleBetweenVectorsDeg(fromVec, toVec){
	return radToDeg(angleBetweenVectorsRad());
}

function rotateVector(vec, radians)
{
    var xNew = vec.x * Math.cos(radians) - vec.y * Math.sin(radians);
    var yNew = vec.x * Math.sin(radians) + vec.y * Math.cos(radians);
    return { x: xNew, y: yNew };
}