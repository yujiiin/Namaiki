#pragma strict

var speedX : float;
var speedY : float;
var moveSpeed : float = 0.5;
var slimeAteCount : int;
var egg : Transform;
var up : boolean;
var down : boolean;
var left : boolean;
var right : boolean;
var startTime : float;
var lifeTime : float = 60.0;
var shrinkAmount : float = 0.001;
var shrinking : boolean;
var battling : boolean;
var damage : int = 3;
var nextAttack : float = 0;
var attackInterval : float = 5.0;
var enemyHP : int = 5;

var manager : Manager_script;
var yusha : Yusha_Movement;

function Start () {
	slimeAteCount = 0;
	startTime = Time.time;
	shrinking = true;
	battling = false;
	movement();
	
	manager = GameObject.FindGameObjectWithTag("Manager").GetComponent("Manager_script");
	yusha = GameObject.FindGameObjectWithTag("Yusha").GetComponent("Yusha_Movement");
	
	
}

function Update () {
	if((Time.time - startTime)<lifeTime){
		if(!battling){
			transform.Translate(Vector3(speedX*Time.deltaTime,speedY*Time.deltaTime,0));
		}else if (battling){
			AttackToYusha();
			rigidbody.velocity = Vector3.zero;
		}	
		
		
	}else{
		Destroy(gameObject);
	}
	
	if(shrinking == true && transform.localScale.x>0.6){
		transform.localScale = Vector3(transform.localScale.x - shrinkAmount,transform.localScale.y - shrinkAmount,1);
	}else if(shrinking == true && transform.localScale.x<=0.6){
		shrinking = false;	
	}else if(shrinking == false && transform.localScale.x<=0.7){
		transform.localScale = Vector3(transform.localScale.x + shrinkAmount,transform.localScale.y + shrinkAmount,1);
	}else if(shrinking == false && transform.localScale.x>0.7){
		shrinking = true;
	}	
}

function AttackToYusha(){
	if(nextAttack<Time.time){
		manager.DamageToYusha(damage);
		nextAttack = Time.time + attackInterval;
	}

}

function DamageFromYusha(damage : int){
	enemyHP -= damage;
	if(enemyHP <=0){
		Destroy(gameObject);
		yusha.activeBattleNum--;
	}
}


function movement(){
	speedX = 0;
	speedY = moveSpeed;
	var p = Random.Range(0,100);
	if(p<25 && up != true){
		up = true;
		down = false;
		left = false;
		right = false;
		transform.position.y = Mathf.Round(transform.position.y);
		transform.eulerAngles = Vector3(0,0,0);
	}else if(p<50 && down != true){
		up = false;
		down = true;
		left = false;
		right = false;
		transform.position.y = Mathf.Round(transform.position.y);
		transform.eulerAngles = Vector3(0,0,180);
	}else if(p<75 && left != true){
		up = false;
		down = false;
		left = true;
		right = false;
		transform.position.x = Mathf.Round(transform.position.x);
		transform.eulerAngles = Vector3(0,0,270);
	}else if(p<=100 && right != true){
	 	up = false;
		down = false;
		left = false;
		right = true;
		transform.position.x = Mathf.Round(transform.position.x);
		transform.eulerAngles = Vector3(0,0,90);
	}else{
		movement();
	}

}


function OnCollisionEnter(col : Collision){
	if(col.gameObject.tag == "Tile"
	|| col.gameObject.tag == "Tile1"
	|| col.gameObject.tag == "Tile2"
	|| col.gameObject.tag == "Block"
	){
		movement();
	}
	else if(col.gameObject.tag == "Slime"){
		Destroy(col.gameObject);
		slimeAteCount++;
		if(slimeAteCount>2){
			Instantiate(egg,Vector3(transform.position.x,transform.position.y,2),Quaternion.identity);
			slimeAteCount=0;
		}
		
	}else if(col.gameObject.tag == "Yusha"){
		battling = true;
	}

}



