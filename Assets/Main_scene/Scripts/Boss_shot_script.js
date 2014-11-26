#pragma strict

var nextFrameTime : float;
var animationSpeed : float = 0.2;
var frameOffset : float;
var speed : int = 0.1;
var damage : int = 1;
var manager : Manager_script;
var yusha : GameObject;
var boss : GameObject;
var direction : Vector3;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Manager").GetComponent("Manager_script");
	yusha = GameObject.FindGameObjectWithTag("Yusha");
	boss = GameObject.FindGameObjectWithTag("Boss");
	direction = yusha.transform.position - boss.transform.position;
}

function Update () {
	frameOffset = renderer.material.mainTextureOffset.y;
	if(Time.time > nextFrameTime){
		frameOffset -= 0.25;
		if(frameOffset < 0){
			frameOffset = 0.75;
		}
		nextFrameTime = Time.time + animationSpeed;
		renderer.material.mainTextureOffset.y = frameOffset;
	}
	transform.Translate(direction*speed*Time.deltaTime);
}

function OnTriggerEnter(col : Collider){
	if(col.gameObject.tag == "Yusha"){
		manager.DamageToYusha(damage);
		Destroy(gameObject);
	}
}

function OnBecameInvisible(){
	Destroy(gameObject);
}