#pragma strict

var nextAttack : float = 0;
var attackInterval : float = 3.0;


var yusha : GameObject;
var manager : Manager_script;
var bossProjectile : Transform;
var enemyHP = 10;

function Start () {

}

function Update () {
	manager = GameObject.FindGameObjectWithTag("Manager").GetComponent("Manager_script");
	yusha = GameObject.FindGameObjectWithTag("Yusha");
	transform.LookAt(yusha.transform,Vector3.forward);
	
	if(nextAttack < Time.time && manager.yushaStart){
		Instantiate(bossProjectile,Vector3(this.transform.position.x,this.transform.position.y,2),Quaternion.identity);
		nextAttack = Time.time + attackInterval;
	}
}

function DamageFromYusha(damage : int){
	enemyHP -= damage;
	if(enemyHP <=0){
		Destroy(gameObject);
		yusha.GetComponent(Yusha_Movement).activeBattleNum--;
		Application.LoadLevel(1);
	}
}

function OnCollisionEnter(col : Collision){}