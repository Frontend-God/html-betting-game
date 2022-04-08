function CBonusResultPanel(iPrize, oParentContainer){
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iPrize){
       _oContainer = new createjs.Container();
        _oContainer.alpha = 0;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        oBg.x = CANVAS_WIDTH/2;
        oBg.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(oBg);
        
        
        var szTitle = TEXT_NO_WIN;
        var szScore = " ";
        var iY = CANVAS_HEIGHT/2-16;
        if(iPrize > 0){
            szTitle = TEXT_CONGRATS;
            szScore = TEXT_YOU_WIN+"\n"+formatEntries(iPrize);
            iY = CANVAS_HEIGHT/2-60;
        }
        
        var oCongratsText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-180, iY, 360, 32, 
                    32, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    szTitle,
                    true, true, true,
                    false );

        oCongratsText.setShadow("#000", 1, 1, 1);

        
        var oWonText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-180, CANVAS_HEIGHT/2+4, 360, 70, 
                    35, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    szScore,
                    true, true, true,
                    false );
                    

        oWonText.setShadow("#000", 1, 1, 1);
        
        createjs.Tween.get(_oContainer).to({alpha:1 }, 1000,createjs.Ease.cubicOut).call(function(){
                                                                        setTimeout(function(){s_oBonusPanel.hide();},3000);
                                                                            });                                                                                                                                      
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    _oParentContainer = oParentContainer;
    this._init(iPrize);
}