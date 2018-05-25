class Player {
	
	static fullHealth(){
		return 20;
	}
	
	constructor(){
    	this.health = Player.fullHealth();
		this.retreatPoint = Player.fullHealth() / 2;
		this.recoveryPoint = Player.fullHealth() * 3 / 4;
  	}

	playTurn(warrior) {
		var space = warrior.feel();
		if (this.isUnderAttack(warrior)){
			(this.isTooInjured(warrior))?warrior.walk('backward'):this.faceEnemies(warrior);
		}
		else if (this.needRest(warrior)){
			warrior.rest();
		}
		else{
			if (this.anyEnemies(warrior)){
				this.faceEnemies(warrior);
			}
			else if (this.anyCaptives(warrior)){
				this.rescueCaptives(warrior);
			}
			else if (space.isWall()){
				warrior.pivot();
			}
			else{
				warrior.walk();
			}
		}
		this.health = warrior.health();
	}
		
	isInjured(warrior){
		return warrior.health() < Player.fullHealth(); 
	}
	
	isTooInjured(warrior){
		return warrior.health() <= this.retreatPoint 
	}
	
	needRest(warrior){
		return warrior.health() <= this.recoveryPoint;
	}
	
	isUnderAttack(warrior){
		return (warrior.health() < this.health);
	}
	
	lookForEnemies(warrior, dir){
		var spaceWithUnit = warrior.look(dir).find(space => space.isUnit());
		return spaceWithUnit && spaceWithUnit.getUnit().isEnemy();
	}
	
	// -- enmemies manager
	anyEnemies(warrior){
		return (this.lookForEnemies(warrior, 'backward') || this.lookForEnemies(warrior, 'forward'));
	}
	
	isEnemyCloseToMe(warrior, direction){
		var isUnit = warrior.feel(direction).isUnit();
		return (isUnit)?warrior.feel(this.direction).getUnit(this.direction).isEnemy():false;
	}
	
	faceEnemies(warrior){
		if (this.isEnemyCloseToMe(warrior, 'backward')){
			warrior.pivot();
		}
		else if (this.isEnemyCloseToMe(warrior, 'forward')){
			warrior.attack();
		}
		else if (this.lookForEnemies(warrior, 'backward')){
			warrior.shoot('backward');
		}
		else if (this.lookForEnemies(warrior, 'forward')){
			warrior.shoot('forward');
		}
	}
	
	// -- CAPTIVEs MANAGER
	anyCaptives(warrior){
		return (this.lookForCaptives(warrior, 'backward') || this.lookForCaptives(warrior, 'forward'));
	}
	
	lookForCaptives(warrior, dir){
		var spaceWithUnit = warrior.look(dir).find(space => space.isUnit());
		return spaceWithUnit && spaceWithUnit.getUnit().isBound();
	}
	
	isCaptiveCloseToMe(warrior, direction){
		var isUnit = warrior.feel(direction).isUnit();
		return (isUnit)?warrior.feel(direction).getUnit(direction).isBound():false;
	}
	
	rescueCaptives(warrior){
		if (this.isCaptiveCloseToMe(warrior, 'backward')){
			warrior.pivot();
		}
		else if (this.isCaptiveCloseToMe(warrior, 'forward')){
			warrior.rescue();
		}
		else if (this.lookForCaptives(warrior, 'backward')){
			warrior.walk('backward');
		}
		else if (this.lookForCaptives(warrior, 'forward')){
			warrior.walk('forward');
		}
	}
}