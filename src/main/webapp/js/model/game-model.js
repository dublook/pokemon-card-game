(function($){

  GameModel = function() {

    this.fields_ = {};

    this.turn_ = new TurnModel();

    this.escaped_ = {};
  };

  GameModel.prototype.setField = function(key, field) {
    this.fields_[key] = field;
  };

  GameModel.prototype.getField = function(key) {
    return this.fields_[key];
  };

  GameModel.prototype.getTurn = function(key) {
    return this.turn_;
  };

  GameModel.prototype.nextTurn = function() {
    this.turn_ = this.turn_.next();
  };

  GameModel.prototype.escape = function(viewpoint) {
    return this.escaped_[viewpoint] = true;
  };

  GameModel.prototype.wasEscaped = function(viewpoint) {
    return !!this.escaped_[viewpoint];
  };

})(jQuery);