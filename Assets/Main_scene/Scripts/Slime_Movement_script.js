#pragma strict

var speedX : float;
var speedY : float;
var startTime : float;
var lifeTime : float = 60.0;
var shrinkAmount : float = 0.001;
var shrinking : boolean;
var battling : boolean;
var damage : int = 1;
var nextAttack : float =0;
var attackInterval : float = 5.0;

var manager : Manager_script;
var yusha : Yusha_Movement;
var enemyHP : int = 3;

function Start () {
	startTime = Time.time;
	shrinking = true;
	battling = false;
	moveSpeed();
	//get manager script component
	manager = GameObject.FindGameObjectWithTag("Manager").GetComponent("Manager_script");
	yusha = GameObject.FindGameObjectWithTag("Yusha").GetComponent("Yusha_Movement");
}

function Update () {	
	if((Time.time - startTime)<lifeTime){
		if(!battling){
			transform.Translate(Vector3(speedX*Time.deltaTime,speedY*Time.deltaTime,0));
		}else if(battling){
			AttackToYusha();
			rigidbody.velocity = Vector3.zero;
		}
	}else{
		Destroy(gameObject);
	}

	
	if(shrinking == true && transform.localScale.x>0.3){
		transform.localScale = Vector3(transform.localScale.x - shrinkAmount,transform.localScale.y - shrinkAmount,1);
	}else if(shrinking == true && transform.localScale.x<=0.3){
		shrinking = false;	
	}else if(shrinking == false && transform.localScale.x<=0.5){
		transform.localScale = Vector3(transform.localScale.x + shrinkAmount,transform.localScale.y + shrinkAmount,1);
	}else if(shrinking == false && transform.localScale.x>0.5){
		shrinking = true;
	}
	
}

function OnCollisionEnter(col : Collision){
	if(col.gameObject.tag == "Tile"
		|| col.gameObject.tag == "Tile1"
		|| col.gameObject.tag == "Tile2"
		|| col.gameObject.tag == "Block"
	){
		moveSpeed();
	}else if(col.gameObject.tag == "Yusha"){
		battling = true;
	}
}

function AttackToYusha(){
	if(nextAttack < Time.time){
		manager.DamageToYusha(damage);
		nextAttack = Time.time + attackInterval;
	}
}

function DamageFromYusha(damage : int){
	enemyHP -= damage;
	if(enemyHP<=0){
		Destroy(gameObject);
		yusha.activeBattleNum--;
		//Debug.Log(yusha.activeBattleNum);
	}
}

function moveSpeed(){
	speedX = Random.Range(-0.5,0.5);
	speedY = Mathf.Sqrt(0.25-speedX*speedX);
	var p = Random.Range(0,100);
	if(p<50){
		speedY = -speedY;
	}

}