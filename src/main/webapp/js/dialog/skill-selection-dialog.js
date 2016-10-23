(function($){

  SkillSelectionDialog = function() {
    this.$defer_ = null;
    this.result_ = [];
  };


  SkillSelectionDialog.prototype.show = function(card) {
    $('.dialog-backdrop').addClass('open');
    $('.dialog-window').addClass('open').height(360).width(480);
    $('.dialog-header').text('わざの選択');
    var $content = $('.dialog-content').html(this.createContentDom_(card));
    var $buttons = $('.dialog-buttons').html(this.createButtonsDom_());

    this.controlEnabled_($content, card);

    this.bindEvents_($content, $buttons);

    this.$defer_ = $.Deferred();
    return this.$defer_.promise();
  };

  SkillSelectionDialog.prototype.close = function() {
    this.unbindEvents_($('.dialog-content'), $('.dialog-buttons'));
    $('.dialog-backdrop').removeClass('open');
    $('.dialog-window').removeClass('open');
    this.$defer_.resolve(this.result_);
  };

  SkillSelectionDialog.prototype.createContentDom_ = function(card) {

    var energyHtml = '';
    $.each(UtilFunc.mapEnergyToArray(card.getEnergy()), function(idx, t){
      energyHtml += '<div class="cost ' + t + '"></div>';
    });
    var costHtml1 = '';
    if (!!card.skill1) {
      $.each(card.skill1.cost, function(idx, t){
        costHtml1 += '<div class="cost ' + t + '"></div>';
      });
    }
    var costHtml2 = '';
    if (!!card.skill2) {
      $.each(card.skill2.cost, function(idx, t){
        costHtml2 += '<div class="cost ' + t + '"></div>';
      });
    }
    var html = '<div class="skill-selection-container">' +
        '<div class="holding-energy"><span class="label">エネルギー</span><div>' + energyHtml + '</div></div>' +
        '<div class="skill-panel skill1"><div class="cost-area">' + costHtml1 + '</div>' +
        '<div class="skill-caption">{{skill1.name}}</div>' +
        '<div class="damage-caption">{{skill1.damageCaption}}</div>' +
        '<div class="effect-description">{{skill1.description}}</div></div>' +
        '<div class="skill-panel skill2"><div class="cost-area">' + costHtml2 + '</div>' +
        '<div class="skill-caption">{{skill2.name}}</div>' +
        '<div class="damage-caption">{{skill2.damageCaption}}</div>' +
        '<div class="effect-description">{{skill2.description}}</div></div>' +
        '<input class="trnId" type="hidden"></input>' +
        '</div>';
    return Hogan.compile(html).render(card);
  };

  SkillSelectionDialog.prototype.createButtonsDom_ = function() {
    return '<div class="skill-selection-buttons"><button class="btn close-btn">キャンセル</button></div>';
  };

  SkillSelectionDialog.prototype.controlEnabled_ = function($content, card) {
    var energyArr = UtilFunc.mapEnergyToArray(card.getEnergy());
    if (!!card.skill1) {
      var $skillPanel1 = $content.find('.skill1');
      if (card.skill1.satisfy(energyArr)) {
        $skillPanel1.removeClass('disabled');
      } else {
        $skillPanel1.addClass('disabled');
      }
    }
    if (!!card.skill2) {
      var $skillPanel2 = $content.find('.skill2');
      if (card.skill2.satisfy(energyArr)) {
        $skillPanel2.removeClass('disabled');
      } else {
        $skillPanel2.addClass('disabled');
      }
    }
  };

  SkillSelectionDialog.prototype.bindEvents_ = function($content, $buttons) {
    $content.on('click', '.skill-panel', this.onClickSkill_.bind(this));
    $buttons.on('click', '.close-btn', this.onClickClose_.bind(this));
  };

  SkillSelectionDialog.prototype.unbindEvents_ = function($buttons) {
    $buttons.off();
  };

  SkillSelectionDialog.prototype.onClickSkill_ = function(e) {
    var $target = $(e.currentTarget);
    if ($target.hasClass('disabled')) {
      return;
    }
    if ($target.hasClass('skill1')) {
      this.$defer_.resolve('skill1');
    } else if ($target.hasClass('skill2')) {
      this.$defer_.resolve('skill2');
    }
    this.close();
  };

  SkillSelectionDialog.prototype.onClickClose_ = function(e) {
    this.close();
  };

})(jQuery);
