function CResultFreespin(oParentContainer){
    var _oFade;
    var _oTextCongrats;
    var _oTextWin;
    var _oContainerBox;
    var _oListener;
    var _oButExit;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListener = _oFade.on("click",function(){});
        _oContainer.addChild(_oFade);
        
        _oContainerBox = new createjs.Container();
        _oContainer.addChild(_oContainerBox);
        
        var oSprite = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        oBg.x = CANVAS_WIDTH/2;
        _oContainerBox.addChild(oBg);
        
        _oTextCongrats =  new CTLText(_oContainerBox, 
                    CANVAS_WIDTH/2-140, -52, 280, 34, 
                    34, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    TEXT_CONGRATS,
                    true, true, false,
                    false );
                    

        
        _oTextWin = new CTLText(_oContainerBox, 
                    CANVAS_WIDTH/2-140, 18, 280, 38, 
                    38, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    TEXT_CONGRATS,
                    true, true, false,
                    false );

        
        _oButExit = new CGfxButton((CANVAS_WIDTH/2) + 196,CANVAS_HEIGHT/2 - 364,s_oSpriteLibrary.getSprite('but_exit_info'),_oContainerBox);
        _oButExit.addEventListener(ON_MOUSE_UP, this.hide, this); 
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oFade.off("click",_oListener);
    };
    
    this.show = function(iAmount){
        if(iAmount === 0){
            _oTextCongrats.refreshText(" ");
            _oTextWin.setY(-16);
            _oTextWin.refreshText(TEXT_NO_WIN);
        }else{
            _oTextCongrats.refreshText(TEXT_CONGRATS);
            _oTextWin.setY(18);
            _oTextWin.refreshText(TEXT_YOU_WON + " " + formatEntries( iAmount));
        }
        
        _oContainer.alpha = 1;
        _oContainer.visible = true;
        
        
        var oParent = this;
        _oContainerBox.y = -CANVAS_HEIGHT/2;
        _oFade.alpha = 0;
        createjs.Tween.get(_oContainerBox).to({y:CANVAS_HEIGHT/2}, 800,createjs.Ease.cubicOut);
        createjs.Tween.get(_oFade).to({alpha:0.7}, 800,createjs.Ease.cubicOut).call(function(){
                                                                                                setTimeout(function(){oParent.hide();},3000);
                                                                                    });
                                                                                    
        playSound("bonus_end",1,false);                                                                             
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 800,createjs.Ease.cubicOut).call(function(){_oContainer.visible = false;});
    };
    
    _oParentContainer = oParentContainer;
    this._init();
}