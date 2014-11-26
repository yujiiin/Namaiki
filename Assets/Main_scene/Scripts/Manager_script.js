#pragma strict


var tile : Transform;
var tile1 : Transform;
var tile2 : Transform;
var block : Transform;
var tile1Probability = 20.0;
var tile2Probability = 5.0;
var slime : Transform;
var Geji : Transform;

var yusha : GameObject;
var yushaCamera : GameObject;
var mainCamera : GameObject;
var yushaStart : boolean;
var yushaScript : Yusha_Movement;

var bossPlacing : boolean;
var bossPlaced : boolean;
var boss : Transform;

var yushaHP : int = 300;
var HPBar : Texture;
var hpBarLength = 100;

var yushaATK : int = 1;
var enemyHP : int [];

var mapInfo : int [,];

var tappedPosition : Vector3;
var releasedPosition : Vector3;
var movedDistance : Vector3;

var offset = 50;

var customSkin : GUISkin;
function Start () {
		Instantiate(yusha,Vector3(6,2,1.5),Quaternion.Euler(90, 270, 270));
		Instantiate(yushaCamera,Vector3(6,0,2),Quaternion.Euler(-90,180,0));
		
		yushaCamera = GameObject.FindWithTag ("YushaCamera");
		mainCamera = GameObject.FindWithTag ("MainCamera");
		yusha = GameObject.FindWithTag ("Yusha");
		yushaCamera.transform.parent = yusha.transform;
		/*
		var parent : GameObject = Instantiate(yusha,Vector3(6,2,1.5),Quaternion.Euler(90, 270, 270));
		var child : GameObject = Instantiate(yushaCamera,Vector3(6,0,2),Quaternion.Euler(-90,180,0));
		yushaCamera = GameObject.FindWithTag ("YushaCamera");
		child.transform.parent = parent.transform;
		*/
		
		yushaCamera.camera.enabled = false;
		
		yushaScript = GameObject.FindGameObjectWithTag("Yusha").GetComponent("Yusha_Movement");
		bossPlacing = false;
		bossPlaced = false;
		yushaStart = false;
		
		mapInfo = new int[50,50];
		for(var i=0;i<50;i++){
			for(var j=0;j<50;j++){
				mapInfo[i,j] = 0;
			}
		}
		
		PlaceTiles();
		
		Instantiate(boss,Vector3(0,0,0),Quaternion.Euler(90, 0, 0));	
}

function Update () {
	if(!bossPlacing){
		if(Input.GetMouseButtonDown(0) && mainCamera.camera.enabled && !yushaCamera.camera.enabled){
			var hit : RaycastHit;
			var ray : Ray = mainCamera.camera.ScreenPointToRay(Input.mousePosition);
			if(Physics.Raycast(ray,hit)){
				if(hit.transform.gameObject.tag == "Slime"
				|| hit.transform.gameObject.tag == "Geji"
				|| hit.transform.gameObject.tag == "Egg"
				){
					Destroy(hit.collider.gameObject);
					
				}
				if(CheckMapInfoOfTappedTile(Mathf.Round(ray.origin.x),Mathf.Round(ray.origin.y))){
					if(hit.transform.gameObject.tag == "Tile"){
						mapInfo[hit.collider.gameObject.transform.position.x + 20,hit.collider.gameObject.transform.position.y +20] = -1;
						Destroy(hit.collider.gameObject);
					}
					if(hit.transform.gameObject.tag == "Tile1"){
						mapInfo[hit.collider.gameObject.transform.position.x + 20,hit.collider.gameObject.transform.position.y +20] = -1;
						Destroy(hit.collider.gameObject);
						Instantiate(slime,Vector3(Mathf.Round(ray.origin.x),Mathf.Round(ray.origin.y),2),Quaternion.identity);
					}
					if(hit.transform.gameObject.tag == "Tile2"){
						mapInfo[hit.collider.gameObject.transform.position.x + 20,hit.collider.gameObject.transform.position.y +20] = -1;
						Destroy(hit.collider.gameObject);
						Instantiate(Geji,Vector3(Mathf.Round(ray.origin.x),Mathf.Round(ray.origin.y),2),Quaternion.identity);
					}
				}
				tappedPosition = ray.origin;
			}
		}
	}else if(bossPlacing && yushaStart == false){
		if(Input.GetMouseButtonDown(0)){
			var hit1 : RaycastHit;
			var ray1 : Ray = mainCamera.camera.ScreenPointToRay(Input.mousePosition);
			if(Physics.Raycast(ray1,hit1)){
				if(CheckMapInfoOfBossPlace(Mathf.Round(ray1.origin.x),Mathf.Round(ray1.origin.y))){
					//Instantiate(boss,Vector3(Mathf.Round(ray1.origin.x),Mathf.Round(ray1.origin.y),1.5),Quaternion.Euler(90, 0, 0));
					GameObject.FindGameObjectWithTag("Boss").transform.position += Vector3(Mathf.Round(ray1.origin.x),Mathf.Round(ray1.origin.y),1.5);
					bossPlaced = true;
					bossPlacing = false;
				}
			}	
			tappedPosition = ray1.origin;	
		}
	}

	if(Input.GetMouseButtonUp(0)){
		var hit2 : RaycastHit;
		var ray2 : Ray = mainCamera.camera.ScreenPointToRay(Input.mousePosition);
		if(Physics.Raycast(ray2,hit2)){
			releasedPosition = ray2.origin;
			movedDistance = releasedPosition - tappedPosition;
			if(movedDistance.magnitude > 2){
				mainCamera.transform.position -= movedDistance;
			
			}
		}
	}
	
}



function PlaceTiles(){
		for(var x4=-11;x4<13;x4++){
			var y4 = -7;
			Instantiate(block,Vector3(x4,y4,2),Quaternion.identity);
		}
		for(var y5=-7;y5<3;y5++){
			var x5 = -12;
			Instantiate(block,Vector3(x5,y5,2),Quaternion.identity);
		}
		for(var y6=-7;y6<3;y6++){
			var x6 = 12;
			Instantiate(block,Vector3(x6,y6,2),Quaternion.identity);
		}


		for(var x=-11;x<6;x++){
			for(var y=-6;y<3;y++){
				var p = Random.Range(0,100);
				if(p< tile2Probability){
					Instantiate(tile2,Vector3(x,y,2),Quaternion.identity);
					mapInfo[x+offset,y+offset] = 2;
				}else if(tile2Probability <= p && p < (tile1Probability+tile2Probability)){
					Instantiate(tile1,Vector3(x,y,2), Quaternion.identity);
					mapInfo[x+offset,y+offset] = 1;
				}else{
					Instantiate(tile,Vector3(x,y,2), Quaternion.identity);
					mapInfo[x+offset,y+offset] = 0;
				}
			}
		}
		for(var x1=7;x1<12;x1++){
			for(var y1=-6;y1<3;y1++){
				var p1 = Random.Range(0,100);
				if(p1< tile2Probability){
					Instantiate(tile2,Vector3(x1,y1,2),Quaternion.identity);
					mapInfo[x1+offset,y1+offset] = 2;
				}else if(tile2Probability <= p1 && p1 < (tile1Probability+tile2Probability)){
					Instantiate(tile1,Vector3(x1,y1,2), Quaternion.identity);
					mapInfo[x1+offset,y1+offset] = 1;
				}else{
					Instantiate(tile,Vector3(x1,y1,2), Quaternion.identity);
					mapInfo[x1+offset,y1+offset] = 0;
				}
			}
		}
		
		for(var y2=-6;y2<0;y2++){
			var x2 = 6;
			var p2 = Random.Range(0,100);
			if(p2< tile2Probability){
				Instantiate(tile2,Vector3(x2,y2,2),Quaternion.identity);
				mapInfo[x2+offset,y2+offset] = 2;
			}else if(tile2Probability <= p2 && p2 < (tile1Probability+tile2Probability)){
				Instantiate(tile1,Vector3(x2,y2,2), Quaternion.identity);
				mapInfo[x2+offset,y2+offset] = 1;
			}else{
				Instantiate(tile,Vector3(x2,y2,2), Quaternion.identity);
				mapInfo[x2+offset,y2+offset] = 0;
			}
		}
		for(var y3=0;y3<3;y3++){
			var x3 = 6;
			mapInfo[x3+offset,y3+offset] = -1;
		}
}

function CheckMapInfoOfTappedTile(x:int, y:int){
	if((mapInfo[x+offset+1,y+offset] == -1) ||
	   (mapInfo[x+offset-1,y+offset] == -1) ||
	   (mapInfo[x+offset,y+offset+1] == -1) ||
	   (mapInfo[x+offset,y+offset-1] == -1) ){
	   	return true;
	   }
}

function CheckMapInfoOfBossPlace(x:int, y:int){
	if(((mapInfo[x+offset+1,y+offset] == -1) ||
	   (mapInfo[x+offset-1,y+offset] == -1) ||
	   (mapInfo[x+offset,y+offset+1] == -1) ||
	   (mapInfo[x+offset,y+offset-1] == -1)) &&
	   (mapInfo[x+offset,y+offset] == -1)
	   ){
	   	return true;
	   }
}

function CheckDirection(direction : int, currentPositionX : int, currentPositionY : int) : boolean{
	switch(direction){
		case 1: //up
			if(mapInfo[currentPositionX + offset, currentPositionY + offset +1] == -1){
				return true;
			}else{
				return false;
			}
			break;
		case 2: //down
			if(mapInfo[currentPositionX + offset, currentPositionY + offset -1] == -1){
				return true;
			}else{
				return false;
			}
			break;
		case 3: //right
			if(mapInfo[currentPositionX + offset -1, currentPositionY + offset] == -1){
				return true;
			}else{
				return false;
			}
			break;
		case 4: //left
			if(mapInfo[currentPositionX + offset +1, currentPositionY + offset] == -1){
				return true;
			}else{
				return false;
			}
			break;
		default:
			return false;
			break;
	}

}
function OnGUI(){
		GUI.skin = customSkin;
		
		if(GUI.Button(Rect(350,0,100,50),"Zoom!")){
			mainCamera.camera.enabled = false;
			yushaCamera.camera.enabled = true;

		}
		if(GUI.Button(Rect(350,50,100,50),"Back!")){
			mainCamera.camera.enabled = true;
			yushaCamera.camera.enabled = false;
		}
		
		if(!bossPlacing && !bossPlaced){
			if(GUI.Button(Rect(150, 0,150,50),"Place Boss")){
				bossPlacing = true;
				//Instantiate(boss,Vector3(0,3,2),Quaternion.identity);
			}
		}else if(bossPlacing && bossPlaced == false){
			GUI.Box(Rect(150,0,150,50),"Click to deploy!");

		}else if(bossPlaced && yushaStart == false){
			if(GUI.Button(Rect(150,0,150,50),"Come on, Yusha!")){
				yushaStart = true;
				yushaScript.yushaStart = true;
			}
		}
		
		//GUI.Label(Rect(0,0,100,50),"HP : " + yushaHP);
		GUI.DrawTexture(Rect(10,10,hpBarLength,10),HPBar);
}

function DamageToYusha(damage : int){
	yushaHP -= damage;
	hpBarLength = hpBarLength * yushaHP /100;
	if(yushaHP<0){
		Application.LoadLevel(1);
	}
	
}

