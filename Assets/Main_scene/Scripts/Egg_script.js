#pragma strict

var startTime : float;
var hatchTime : float = 5.0;
var geji : Transform;

function Start () {
	startTime = Time.time;
}

function Update () {
	if((Time.time-startTime)>hatchTime){
		Destroy(gameObject);
		Instantiate(geji,Vector3(transform.position.x,transform.position.y,2),Quaternion.identity);
	}
}