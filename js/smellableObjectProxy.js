class SmellableObjectProxy {
	constructor(canvas, distance, rotation, type){
		this._context = canvas.getContext("2d");
		this.distance = distance;
		this.rotation = rotation;
		this.type = type;
	}
	
	getDistanceToObj(){ return this.distance; }
	getRotationToObj() { return this.rotation; }
	getType(){ return this.type; }
}