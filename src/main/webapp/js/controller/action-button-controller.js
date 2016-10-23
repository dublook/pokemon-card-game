(function($){

  ActionButtonController = function() {
  };

  ActionButtonController.prototype.control = function(card, game, area) {
    var turn = game.getTurn();
    var viewpoint = turn.isSetupTurn() ?  UtilFunc.getViewpoint(card.trnId) : turn.whoseTurn();
    if (viewpoint !== UtilFunc.getViewpoint(card.trnId)) {
      return {};
    }
    var field = game.getField(viewpoint);
    switch(card.kind) {
    case '1':
      return this.forBaseMonster_(card, field, area, turn, game);
    case '2':
    case '3':
      return this.forEvolutionMonster_(card, field, area, turn, game);
    case 'goods':
    case 'supporter':
      return this.forTrainer_(card, field, area, turn);
    case 'energy':
    case 'energy-sp':
      return this.forEnergy_(field, area, turn);
    }
  };

  ActionButtonController.prototype.forBaseMonster_ = function(card, field, area, turn, game) {
    var result = {};
    result.kind = 'base-monster';
    switch(area) {
    case Const.Area.HAND:
      result.toBattle = !this.existsBattleMonster_(field);
      result.toBench = this.canAttendBench_(field);
      break;
    case Const.Area.BATTLE_MONSTER:
      result.attack = turn.allowAttack() && card.canAttack();
      result.special;
      result.escape = !game.wasEscaped(turn.whoseTurn());
      break;
    case Const.Area.BENCH:
      result.special;
      result.toBattle = !this.existsBattleMonster_(field);
      break;
    }
    return result;
  };

  ActionButtonController.prototype.forEvolutionMonster_ = function(card, field, area, turn, game) {
    var result = {};
    result.kind = 'evolution-monster';
    switch(area) {
    case Const.Area.HAND:
      result.evolution = this.canEvolute_(card, field, turn);
      break;
    case Const.Area.BATTLE_MONSTER:
      result.attack = turn.allowAttack() && card.canAttack();
      result.special;
      result.escape = !game.wasEscaped(turn.whoseTurn());
      break;
    case Const.Area.BENCH:
      result.special;
      result.toBattle = !this.existsBattleMonster_(field);
      break;
    }
    return result;
  };

  ActionButtonController.prototype.forTrainer_ = function(card, field, area, turn) {
    var result = {};
    result.kind = 'trainer';
    switch(area) {
    case Const.Area.HAND:
      if (turn.isSetupTurn()) {
        result.use = false;
      } else{
        result.use = card.kind === 'goods' ? true : !turn.isUsedSupporter();
      }
      break;
    }
    return result;
  };

  ActionButtonController.prototype.forEnergy_ = function(field, area, turn) {
    var result = {};
    result.kind = 'energy';
    switch(area) {
    case Const.Area.HAND:
      if (turn.isSetupTurn()) {
        result.attach = false;
      } else{
        result.attach = !turn.isAttachedEnergy();
      }
      break;
    }
    return result;
  };

  ActionButtonController.prototype.existsBattleMonster_ = function(field) {
    return field.getBattleMonster() !== null;
  };

  ActionButtonController.prototype.canAttendBench_ = function(field) {
    return field.getBench().length < 5;
  };

  ActionButtonController.prototype.canEvolute_ = function(card, field, turn) {
    if (turn.isFirstTurn()) {
      return false;
    }
    var result = field.getBench().some(function(c){
      return c.code === card.baseCardCode && !turn.isNewAssignedMonster(c.trnId);
    });
    if (result) return true;
    var battleMonster = field.getBattleMonster();
    if (battleMonster == null) {
      return false;
    }
    return battleMonster.code === card.baseCardCode && !turn.isNewAssignedMonster(battleMonster.trnId);
  };


})(jQuery);
