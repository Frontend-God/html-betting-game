function CSpriteSheetTextButton(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oContainer){
    var _bDisable;
    var _iWidth;
    var _iHeight;
    var _szColor;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerPress;
    var _oListenerUp;
    
    var _oButton;
    var _oButtonBg;
    var _oText;
    var _oContainer;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oContainer){
        _bDisable = false;
        _szColor = szColor;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        _oContainer = oContainer;

        _iWidth = oSprite.width/2;
        _iHeight = oSprite.height;
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = _iWidth/2;
        _oButton.regY = _iHeight/2;
        _oButton.cursor = "pointer";
        _oContainer.addChild(_oButton);
        
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: _iWidth, height: _iHeight},
            animations: {state_enable: 0, state_disable: 1}
        };


        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oButtonBg = createSprite( oSpriteSheet,"state_enable",0,0,_iWidth,_iHeight);
        _oButton.addChild(_oButtonBg);
        
        _oText = new CTLText(_oButton, 
                    _iWidth/2-_iWidth/2, 2, _iWidth, _iHeight-2, 
                    iFontSize, "center", szColor, szFont, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );

        _oText.setShadow("#000",1,1,2);
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown",_oListenerPress);
       _oButton.off("pressup",_oListenerUp);
       
       _oContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.enable = function(){
        _bDisable = false;
        
        _oButtonBg.gotoAndStop("state_enable");
	_oText.setColor(_szColor);
    };
    
    this.disable = function(){
        _bDisable = true;
        
        _oButtonBg.gotoAndStop("state_disable");
	_oText.setColor("#c5c5c5");
    };
    
    this.setText = function(szText){
        _oText.refreshText(szText);
    };
    
    this._initListener = function(){
       _oListenerPress = _oButton.on("mousedown", this.buttonDown);
       _oListenerUp = _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }

        playSound("press_but", 1, false);

        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.changeText = function(szText){
        _oText.refreshText(szText);
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    this.getText = function(){
        return _oText.getString();
    };

    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oContainer);
    
    return this;
    
}