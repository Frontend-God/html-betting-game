function CReelColumn(iIndex,iXPos,iYPos,iDelay,aSymbols,oParentContainer){
    var _bUpdate;
    var _bReadyToStop;
    var _bContainsFinalSymbols;
    var _bPlayingReelStopAudio;
    var _iIndex;
    var _iCol;
    var _iDelay;
    var _iContDelay;
    var _iCurState;
    var _iCntFrames;
    var _iMaxFrames;
    var _iStartY;
    var _iCurStartY;
    var _iFinalY;
    var _aSymbols;
    var _aSymbolValues;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iIndex,iXPos,iYPos,iDelay,aSymbols){
        _bUpdate = false;
        _bReadyToStop = false;
        _bContainsFinalSymbols = false;
        _bPlayingReelStopAudio = false;
        _iContDelay = 0;
        _iIndex = iIndex;
        _iDelay = iDelay;
        
        if(_iIndex < NUM_REELS){
            _iCol = _iIndex;
        }else{
            _iCol = _iIndex - NUM_REELS;
        }
        
        _iCntFrames = 0;
        _iMaxFrames = MAX_FRAMES_REEL_EASE;
        _iCurState = REEL_STATE_START;
        _iCurStartY = _iStartY = iYPos;
        _iFinalY = _iCurStartY + ( (SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS) * NUM_ROWS);
        
        this.initContainer(iXPos,iYPos,aSymbols);
    };
    
    this.initContainer = function(iXPos,iYPos){
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        
        var iX = SYMBOL_WIDTH/2;
        var iY = SYMBOL_HEIGHT/2;
        _aSymbols = new Array();
        _aSymbolValues = new Array();
        for(var i=0;i<NUM_ROWS;i++){
             
             var oSprite = createSprite(s_aSymbolData[aSymbols[i]], "static",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
             oSprite.stop();
             oSprite.x = iX;
             oSprite.y = iY;
             _oContainer.addChild(oSprite);
             
             _aSymbols[i] = oSprite;
             _aSymbolValues[i] = aSymbols[i];
             
             iY += SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS;
        }
       
        _oParentContainer.addChild(_oContainer);
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.activate = function(){
        _iCurStartY = _oContainer.y;
        _iFinalY = _iCurStartY + ((SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS) * NUM_ROWS);
        _bUpdate = true;
    };
    
    this._setSymbol = function(aSymbols){
        _oContainer.removeAllChildren();
        
        var iX = SYMBOL_WIDTH/2;
        var iY = SYMBOL_HEIGHT/2;
        for(var i=0;i<aSymbols.length;i++){
            var oSprite = createSprite(s_aSymbolData[aSymbols[i]], "static",SYMBOL_WIDTH/2,SYMBOL_HEIGHT/2,SYMBOL_WIDTH,SYMBOL_HEIGHT);
             oSprite.stop();
             oSprite.x = iX;
             oSprite.y = iY;
             _oContainer.addChild(oSprite);
             _aSymbols[i] = oSprite;
             _aSymbolValues[i] = aSymbols[i];
             
             iY += SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS;
        }
    };
    
    this.forceStop = function(aSymbols,iYPos){
        if(aSymbols !== null){
            this._setSymbol(aSymbols);
        }
        _oContainer.y = iYPos;
        _bUpdate = false;
        _iCntFrames = 0;
        _iMaxFrames = MAX_FRAMES_REEL_EASE;
        _iCurState = REEL_STATE_START;
        _iContDelay = 0;
        _bReadyToStop = false;
        _bContainsFinalSymbols = false;
    };
    
    this.setVisible = function(iRow,bVisible){
        _aSymbols[iRow].visible = bVisible;
    };
    
    this.fadeIn = function(iRow,iTime){
        _aSymbols[iRow].scaleX = _aSymbols[iRow].scaleY = 0.1;
        _aSymbols[iRow].visible = true;
        
        createjs.Tween.get(_aSymbols[iRow]).to({scaleX:1,scaleY:1}, iTime,createjs.Ease.bounceOut);
    };
    
    this.restart = function(aSymbols,bReadyToStop) {
        _oContainer.y = _iCurStartY = REEL_START_Y;
       _iFinalY = _iCurStartY + ((SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS) * NUM_ROWS);
        this._setSymbol(aSymbols);

        _bReadyToStop = bReadyToStop;
        if (_bReadyToStop) {
            _iCntFrames = 0;
            _iMaxFrames = MAX_FRAMES_REEL_EASE;
            _iCurState = REEL_STATE_STOP;
            for (var i = 0; i < NUM_ROWS; i++) {
                _aSymbols[i].gotoAndStop("static");
            }
            _bContainsFinalSymbols = true;
            
        }else{
            for (var i = 0; i < NUM_ROWS; i++) {
                _aSymbols[i].gotoAndStop("moving");
            }
        }
    };
    
    this.setReadyToStop = function() {
        _iCntFrames = 0;
        _iMaxFrames = MAX_FRAMES_REEL_EASE;
        _iCurState = REEL_STATE_STOP;
    };
    
    this.playWinAnim = function(iRow){
        _aSymbols[iRow].scaleX = _aSymbols[iRow].scaleY = 1;
        _aSymbols[iRow].visible = true;
        createjs.Tween.get(_aSymbols[iRow],{loop:true}).to({scaleX:1.2,scaleY:1.2 }, 500,createjs.Ease.quintOut).to({scaleX:1,scaleY:1 }, 500,createjs.Ease.cubicOut);
    };
    
    this.stopWinAnim = function(iRow){
        createjs.Tween.removeTweens(_aSymbols[iRow]);
        _aSymbols[iRow].scaleX = _aSymbols[iRow].scaleY = 1;
    };
    
    this.isReadyToStop = function(){
        return _bReadyToStop;
    };
    
    this.getPosUpLeft = function(iRow){
        var iX = _oContainer.x;
        var iY = _oContainer.y + (SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS) * iRow;
        return {x:iX,y:iY};
    };
    
    this.getY = function(){
        return _oContainer.y;
    };
    
    this._updateStart = function(){
        if(_iCntFrames === 0 && _iIndex < NUM_REELS){
            playSound("start_reel",1,false);
        }
        
        _iCntFrames++;
        if ( _iCntFrames > _iMaxFrames ){
            _iCntFrames = 0;
            _iMaxFrames /= 2;
            _iCurState++;
            _iCurStartY = _oContainer.y;
            _iFinalY = _iCurStartY + ((SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS) * NUM_ROWS);
        }
        
        var fLerpY = s_oTweenController.easeInBack( _iCntFrames, 0 ,1, _iMaxFrames);
        
        var iValue = s_oTweenController.tweenValue( _iCurStartY, _iFinalY, fLerpY);
        _oContainer.y = iValue;
    };
    
    this._updateMoving = function(){
        _iCntFrames++;
        if ( _iCntFrames > _iMaxFrames ){
            _iCntFrames = 0;
            _iCurStartY = _oContainer.y;
            _iFinalY = _iCurStartY + ( (SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS)* NUM_ROWS);
        }
        
        var fLerpY = s_oTweenController.easeLinear( _iCntFrames, 0 ,1, _iMaxFrames);
        var iValue = s_oTweenController.tweenValue( _iCurStartY, _iFinalY, fLerpY);
        _oContainer.y = iValue;	
    };
    
    this._updateStopping = function(){
        _iCntFrames++;
        
        if ( _iCntFrames >= _iMaxFrames ){
            _bUpdate = false;
            _iCntFrames = 0;
            _iMaxFrames = MAX_FRAMES_REEL_EASE;
            _iCurState = REEL_STATE_START;
            _iContDelay = 0;
            _bReadyToStop = false;
            _bPlayingReelStopAudio = false;

            if(_bContainsFinalSymbols){
                _bContainsFinalSymbols = false;
                _oContainer.y = _iFinalY;
                
            }

            s_oGame.stopNextReel();
        }else{
            var fLerpY = s_oTweenController.easeOutBack( _iCntFrames, 0 ,1, _iMaxFrames);
            var iValue = s_oTweenController.tweenValue( _iCurStartY, _iFinalY, fLerpY);
            _oContainer.y = iValue;	
            
            if(_bPlayingReelStopAudio === false && _iCntFrames >= (_iMaxFrames*0.7) && _bContainsFinalSymbols){
                _bPlayingReelStopAudio = true;
                if((_aSymbolValues[0] === BONUS_SYMBOL || _aSymbolValues[1] === BONUS_SYMBOL || _aSymbolValues[2] === BONUS_SYMBOL ) ){
                    playSound("reel_stop_bonus",1,false);
                }else if((_aSymbolValues[0] === FREESPIN_SYMBOL || _aSymbolValues[1] === FREESPIN_SYMBOL || _aSymbolValues[2] === FREESPIN_SYMBOL )){
                    playSound("reel_stop_freespin",1,false);
                }else{
                    playSound("reel_stop",1,false);
                }
            }
        }
        
        
    };

    this.update = function() {
        if (_bUpdate === false) {
            return;
        }
        
        _iContDelay++;

	if (_iContDelay > _iDelay) {
            if(_bReadyToStop === false && (_oContainer.y > REEL_ARRIVAL_Y) && _iCurState !== REEL_STATE_STOP){
                s_oGame.reelArrived(_iIndex, _iCol);
            }
            switch(_iCurState) {
                case REEL_STATE_START: {
                    this._updateStart();
                    break;
                }
                case REEL_STATE_MOVING: {
                    this._updateMoving();
                    break;
                }
                case REEL_STATE_STOP: {
                    this._updateStopping();
                    break;
                }
            }
        }
    };
    
    this._init(iIndex,iXPos,iYPos,iDelay,aSymbols);
    
}