function CAreYouSurePanel() {
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerBlock;
    
    var _oBg;
    var _oMsg;
    var _oButYes;
    var _oButNo;
    var _oContainer;
    var _oFade;
    
    var _oThis = this;

    this._init = function () {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oListenerBlock = _oFade.on("click",function(){});
        _oFade.alpha = 0.5;
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oContainer.addChild(_oFade);
   

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oContainer.addChild(_oBg);

        _oMsg = new CTLText(_oContainer, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2+40, CANVAS_HEIGHT/2-oSpriteBg.height/2+30, oSpriteBg.width-80, 90, 
                    70, "center", "#ffffff", FONT_GAME_1, 1,
                    40, 10,
                    TEXT_ARE_SURE,
                    true, true, true,
                    false );
        
        

        _oButYes = new CGfxButton(CANVAS_WIDTH / 2 + 105, CANVAS_HEIGHT * 0.5 + 49, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH / 2 - 105, CANVAS_HEIGHT * 0.5 + 49, s_oSpriteLibrary.getSprite('but_no'), _oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };
    
    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    
    this.show = function (szMsg) {
        _oMsg.refreshText( szMsg);
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 300, createjs.Ease.quartOut).call(function(){s_oMain.stopUpdateNoBlock();});
    };
    
    this.hide = function(){
        s_oMain.startUpdateNoBlock();
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){_oContainer.visible = false;});
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        _oFade.off("click",_oListenerBlock);
    };

    this._onButYes = function () {
        _oThis.hide();
        
        if (_aCbCompleted[ON_BUT_YES_DOWN]) {
            _aCbCompleted[ON_BUT_YES_DOWN].call(_aCbOwner[ON_BUT_YES_DOWN]);
        }
    };

    this._onButNo = function () {
        
        _oThis.hide();
    };

    this._init();
}