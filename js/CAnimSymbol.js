function CAnimSymbol(iX,iY,oParentContainer){
    var _bUpdate;
    var _bLast;
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
    var _aSpritesLeft;
    var _aSpritesRight;
    var _aSplashEffect;
    
    var _oSlice1 = null;
    var _oSlice2 = null;
    var _oAmountText;
    var _oAmountTextBack;
    var _oContainerSliceLeft;
    var _oContainerSliceRight;
    var _oContainerSplash;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        _oAmountTextBack = new createjs.Text("","28px "+FONT_GAME_2, "#000");
        _oAmountTextBack.x = SYMBOL_WIDTH/2;
        _oAmountTextBack.y = SYMBOL_HEIGHT/2;
        _oAmountTextBack.textAlign = "center";
        _oAmountTextBack.textBaseline = "middle";
        _oAmountTextBack.outline = 3;
        _oContainer.addChild(_oAmountTextBack);
        
        _oAmountText = new createjs.Text("X0","28px "+FONT_GAME_2, "#fce0ab");
        _oAmountText.x = SYMBOL_WIDTH/2;
        _oAmountText.y = SYMBOL_HEIGHT/2;
        _oAmountText.textAlign = "center";
        _oAmountText.textBaseline = "middle";
        _oContainer.addChild(_oAmountText);

        _oContainerSliceLeft = new createjs.Container();
        _oContainer.addChild(_oContainerSliceLeft);
        
        _oContainerSplash = new createjs.Container();
        _oContainer.addChild(_oContainerSplash);
        
        _oContainerSliceRight = new createjs.Container();
        _oContainer.addChild(_oContainerSliceRight);
        
        _aSpritesLeft = new Array();
        _aSpritesRight = new Array();
        for(var i=0;i<NUM_SYMBOLS;i++){
                var oSprite = createSprite(s_aSymbolData[i], "slice_left",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
                oSprite.x = SYMBOL_WIDTH/2;
                oSprite.y = SYMBOL_HEIGHT/2;
                _oContainerSliceLeft.addChild(oSprite);

                _aSpritesLeft[i] = oSprite;
                _aSpritesLeft[i].visible = false;
                
               
                
                var oSprite = createSprite(s_aSymbolData[i], "slice_right",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
                oSprite.x = SYMBOL_WIDTH/2;
                oSprite.y = SYMBOL_HEIGHT/2;
                _oContainerSliceRight.addChild(oSprite);

                _aSpritesRight[i] = oSprite;
                _aSpritesRight[i].visible = false;
        }
        
        
        _aSplashEffect = new Array();
        for(var k=0;k<3;k++){
            var oData = {   // image to use
                        images: [s_oSpriteLibrary.getSprite("particle_effect_"+k)], 
                        // width, height & registration point of each sprite
                        frames: {width: 249, height: 204,regX:124,regY:102}, 
                        animations: {  static: 0,anim:[0,20,"hide"],hide:21 }
            };

             var oSpriteSheet = new createjs.SpriteSheet(oData);
             var oSplash = createSprite(oSpriteSheet, "static",124,102,249,204);
             oSplash.x = SYMBOL_WIDTH/2;
             oSplash.y = SYMBOL_HEIGHT/2;
             oSplash.visible = false;
             _oContainerSplash.addChild(oSplash);
             
             _aSplashEffect.push(oSplash);
        }
        
        //PARTICLE FOR TEXT SYMBOLS
        var oData = {   // image to use
                        images: [s_oSpriteLibrary.getSprite("particle_effect_3")], 
                        // width, height & registration point of each sprite
                        frames: {width: 139, height: 143,regX:69,regY:71}, 
                        animations: {  static: 0,anim:[0,14,"hide"],hide:15 }
            };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            var oSplash = createSprite(oSpriteSheet, "static",139,71,69,143);
            oSplash.x = SYMBOL_WIDTH/2;
            oSplash.y = SYMBOL_HEIGHT/2;
            oSplash.visible = false;
            _oContainerSplash.addChild(oSplash);
             
            _aSplashEffect.push(oSplash);
        
        this.reset();
    };
    
    this.reset = function(){
        _bUpdate = false;
        _bLast = false;
        _iRunTimeSlice1 = 0;
        _iRunTimeSlice2 = 0;
        _iRunTime = 0;
        _iRotFactor = randomFloatBetween(-2,2,2);
        _iShiftX = randomFloatBetween(0,0.5,2);
        
        _iSpeed = SYMBOL_FALL_SPEED;
        _iRunFactor = _iSpeed/2;
        
        
    };
    
    this.hide = function(){
        _oAmountText.text = "";
        _oAmountTextBack.text = "";
        if(_oSlice1 !== null){
            _oSlice1.x = SYMBOL_WIDTH/2;
            _oSlice1.y = SYMBOL_HEIGHT/2;
            _oSlice1.rotation = 0;
            _oSlice1.visible = false;
        }
        
        if(_oSlice2 !== null){
            _oSlice2.x = SYMBOL_WIDTH/2
            _oSlice2.y = SYMBOL_HEIGHT/2;
            _oSlice2.rotation = 0;
            _oSlice2.visible = false;
        }
        
        _oSlice1 =_oSlice2 = null;
        
        _oContainer.visible = false;
    };
    
    this.playAnim = function(iSymbolIndex,iAmountWin,bLast){
        if(bLast && iAmountWin>0){
            _oAmountTextBack.scaleX = _oAmountTextBack.scaleY = 0.1;
            _oAmountText.scaleX = _oAmountText.scaleY = 0.1;
            _oAmountText.text = formatEntries(iAmountWin);
            _oAmountTextBack.text = _oAmountText.text;
            createjs.Tween.get(_oAmountText).to({scaleX:1,scaleY:1}, 500,createjs.Ease.bounceOut);
            createjs.Tween.get(_oAmountTextBack).to({scaleX:1,scaleY:1}, 500,createjs.Ease.bounceOut);
        }
            
        _aSpritesLeft[iSymbolIndex].visible = true;
        _aSpritesRight[iSymbolIndex].visible = true;
        _oContainer.visible = true;
        
        _oSlice1 = _aSpritesLeft[iSymbolIndex];
        _oSlice2 = _aSpritesRight[iSymbolIndex];
        
        _iRunTimeSlice1 = _iRunTime - (_iRunFactor*2);
        _iRunTimeSlice2 = _iRunTime + (_iRunFactor*2);
        _iShiftLeftX = _iShiftX - 0.2;
        _iShiftRightX = _iShiftX + 0.2;
        _iRotFactorSlice1 = -_iRotFactor * 1.2;
        _iRotFactorSlice2 = _iRotFactor * 1.2;
        
        _bLast = bLast;
        
        _aSplashEffect[s_aSymbolSplashId[iSymbolIndex]].visible = true;
        _aSplashEffect[s_aSymbolSplashId[iSymbolIndex]].gotoAndPlay("anim");
        
        var szSound;
        if(iSymbolIndex <3){
            szSound = "symbol_0_1_2";
        }else if(iSymbolIndex <6){
            szSound = "symbol_3_4_5";
        }else{
            szSound = "symbol_6";
        }
        playSound(szSound,1,false);
        
        _bUpdate = true;
    };

    this.update = function(){
        if(!_bUpdate || _oSlice1 === null || _oSlice2 === null){
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
            if(_bLast){
                s_oGame.fadeInSymbolInWin();
            }
            
            this.reset(); 
        }
    };
    
    this._init(iX,iY);
}