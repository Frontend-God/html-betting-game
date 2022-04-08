function CRechargePanel(){
    var _oListenerBlock;
    var _oFade;
    var _oContainerPanel;
    var _oButYes;
    var _oButNo;
    var _oPanel;
    var _oContainer;
    var _pStartPanelPos;
    
    var _oThis = this;
    
    this._init = function(){
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oListenerBlock = _oFade.on("click",function(){});
        _oFade.alpha = 0;
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.visible = false;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSpriteBg);        
        _oPanel.regX = oSpriteBg.width/2;
        _oPanel.regY = oSpriteBg.height/2;
        _oContainerPanel.addChild(_oPanel);
       
        
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;  
        _pStartPanelPos = {x: _oContainerPanel.x, y: _oContainerPanel.y};

        var oTitle = new CTLText(_oContainerPanel, 
                     -oSpriteBg.width/2+30, -80, oSpriteBg.width-60, 90, 
                    30, "center", "#ffffff", FONT_GAME_1, 1,
                    40, 10,
                    TEXT_RECHARGE,
                    true, true, true,
                    false );


        var oSprite = s_oSpriteLibrary.getSprite('but_no');
        _oButNo = new CGfxButton(-130, 50, oSprite, _oContainerPanel);
        _oButNo.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        _oButYes = new CGfxButton(130, 50, s_oSpriteLibrary.getSprite('but_yes'), _oContainerPanel);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onRecharge, this);
        
        _oFade.alpha = 0;
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500).call(function(){
                                                    _oContainerPanel.alpha = 0;
                                                    _oContainerPanel.visible = true;
                                                    createjs.Tween.get(_oContainerPanel).to({alpha:1}, 300);
                                            }); 
    };
    
    this.unload = function(){
        createjs.Tween.get(_oContainer).to({alpha:0},500).call(function(){
            s_oStage.removeChild(_oContainer);

            _oButNo.unload();
            _oButYes.unload();
        }); 
        
        _oFade.off("click",_oListenerBlock);
    };
    
    this._onRecharge = function(){
        _oThis.unload();
        $(s_oMain).trigger("recharge");
    };
    
    this._init();
    
    
};


