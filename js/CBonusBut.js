function CBonusBut(iIndex,iXPos,iYPos,iSymbol,oParentContainer){
    var _bDisabled;
    var _bUpdate;
    var _iIndex = iIndex;
    
    var _iRunTimeSlice1;
    var _iRunTimeSlice2;
    var _iSpeed;
    var _iRunFactor;
    var _iShiftX;
    var _iShiftLeftX;
    var _iShiftRightX;
    var _iRotFactor;
    var _iRunTime;
    var _iRotFactorSlice1;
    var _iRotFactorSlice2;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerOver;
    
    var _oContainer;
    var _oSplash;
    var _oSlice1;
    var _oSlice2;
    var _oButton;
    var _oTween;
    var _oParentContainer = oParentContainer;
    
    var _oParent;
    
    this._init =function(iXPos,iYPos,iSymbol){
        _bDisabled = false;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oContainer.cursor = "pointer";
        _oParentContainer.addChild(_oContainer);
        
        
        var oSpriteSymbol = s_oSpriteLibrary.getSprite('symbol_'+iSymbol);
        var oData = {   // image to use
                        images: [oSpriteSymbol], 
                        // width, height & registration point of each sprite
                        frames: {width: SYMBOL_WIDTH, height: SYMBOL_HEIGHT, regX: SYMBOL_WIDTH/2, regY: SYMBOL_HEIGHT/2}, 
                        animations: {  static: 0,slice_left:1,slice_right:2,moving:3 }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
            
        _oButton = createSprite(oSpriteSheet, "static",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
        _oContainer.addChild(_oButton);        
        
        
        
        _oSlice1 = createSprite(oSpriteSheet, "slice_left",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
        _oSlice1.visible = false;
        _oContainer.addChild(_oSlice1);
        
        var oData = {   // image to use
                        images: [s_oSpriteLibrary.getSprite("particle_effect_"+s_aSymbolSplashId[iSymbol])], 
                        // width, height & registration point of each sprite
                        frames: {width: 249, height: 204,regX:124,regY:102}, 
                        animations: {  static: 0,anim:[0,20,"hide"],hide:21 
                    }
        };

         var oSpriteSheetSplash = new createjs.SpriteSheet(oData);
         _oSplash = createSprite(oSpriteSheetSplash, "static",124,102,249,204);
         _oSplash.visible = false;
         _oContainer.addChild(_oSplash);
         
             
        _oSlice2 = createSprite(oSpriteSheet, "slice_right",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
        _oSlice2.visible = false;
        _oContainer.addChild(_oSlice2);


        _bUpdate = false;
        _iRunTimeSlice1 = 0;
        _iRunTimeSlice2 = 0;
        _iRunTime = 0;
        _iRotFactor = randomFloatBetween(-2,2,2);
        _iShiftX = randomFloatBetween(0,0.5,2);
        
        _iSpeed = SYMBOL_FALL_SPEED;
        _iRunFactor = _iSpeed/2;    
        
        
        this._initListener();
    };
    
    this.unload = function(){
        _oContainer.off("mousedown", _oListenerDown);
        _oContainer.off("pressup" , _oListenerUp);
        
       _oParentContainer.removeChild(_oContainer);
    };
    
    this.setVisible = function(bVisible){
        _oContainer.visible = bVisible;
    };
    
    this.setClickable = function(bVal){
        _bDisabled = !bVal;
    };
    
    this._initListener = function(){
        _oListenerDown = _oContainer.on("mousedown", this.buttonDown);
        _oListenerUp = _oContainer.on("pressup" , this.buttonRelease);   
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(_bDisabled){
            return;
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_iIndex);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisabled){
            return;
        }

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };

    
    this.playCutAnim = function(){   
        _oButton.visible = false;
        _oSlice1.visible = true;
        _oSlice2.visible = true;
        
        _iRunTimeSlice1 = _iRunTime - (_iRunFactor*2);
        _iRunTimeSlice2 = _iRunTime + (_iRunFactor*2);
        _iShiftLeftX = _iShiftX - 0.2;
        _iShiftRightX = _iShiftX + 0.2;
        _iRotFactorSlice1 = -_iRotFactor * 1.2;
        _iRotFactorSlice2 = _iRotFactor * 1.2;

        
        _oSplash.visible = true;
        _oSplash.gotoAndPlay("anim");
        
        var szSound;
        if(_iIndex <3){
            szSound = "symbol_0_1_2";
        }else if(_iIndex <6){
            szSound = "symbol_3_4_5";
        }else{
            szSound = "symbol_6";
        }
        playSound(szSound,1,false);
        
        _bUpdate = true;
    };
    
    this.stopPulse = function(){
        createjs.Tween.removeTweens(_oContainer);
    };
    
    this.tweenDown = function(iNewY,iTime){
        _oTween = createjs.Tween.get(_oContainer).to({y:iNewY}, iTime, createjs.Ease.backOut);
    };
    
    this.tweenUp = function(iNewY,iTime){
        _oTween = createjs.Tween.get(_oContainer).to({y:iNewY}, iTime, createjs.Ease.backIn).call(function(){_oParent.unload();});
    };
    
    this.pulseAnimation = function () {
        _oTween = createjs.Tween.get(_oContainer,{loop:true}).to({scaleX: 1.1, scaleY: 1.1}, 850, createjs.Ease.quadOut).to({scaleX: 1, scaleY: 1}, 650, createjs.Ease.quadIn);
    };

    this.trembleAnimation = function () {
        _oTween = createjs.Tween.get(_oContainer).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn).wait(750).call(function () {
            _oParent.trebleAnimation();
        });
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getY = function(){
        return _oContainer.y;
    };
    
    this.update = function(){
        if(!_bUpdate){
            return;
        }
        
        _iRunTime += _iRunFactor;
        
        _iRunTimeSlice1 += _iRunFactor;
        _oSlice1.y = _oSlice1.y - _iSpeed + _iRunTimeSlice1 * _iRunTimeSlice1/1000;
        _oSlice1.x = _oSlice1.x + _iRunTime*0.1*_iShiftLeftX;
        _oSlice1.rotation += _iRotFactorSlice1;
        
        _iRunTimeSlice2 += _iRunFactor;
        _oSlice2.y = _oSlice2.y - _iSpeed + _iRunTimeSlice2 * _iRunTimeSlice2/1000;
        _oSlice2.x = _oSlice2.x + _iRunTime*0.1*_iShiftRightX;
        _oSlice2.rotation += _iRotFactorSlice2;
       
        var iRemove = 0;
        if(_oSlice1.y > CANVAS_HEIGHT){
            iRemove++;
        }

        if(_oSlice2.y > CANVAS_HEIGHT){
            iRemove++;
        }

        if(iRemove === 2){
            this.unload();
            s_oBonusPanel.checkNextTurn();
        }
    };
    
    _oParent = this;
    this._init(iXPos,iYPos,iSymbol);
}