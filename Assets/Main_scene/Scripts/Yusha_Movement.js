#pragma strict

// 必要なコンポーネントの列記
@script RequireComponent(Rigidbody)
@script RequireComponent(CapsuleCollider)
@script RequireComponent(Animator)

var speed : float = 0;
var moveSpeedX : float = 1;				
var moveSpeedZ : float = 1;	
		
var animSpeed : float = 1.5f;// アニメーション再生速度設定
var lookSmoother : float = 3.0f;	// a smoothing setting for camera motion
var useCurved : boolean = false;			// Mecanimでカーブ調整を使うか設定する
		// このスイッチが入っていないとカーブは使われない
var useCurvesHeight : float = 0.5f;	// カーブ補正の有効高さ（地面をすり抜けやすい時には大きくする）
// キャラクターコントローラ（カプセルコライダ）の移動量
var velocity : Vector3;
// CapsuleColliderで設定されているコライダのHeiht、Centerの初期値を収める変数
var anim : Animator;							// キャラにアタッチされるアニメーターへの参照
var currentBaseState : AnimatorStateInfo;			// base layerで使われる、アニメーターの現在の状態の参照
		
// アニメーター各ステートへの参照
var idleState : int = Animator.StringToHash ("Base Layer.Idle");
var locoState : int = Animator.StringToHash ("Base Layer.Locomotion");
var jumpState : int = Animator.StringToHash ("Base Layer.Jump");
var restState : int = Animator.StringToHash ("Base Layer.Rest");

var manager : Manager_script;
var slime : Slime_Movement_script;
var geji : Geji_Movement_script;
var boss : GameObject;

var targetId : int;
var targetName : String;
var target : GameObject;


var activeBattleNum : int;
var yushaATK : int = 1;
var nextAttack : float =0;
var attackInterval : float = 1.0;
var dist : float;
var allTargets : GameObject[];
var targetNum : int =0;

var primaryDirection : int;
var secondaryDirection : int;
var currentDirection : int;
var newDirection : int;

var x : int;
var y : int;
var bossX : float;
var bossY : float;
var distX : float;
var distY : float;

var startPosition : Vector3;
var initialAngle : Vector3;



var yushaStart : boolean;

function Start () {
		yushaStart = false;
		currentDirection = 2;
		newDirection = 2;
		
		// Animatorコンポーネントを取得する
		anim = GetComponent.<Animator> ();
		
		anim.SetBool("Rest",true);
		
		//get manager script component
		manager = GameObject.FindGameObjectWithTag("Manager").GetComponent("Manager_script");
	
		activeBattleNum = 0;
		startPosition = transform.position;
		initialAngle = Vector3(90,270,270);
		
		
}

function FixedUpdate () {
		speed = Mathf.Sqrt(moveSpeedX*moveSpeedX + moveSpeedZ*moveSpeedZ);
		
		if(yushaStart){
			anim.SetFloat ("Speed", speed);							// Animator側で設定している"Speed"パラメタにvを渡す
			anim.speed = animSpeed;								// Animatorのモーション再生速度に animSpeedを設定する

			if(activeBattleNum <= 0){
				activeBattleNum = 0;
				//anim.SetBool("Locomotion",true);
				anim.SetBool("Jump",false);
				Move();
				
			}else if(activeBattleNum > 0){

				anim.SetBool("Jump",true);

				if(nextAttack < Time.time){
					targetNum = 0;
					allTargets = FindObjectsOfType(GameObject);
					for(var targets : GameObject in allTargets){
						dist = (this.transform.position - targets.transform.position).sqrMagnitude;
						if(dist < 3){
							if(targets.gameObject.tag == "Slime"){
								targets.GetComponent(Slime_Movement_script).DamageFromYusha(yushaATK);
								targetNum++;
							}else if(targets.gameObject.tag == "Geji"){
								targets.GetComponent(Geji_Movement_script).DamageFromYusha(yushaATK);
								targetNum++;
							}else if(targets.gameObject.tag == "Boss"){
								targets.GetComponent(Boss_script).DamageFromYusha(yushaATK);
								targetNum++;
							}
						}
					}
					if(targetNum==0){
						activeBattleNum = 0;
					}
					nextAttack = Time.time + attackInterval;
				}
			}
		}else if(!yushaStart){
			rigidbody.velocity = Vector3.zero;
		}
		
}

function Move(){
	transform.Translate(Vector3(0,0,moveSpeedZ*Time.deltaTime));
}

function DirectionPriority(){
	x = Mathf.Round(transform.position.x);
	y = Mathf.Round(transform.position.y);
	boss = GameObject.FindGameObjectWithTag("Boss");
	bossX = boss.transform.position.x;
	bossY = boss.transform.position.y;
	distX = bossX - x;
	distY = bossY - y;
	//Debug.Log("bossX"+bossX);
	//Debug.Log("bossY"+bossY);
	if((distX*distX - distY*distY)>=0){
		if(distX<0 && distY>=0){
				primaryDirection = 3; //right
				secondaryDirection = 1; //up
		}else if(distX>=0 && distY>=0){
				primaryDirection = 4; //left
				secondaryDirection = 1; //up
		}else if(distX<0 && distY<0){
				primaryDirection = 3; //right
				secondaryDirection = 2; //down
		}else if(distX>=0 && distY<0){
				primaryDirection = 4; //left
				secondaryDirection = 2; //down
		}
	}else if((distX*distX - distY*distY)<0){
		if(distX<0 && distY>=0){
				primaryDirection = 1; //up
				secondaryDirection = 3; //right
		}else if(distX>=0 && distY>=0){
				primaryDirection = 1; //up
				secondaryDirection = 4; //left
		}else if(distX<0 && distY<0){
				primaryDirection = 2; //down
				secondaryDirection = 3; //right
		}else if(distX>=0 && distY<0){
				primaryDirection = 2; //down
				secondaryDirection = 4; //left
		}
	}
}

function ChangeDirection(){
	//transform.eulerAngles = Vector3(60,270,270);
		DirectionPriority();
		//Debug.Log("primary"+primaryDirection);
		//Debug.Log("Secondary"+secondaryDirection);
		//Debug.Log("x"+x);
		//Debug.Log("y"+y);
		if(manager.CheckDirection(primaryDirection,x,y)){
			newDirection = primaryDirection;
			//Debug.Log("new"+newDirection);
		}else if(!manager.CheckDirection(primaryDirection,x,y)){
			if(manager.CheckDirection(secondaryDirection,x,y)){
				newDirection = secondaryDirection;
				//Debug.Log("new"+newDirection);
			}else{
				var p = Random.Range(0,100);
				if(p>50){
					if(primaryDirection == 1){
						newDirection = 2;
					}else if(primaryDirection == 2){
						newDirection = 1;
					}else if(primaryDirection == 3){
						newDirection = 4;
					}else if(primaryDirection == 4){
						newDirection = 3;
					}
				}else{
					if(secondaryDirection == 1){
						newDirection = 2;
					}else if(secondaryDirection == 2){
						newDirection = 1;
					}else if(secondaryDirection == 3){
						newDirection = 4;
					}else if(secondaryDirection == 4){
						newDirection = 3;
					}
				}
			}
		}
		if(newDirection == 1){	      //up
			transform.eulerAngles = Vector3(180,0,0)+initialAngle;
		}else if(newDirection == 2){  //down
			transform.eulerAngles = Vector3(0,0,0)+initialAngle;
		}else if(newDirection == 3){  //right
			transform.eulerAngles = Vector3(-90,0,0)+initialAngle;
		}else if(newDirection == 4){  //left
			transform.eulerAngles = Vector3(90,0,0)+initialAngle;
		}
}



function OnCollisionEnter(col : Collision){
	if(col.gameObject.tag == "Tile"
	|| col.gameObject.tag == "Tile1"
	|| col.gameObject.tag == "Tile2"
	|| col.gameObject.tag == "Block"
	){
		ChangeDirection();
	}else if(col.gameObject.tag == "Slime"){
		activeBattleNum++;
		//Debug.Log(activeBattleNum);
		//since we can't use instance id to find object directly,
		//rename gameObject name to instance id
		//also, to use GameObject.Find(), it needs to be String.
		//targetId = col.gameObject.GetInstanceID();
		//col.gameObject.name = col.gameObject.GetInstanceID().ToString();
		//targetName = col.gameObject.name;
		//target = col.gameObject;
		

	}
	else if(col.gameObject.tag == "Geji"){
		activeBattleNum++;
		//Debug.Log(activeBattleNum);
	}else if(col.gameObject.tag == "Egg") {
		
	}else if(col.gameObject.tag == "Boss"){
		activeBattleNum++;
	}
	
}

