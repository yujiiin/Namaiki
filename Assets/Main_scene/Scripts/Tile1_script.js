#pragma strict

var slimeHitCount : int = 0;
var tile1 : Transform;
var tile2 : Transform;


function OnCollisionEnter(col : Collision){
	if(col.gameObject.tag == "Slime"){
		slimeHitCount++;
		if(slimeHitCount >=3){
			Destroy(gameObject);
			Instantiate(tile2,Vector3(tile1.position.x, tile1.position.y, 2), Quaternion.identity);
		}
	}

}