#pragma strict

var slimeHitCount : int = 0;
var tile : Transform;
var tile1 : Transform;


function OnCollisionEnter(col : Collision){
	if(col.gameObject.tag == "Slime"){
		slimeHitCount++;
		if(slimeHitCount >=1){
			Destroy(gameObject);
			Instantiate(tile1,Vector3(tile.position.x, tile.position.y, 2), Quaternion.identity);
		}
	}

}
