function CCreditsPanel(){
    var _oListenerLogo;
    var _oListenerBlock;
    var _oFade;
    var _oContainerPanel;
    var _oButExit;
    var _oLogo;
    var _oPanel;
    var _oContainer;
    var _pStartPanelPos;
    
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
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSprite);        
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oContainerPanel.addChild(_oPanel);
        _oListenerLogo = _oPanel.on("click",this._onLogoButRelease);
        
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;  
        _pStartPanelPos = {x: _oContainerPanel.x, y: _oContainerPanel.y};

        var oTitle = new createjs.Text(TEXT_DEVELOPED,"30px "+FONT_GAME_1, "#fff");
        oTitle.y = -40;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "alphabetic";
        _oContainerPanel.addChild(oTitle);

        var oLink = new createjs.Text("www.codethislab.com","26px "+FONT_GAME_1, "#fff");
        oLink.y = 60;
        oLink.textAlign = "center";
        oLink.textBaseline = "alphabetic";
        oLink.lineWidth = 300;
        _oContainerPanel.addChild(oLink);
        
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oContainerPanel.addChild(_oLogo);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit_info');
        _oButExit = new CGfxButton(170, -70, oSprite, _oContainerPanel);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
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

            _oButExit.unload();
        }); 
        
        _oFade.off("click",_oListenerBlock);
        _oPanel.off("click",_oListenerLogo);  
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


