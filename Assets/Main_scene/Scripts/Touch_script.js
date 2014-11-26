#pragma strict

var slime : Transform;
var Geji : Transform;

function Start () {

}

function Update () {
	//if(Input.touchCount == 1 && Input.GetTouch (0).phase == TouchPhase.Began){
	if(Input.GetMouseButtonDown(0)){
		var hit : RaycastHit;
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if(Physics.Raycast(ray,hit)){
			if(hit.transform.gameObject.tag == "Tile"
			|| hit.transform.gameObject.tag == "Slime"
			|| hit.transform.gameObject.tag == "Geji"
			|| hit.transform.gameObject.tag == "Egg"
			){
				Destroy(hit.collider.gameObject);
				
			}
			if(hit.transform.gameObject.tag == "Tile1"){
				Destroy(hit.collider.gameObject);
				Instantiate(slime,Vector3(Mathf.Round(ray.origin.x),Mathf.Round(ray.origin.y),2),Quaternion.identity);
				
			}
			if(hit.transform.gameObject.tag == "Tile2"){
				Destroy(hit.collider.gameObject);
				Instantiate(Geji,Vector3(Mathf.Round(ray.origin.x),Mathf.Round(ray.origin.y),2),Quaternion.identity);
			}
		}
	}
			
}