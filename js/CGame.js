function CGame(){
    var _bUpdate = false;
    var _bReadyToStop = false;
    var _bFreespinEnable;
    var _bAutoSpin;
    var _bActivateFreespin;
    var _iCurState;
    var _iCurReelLoops;
    var _iNextColToStop;
    var _iNumReelsStopped;
    var _iLastLineActive;
    var _iTimeElaps;
    var _iCurWinShown;
    var _iCurPointToDraw;
    var _iCurBet;
    var _iTotBet;
    var _iMoney;
    var _iTotWin;
    var _iFreespinWinAmount;
    var _fBonusWin;
    var _iFreeSpinWin;
    var _iTotFreeSpin;
    var _iNumAds;
    var _aBonusId;
    var _aShapesToDraw;
    var _iCurCoinIndex;
    var _aMovingColumns;
    var _aAnimSymbol;
    var _aWinningLine;
    var _aReelSequence;
    var _aFinalSymbolCombo;
    var _pStartPosLogo;
    

    var _oBg;
    var _oBgFreespin;
    var _oLogo;
    var _oFrontSkin;
    var _oFreespinPanel;
    var _oFreespinResult;
    var _oInterface;
    var _oPayTable = null;
    var _oBonusPanel;
    var _oContainerSlot;
    var _oContainerReels;
    var _oAvatar;
    
    this._init = function(){
        _iCurState = GAME_STATE_IDLE;
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iFreespinWinAmount = 0;
        _iNumAds = 0;
        
        _iTimeElaps = 0;
        _aReelSequence = new Array(0,1,2,3,4);
        _iNextColToStop = _aReelSequence[0];
        _iLastLineActive = NUM_PAYLINES;
        _iMoney = TOTAL_MONEY;

        _iCurBet = START_BET;
        
        for(var k=0;k<COIN_BET.length;k++){
            if(_iCurBet === COIN_BET[k]){
                _iCurCoinIndex = k;
                break;
            }
        }
        
        _iTotBet = _iCurBet * _iLastLineActive;
        _aShapesToDraw = new Array();
        
        _bAutoSpin = false;
        _bFreespinEnable = false;
        _iTotFreeSpin = 0;
        _iFreeSpinWin = 0;
        _aBonusId = [];

        s_oTweenController = new CTweenController();
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oAttachSection.addChild(_oBg);
        
        _oBgFreespin = createBitmap(s_oSpriteLibrary.getSprite("bg_freespins"));
        _oBgFreespin.alpha = 0;
        s_oAttachSection.addChild(_oBgFreespin);
        
        _oContainerSlot = new createjs.Container();
        _oContainerSlot.x = REEL_OFFSET_X;
        _oContainerSlot.y = REEL_OFFSET_Y;
        s_oAttachSection.addChild(_oContainerSlot);
        

        this._initReels();
        
        

        _oFrontSkin = new createjs.Bitmap(s_oSpriteLibrary.getSprite('mask_slot'));
        _oFrontSkin.x = -63;
        _oFrontSkin.y = 0;
        _oContainerSlot.addChild(_oFrontSkin);
        
        
        
       var oData = {   // image to use
                        images: [s_oSpriteLibrary.getSprite('logo')], 
                        // width, height & registration point of each sprite
                        framerate: 15,
                        "frames": [
                                        [1, 1, 135, 52, 0, 190, 1],
                                        [136, 1, 135, 52, 0, 190, 1],
                                        [267, 1, 135, 52, 0, 190, 1],
                                        [399, 1, 135, 52, 0, 190, 1],
                                        [1, 59, 135, 55, 0, 190, 1],
                                        [134, 59, 135, 55, 0, 190, 1],
                                        [266, 59, 135, 55, 0, 190, 1],
                                        [398, 59, 135, 55, 0, 190, 1],
                                        [1, 119, 135, 55, 0, 189, 1],
                                        [136, 119, 135, 55, 0, 189, 1],
                                        [269, 119, 135, 55, 0, 189, 1],
                                        [398, 119, 135, 55, 0, 189, 1],
                                        [1, 174, 135, 55, 0, 189, 1],
                                        [136, 174, 135, 55, 0, 189, 1],
                                        [268, 174, 130, 55, 0, 189, 1],
                                        [401, 174, 135, 55, 0, 189, 1],
                                        [1, 226, 135, 55, 0, 191, 1],
                                        [134, 226, 134, 55, 0, 191, 1],
                                        [266, 226, 130, 55, 0, 191, 1],
                                        [399, 226, 135, 55, 0, 191, 1],
                                        [1, 285, 135, 45, 0, 191, -11],
                                        [134, 285, 134, 45, 0, 191, -11],
                                        [269, 285, 130, 45, 0, 191, -11],
                                        [399, 285, 135, 45, 0, 191, -11],
                                ], 
                        animations: { normal: 0, freespin:[1,23,"stop_freespin"],stop_freespin:23 }
       };
       
        _pStartPosLogo = {x:423,y:-35};
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oLogo = createSprite(oSpriteSheet, "normal",97,0,136,54);
        _oLogo.x = _pStartPosLogo.x;
        _oLogo.y = _pStartPosLogo.y;
        _oContainerSlot.addChild(_oLogo);

        _oInterface = new CInterface(_iCurBet,_iTotBet,_oContainerSlot);
        this._initStaticSymbols();
        
        
        _oAvatar = new CAvatar(s_oAttachSection);
        _oAvatar.show(0);

        
        _oPayTable = new CPayTablePanel();
	

        _oBonusPanel = new CBonusPanel();
        _oFreespinPanel = new CFreespinPanel(s_oStage);
        _oFreespinResult = new CResultFreespin(s_oStage);
       
        this.refreshButtonPos ();
        
        
        
        _bUpdate = true;

    };
  

    this.unload = function(){

        _oInterface.unload();
        _oPayTable.unload();
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].unload();
        }
        
        
        s_oMsgBox.unload();
        s_oAttachSection.removeAllChildren();
        s_oGame = null;
    };
    
    this.refreshButtonPos = function(){
        _oInterface.refreshButtonPos();
        _oBonusPanel.refreshButtonPos();
        
        _oAvatar.refreshButtonPos();
    };
    
    this._initReels = function(){  
        var iXPos = START_REEL_OFFSET_X = 15;
        var iYPos = START_REEL_OFFSET_Y = 13;
        
        var oBgFade = new createjs.Shape();
        oBgFade.graphics.beginFill("rgba(0,0,0,0.3)").drawRect(iXPos, iYPos, 
                                                                    (SYMBOL_WIDTH *NUM_REELS) + (SPACE_BETWEEN_SYMBOLS*(NUM_REELS-1)),
                                                                    (SYMBOL_HEIGHT*NUM_ROWS) + (SPACE_HEIGHT_BETWEEN_SYMBOLS*(NUM_ROWS-1)));
        _oContainerSlot.addChild(oBgFade);
        
        _oContainerReels = new createjs.Container();
        _oContainerSlot.addChild(_oContainerReels);
        
        
        
        
        
        var oMaskReel = new createjs.Shape();
        oMaskReel.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(iXPos, iYPos, 
                                                                    (SYMBOL_WIDTH *NUM_REELS) + (SPACE_BETWEEN_SYMBOLS*(NUM_REELS-1)),
                                                                    (SYMBOL_HEIGHT*NUM_ROWS) + (SPACE_HEIGHT_BETWEEN_SYMBOLS*(NUM_ROWS-1)));
        _oContainerSlot.addChild(oMaskReel);
        
        
       this.generateLosingPattern();
        
        var iCurDelay = 0;
        _aMovingColumns = new Array();
        for(var i=0;i<NUM_REELS;i++){ 
            _aMovingColumns[i] = new CReelColumn(i,iXPos,iYPos,iCurDelay,new Array(_aFinalSymbolCombo[0][i],_aFinalSymbolCombo[1][i],_aFinalSymbolCombo[2][i]),_oContainerReels);
            _aMovingColumns[i+NUM_REELS] = new CReelColumn(i+NUM_REELS,iXPos,iYPos + ( ( SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS)*NUM_ROWS),iCurDelay,
                                                            new Array(_aFinalSymbolCombo[0][i],_aFinalSymbolCombo[1][i],_aFinalSymbolCombo[2][i]),_oContainerReels );
            iXPos += SYMBOL_WIDTH + SPACE_BETWEEN_SYMBOLS;
            iCurDelay += REEL_DELAY;
        }

       _oContainerReels.mask = oMaskReel;
        
    };
    
    this._initStaticSymbols = function(){
        var iXPos = REEL_OFFSET_X+START_REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y+START_REEL_OFFSET_Y;
        _aAnimSymbol = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aAnimSymbol[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                var oSymbol = new CAnimSymbol(iXPos,iYPos,s_oAttachSection);
                _aAnimSymbol[i][j] = oSymbol;
                
                iXPos += SYMBOL_WIDTH + SPACE_BETWEEN_SYMBOLS;
            }
            iXPos = REEL_OFFSET_X+START_REEL_OFFSET_X;
            iYPos += (SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS);
        }
    };
    
    
    
    this._generateRandSymbols = function() {
        var aRandSymbols = new Array();
        for (var i = 0; i < NUM_ROWS; i++) {
                var iRandIndex = Math.floor(Math.random()* s_aRandSymbols.length);
                aRandSymbols[i] = s_aRandSymbols[iRandIndex];
                
        }

        return aRandSymbols;
    };
    
    this.reelArrived = function(iReelIndex,iCol) {
        if(_iCurReelLoops>MIN_REEL_LOOPS ){
            if (_iNextColToStop === iCol) {
                if (_aMovingColumns[iReelIndex].isReadyToStop() === false) {
                    var iNewReelInd = iReelIndex;
                    if (iReelIndex < NUM_REELS) {
                            iNewReelInd += NUM_REELS;
                            
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iReelIndex],
                                                                        _aFinalSymbolCombo[1][iReelIndex],
                                                                        _aFinalSymbolCombo[2][iReelIndex]), true);
                            
                    }else {
                            iNewReelInd -= NUM_REELS;
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iNewReelInd],
                                                                          _aFinalSymbolCombo[1][iNewReelInd],
                                                                          _aFinalSymbolCombo[2][iNewReelInd]), true);
                            
                            
                    }
                    
                }
            }else {
                    _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(),false);
            }
            
        }else {
            
            _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(), false);
            if(_bReadyToStop && iReelIndex === 0){
                _iCurReelLoops++;
            }
            
        }
    };
    
    this.stopNextReel = function() {
        _iNumReelsStopped++;

        if(_iNumReelsStopped%2 === 0){
            _iNextColToStop = _aReelSequence[_iNumReelsStopped/2];
            if (_iNumReelsStopped === (NUM_REELS*2) ) {
                    this._endReelAnimation();
            }
        }   
    };
    
    this._realEndReelAnimation = function(){ 
        
        
        if(_aBonusId.indexOf(BONUS_GAME) !== -1 || _iTotFreeSpin>0){
            this.resetAutoSpin();
            _oInterface.disableGuiButtons(_bAutoSpin,_iTotFreeSpin>0?true:false);
        }else{ 
            if(!_bAutoSpin){
                _oInterface.enableGuiButtons();
            }else{
                _oInterface.enableSpin(true);
            }
        }

        _oInterface.setSpinState(TEXT_SPIN);
        
        if(_oLogo.currentAnimation !== "normal"){
            _oInterface.refreshFreeSpinNum(_iTotFreeSpin);
        }
        
        
        if(_aWinningLine.length > 0){
            //HIGHLIGHT WIN COMBOS IN PAYTABLE
            for(var i=0;i<_aWinningLine.length;i++){
                
                if(_aWinningLine[i].line > 0){
                    _oInterface.showLine(_aWinningLine[i].line);
                }
                
                var aList = _aWinningLine[i].list;
                for(var k=0;k<aList.length;k++){
                    _aMovingColumns[aList[k].col].playWinAnim(aList[k].row);
                    _aMovingColumns[aList[k].col+NUM_REELS].playWinAnim(aList[k].row);
                }
                
            }

            if(_iTotWin>0){
                _oInterface.refreshWinText(_iTotWin);
            }
 
            _iTimeElaps = 0;     
            _iCurState = GAME_STATE_SHOW_ALL_WIN;

           
            _oInterface.refreshMoney(_iMoney);
            
        }else{
            if(_iTotFreeSpin > 0){
                _oInterface.disableSpin(_iTotFreeSpin>0?false:true);
                this.onSpin();
            }else{
                if(_oLogo.currentAnimation !== "normal"){
                    _oFreespinResult.show(_iFreespinWinAmount);
                    _oLogo.gotoAndStop("normal");
                    _oInterface.refreshFreeSpinNum("");
                    _oInterface.refreshFreeSpinAmount(0);
                    createjs.Tween.get(_oBgFreespin).to({alpha:0}, 2000, createjs.Ease.cubicOut);
                    
                 
                    _oInterface.enableGuiButtons();
                }
                
                if(_bAutoSpin){
                    if(_iMoney < _iTotBet && _iTotFreeSpin === 0){

                        _oInterface.enableGuiButtons();
                        this.resetAutoSpin();
                        
                        
                        _oInterface.enableGuiButtons();
                        _iCurState = GAME_STATE_IDLE;
                    }else{
                        this.onSpin();
                    }
                }else{

                    _oInterface.enableGuiButtons();
                    _iCurState = GAME_STATE_IDLE;
                    
                }
            }
            
        }

        if(_iMoney < _iTotBet && _iTotFreeSpin === 0){

            _oInterface.enableGuiButtons();
            this.resetAutoSpin();
        }else{
            if(!_bAutoSpin){
                if(_oLogo.currentAnimation !== "stop_freespin"){
                    if(_iTotFreeSpin>0 || _aBonusId.indexOf(BONUS_GAME) !== -1){
                        _oInterface.enableSpin(false);
                    }else{
                        _oInterface.enableGuiButtons();
                        _oInterface.disableBetBut(false);
                    }
                    
                }else if(_aWinningLine.length>0){
                    _oInterface.enableSpin(false);
                    _oInterface.disableBetBut(true);
                }
                
            }

        } 
        
        _oInterface.refreshFreeSpinAmount(_iFreespinWinAmount);
    };
      
    
    this._endReelAnimation = function(){
        _bReadyToStop = false;
        
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iCurWinShown = 0;
        _iNextColToStop = _aReelSequence[0];        
        

        this._realEndReelAnimation();
    };

    this.hidePayTable = function(){
        _oPayTable.hide();
    };
    
    this.fadeInSymbolInWin = function(){
        var iTime = 500;
        var aList = _aWinningLine[_iCurWinShown-1].list;
            
        for(var k=0;k<aList.length;k++){
            _aAnimSymbol[aList[k].row][aList[k].col].hide();
            _aMovingColumns[aList[k].col].fadeIn(aList[k].row,iTime);
            _aMovingColumns[aList[k].col+NUM_REELS].fadeIn(aList[k].row,iTime);
        }
        
        setTimeout(function(){s_oGame.showWin();},iTime);
    };
    
    this.showWin = function(){
        if(_iCurState !== GAME_STATE_SHOW_WIN){
            return;
        }
        
        var iLineIndex;

        if(_iCurWinShown>0){ 
            _iCurPointToDraw = 0;
            stopSound("avatar_win");

            iLineIndex = _aWinningLine[_iCurWinShown-1].line;

            _oInterface.hideLine(iLineIndex);

        }

        if(_iCurWinShown === _aWinningLine.length){
            _iCurWinShown = 0;
            
            if(_oLogo.currentAnimation !== "normal" && _iTotFreeSpin === 0){
                _oFreespinResult.show( _iFreespinWinAmount);
                _oLogo.gotoAndStop("normal");
                _oInterface.refreshFreeSpinNum("");
                _oInterface.refreshFreeSpinAmount(0);
                
                
                createjs.Tween.get(_oBgFreespin).to({alpha:0}, 2000, createjs.Ease.cubicOut);
                _bFreespinEnable = false;
                
                _oInterface.enableGuiButtons();
            }
            
            if(_aBonusId.indexOf(BONUS_GAME) !== -1){
                    this._hideAllWins();
                    $(s_oMain).trigger("bonus_call",{bet:COIN_BET[_iCurCoinIndex]});
              
            }else if(_bActivateFreespin){
                _bActivateFreespin = false;
                _oFreespinPanel.show(_iFreeSpinWin);
            }else if(_iTotFreeSpin > 0){
                _oInterface.disableSpin(_iTotFreeSpin>0?false:true);
                this.onSpin();
            }else if(_bAutoSpin){
                this.onSpin();
            }else{
                _oInterface.enableGuiButtons();
                _oInterface.disableBetBut(false);

                _iCurState = GAME_STATE_IDLE;
                
                _oInterface.enableGuiButtons();
            }
            
            
            
            
            return;
        }


        var aList = _aWinningLine[_iCurWinShown].list;
        
        //LINE DRAWING
        var aLineToDraw = new Array();
        
        var iStartX = (aList[0].col*(SYMBOL_WIDTH+SPACE_BETWEEN_SYMBOLS));
        var iEndX = iStartX + SYMBOL_WIDTH/2  ;
        var iStartY = SYMBOL_HEIGHT/2 + (aList[0].row * SYMBOL_HEIGHT);
        var iEndY = iStartY + Math.floor(Math.random() * 21) -10;
        aLineToDraw.push({x:iStartX,y:iStartY,row:aList[0].row,col:aList[0].col});
         

        for(var k=1;k<aList.length+1;k++){
            var iFract = 0.5;
            while(iFract <= 1){
                var oDestPoint = interpolate({x:iStartX,y:iStartY},{x:iEndX,y:iEndY},iFract);
                aLineToDraw.push({x:oDestPoint.x,y:oDestPoint.y,row:aList[k-1].row,col:aList[k-1].col});
                iFract += 0.5;
            }
            
            if(k<aList.length){
                iStartX = iEndX//(aList[k].col*(SYMBOL_WIDTH+SPACE_BETWEEN_SYMBOLS));
                iEndX = (aList[k].col*(SYMBOL_WIDTH+SPACE_BETWEEN_SYMBOLS)) + SYMBOL_WIDTH/2;
                iStartY = iEndY//SYMBOL_HEIGHT/2 + (aList[k].row * SYMBOL_HEIGHT);
                iEndY = SYMBOL_HEIGHT/2 + (aList[k].row * SYMBOL_HEIGHT) + Math.floor(Math.random() * 21) -10;
            }
        }
        
        iEndX += SYMBOL_WIDTH/2;
        iEndY +=  Math.floor(Math.random() * 21) -10;
        aLineToDraw.push({x:iEndX,y:iEndY,row:aList[aList.length-1].row,col:aList[aList.length-1].col});
        
        //CREATE SEGMENTS FOR LINE DRAWING
        _aShapesToDraw = new Array();
        
        for(var i=0;i<aLineToDraw.length-1;i++){
            var oCutStrokeLine = new createjs.Shape();
            var szColor = "#ffffbb";//i%2===0?"#fff":"red";
            oCutStrokeLine.graphics.setStrokeStyle(6,"round",0,0,true).beginStroke(szColor);
            oCutStrokeLine.alpha = 0;
            _oContainerSlot.addChild(oCutStrokeLine);
            oCutStrokeLine.graphics.moveTo(aLineToDraw[i].x,aLineToDraw[i].y);
            oCutStrokeLine.graphics.lineTo(aLineToDraw[i+1].x,aLineToDraw[i+1].y);

            _aShapesToDraw.push({line:oCutStrokeLine,row:aLineToDraw[i+1].row,col:aLineToDraw[i+1].col});
        }
        
        this._drawNextCutLine();
        _oAvatar.show(1);
        playSound("avatar_win",1,false);
        
        _iCurWinShown++;   
    };
    
    this._drawNextCutLine = function(){
        var iTime = 50;
        if(_iCurState === GAME_STATE_SHOW_WIN && _iCurPointToDraw < _aShapesToDraw.length){
            createjs.Tween.get(_aShapesToDraw[_iCurPointToDraw].line).to({alpha:0.8}, iTime).call(function(){s_oGame._drawNextCutLine();}).wait(150).to({alpha:0}, iTime);
            
            if(_iCurPointToDraw > 0 && _iCurWinShown > 0){
                
                if(_iCurPointToDraw%2!==0){
                    //CUT THE FRUIT SYMBOL
                    var iRow = _aShapesToDraw[_iCurPointToDraw].row;
                    var iCol = _aShapesToDraw[_iCurPointToDraw].col;
                    
                    //HIDE STATIC SYMBOL
                    _aMovingColumns[iCol].setVisible(iRow,false);
                    _aMovingColumns[iCol+NUM_REELS].setVisible(iRow,false);

                    _aAnimSymbol[iRow][iCol].playAnim(_aFinalSymbolCombo[iRow][iCol],_aWinningLine[_iCurWinShown-1].amount,_iCurPointToDraw >= (_aShapesToDraw.length-2)?true:false);                    
                } 
            }

            _iCurPointToDraw++;
        }
    };
    
    this._hideAllWins = function(){
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aMovingColumns[j].stopWinAnim(i);
                _aMovingColumns[j+NUM_REELS].stopWinAnim(i);
            }
        }
        
        _oInterface.hideAllLines();
    };
    
    this._prepareForWinsShowing = function(){
        _iCurPointToDraw = 0;
        
        _iTimeElaps = TIME_SHOW_WIN;
        _iCurState = GAME_STATE_SHOW_WIN;
        this.showWin(); 

    };
	
    this.activateLines = function(iLine){
        _iLastLineActive = iLine;
        this.removeWinShowing();
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);

        if(iNewTotalBet>_iMoney){
            _oInterface.disableSpin(_iTotFreeSpin>0?false:true);
        }else{
            _oInterface.enableSpin(_iTotFreeSpin>0?false:true);
        }
    };
	
    this.addLine = function(){
        if(_iLastLineActive === NUM_PAYLINES){
            _iLastLineActive = 1;  
        }else{
            _iLastLineActive++;    
        }
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);

        _oInterface.enableSpin(_iTotFreeSpin>0?false:true);
    };
    
    this.resetCoinBet = function(){
        _iCurCoinIndex = 0;
        
        var iNewBet = COIN_BET[_iCurCoinIndex];
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = iNewBet;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshBet(_iCurBet);
        _oInterface.refreshTotalBet(_iTotBet);       
        

        _oInterface.enableSpin(_iTotFreeSpin>0?false:true);
        
    };
    
    this.changeCoinBet = function(){
        _iCurCoinIndex++;
        if(_iCurCoinIndex === COIN_BET.length){
            _iCurCoinIndex = 0;
        }
        var iNewBet = parseFloat(COIN_BET[_iCurCoinIndex]);
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = iNewBet;
        _iCurBet = Math.floor(_iCurBet * 100)/100;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshBet(_iCurBet);
        _oInterface.refreshTotalBet(_iTotBet);       
        

        _oInterface.enableSpin(_iTotFreeSpin>0?false:true);
        
		
    };
    
    this.removeWinShowing = function(){
        _oPayTable.resetHighlightCombo();
        
        _oInterface.resetWin();
        
        if(_aShapesToDraw[_iCurPointToDraw]){
            createjs.Tween.removeTweens(_aShapesToDraw[_iCurPointToDraw].line);
        }
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aAnimSymbol[i][j].hide();
                _aMovingColumns[j].setVisible(i,true);
                _aMovingColumns[j+NUM_REELS].setVisible(i,true);
            }
        }
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].activate();
        }
        
        _iCurState = GAME_STATE_IDLE;
    };
    
    //THIS FUNCTION IS CALLED WHEN STOP BUTTON IS CLICKED DURING A SPIN
    this.forceStopReel = function(){
        
        if(_iTotFreeSpin === 0){
            this.resetAutoSpin();
        }
        
        
        _iCurState = GAME_STATE_IDLE;
        for(var i=0;i<NUM_REELS;i++){
            _aMovingColumns[i].forceStop(new Array( _aFinalSymbolCombo[0][i],_aFinalSymbolCombo[1][i],_aFinalSymbolCombo[2][i]),START_REEL_OFFSET_Y);
            _aMovingColumns[i+NUM_REELS].forceStop(null,REEL_OFFSET_Y+( ( SYMBOL_HEIGHT + SPACE_HEIGHT_BETWEEN_SYMBOLS)*NUM_ROWS));
        }  
        
        this._endReelAnimation();
    };
    
    this.onSpin = function(){
        
        if( ( (_iTotFreeSpin > 0 && _oLogo.currentAnimation === "normal") || _aBonusId.indexOf(BONUS_GAME) !== -1 || (_iTotFreeSpin === 0 && _oLogo.currentAnimation !== "normal")) 
                                                                && (_iCurState === GAME_STATE_SHOW_ALL_WIN  || _iCurState === GAME_STATE_SHOW_WIN) ){
            this._hideAllWins();
            _oInterface.disableSpin(true);
            //if(_aBonusId.indexOf(BONUS_GAME) === -1){
                this.removeWinShowing();
            //}
            _iCurWinShown = _aWinningLine.length;
            _iCurState = GAME_STATE_SHOW_WIN;
            this.showWin();
            return;
        }else if(_aBonusId.indexOf(BONUS_FREESPIN) !== -1 && (_iCurState === GAME_STATE_SHOW_ALL_WIN  || _iCurState === GAME_STATE_SHOW_WIN)){
            this._hideAllWins();
            _oInterface.disableSpin(true);
            this.removeWinShowing();
            _bActivateFreespin = false;
            _oFreespinPanel.show(_iFreeSpinWin);
            return;
        }

        if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
            //_oInterface.enableGuiButtons();
            this.resetAutoSpin();
            var oRechargePanel = new CRechargePanel();
            return;
        }
        
        _bReadyToStop = false;
        stopSound("avatar_win");
        playSound("spin_but",1,false);
        
        _oInterface.disableBetBut(true);
        
        this.removeWinShowing();
        
        if(_oLogo.currentAnimation === "stop_freespin"){
            _iTotBet = 0;
        }else{
            _iTotBet = _iCurBet * _iLastLineActive;
        }
        

    
        _aBonusId = [];
        this._hideAllWins();
        _oInterface.disableGuiButtons(_bAutoSpin,_iTotFreeSpin>0?true:false);
       
        _iMoney -= _iTotBet;
        _oInterface.refreshMoney(_iMoney);
        
        $(s_oMain).trigger("bet_placed",{bet:COIN_BET[_iCurCoinIndex],tot_bet:_iTotBet,payline:_iLastLineActive});
        

        _iCurState = GAME_STATE_SPINNING;
    };

    
    this.onSpinReceived = function( oData){
         trace(oData)
        
        _iNumAds++;
        if(_iNumAds === NUM_SPIN_FOR_ADS){
            _iNumAds = 0;
            $(s_oMain).trigger("show_interlevel_ad");
        }
        
        if ( oData.res === true ){
            
            _aFinalSymbolCombo = oData.pattern;
            _aWinningLine = oData.win_lines;

            var fWinAmount = parseFloat(oData.tot_win);
            var bBonusWin = oData.bonus;
            _iFreeSpinWin = parseInt(oData.num_freespin);

    
            _iMoney = parseFloat(oData.money);
            

            
            if( _oLogo.currentAnimation !== "normal" && _bActivateFreespin === false){
                _iFreespinWinAmount += fWinAmount;
            }
            _iTotFreeSpin = _iFreeSpinWin;        


            if(fWinAmount > 0 || bBonusWin === true || _iTotFreeSpin > 0){
                _bActivateFreespin = false;
             
                if( oData.freespin ){
                    _aBonusId.push(BONUS_FREESPIN);   
                    _bActivateFreespin = true;
                    _iFreespinWinAmount = 0;
                }
                
                if( bBonusWin ){
                    _aBonusId.push(BONUS_GAME);
                }

                //GET TOTAL WIN FOR THIS SPIN
                _iTotWin = fWinAmount;

                
            }else{
                _aWinningLine = new Array();
           
            }
            
            _bReadyToStop = true;
            $(s_oMain).trigger("save_score",_iMoney);
            
            saveItem(LOCALSTORAGE_STRING+"score",_iMoney);
        }else{
            s_oGame.generateLosingPattern();
        }
        
    };
   
    
    this.onBonusStart = function(oData){
        trace(oData)
        _iMoney    = parseFloat(oData.money);
        _fBonusWin = parseFloat(oData.bonus_win);
        
        _oBonusPanel.show(oData.prize_list,_iCurBet);

        _iCurState = GAME_STATE_BONUS;
    };

    
    //AUTOSPIN BUTTON CLICKED
    this.onAutoSpin = function(bAutoSpin){
        _bAutoSpin = bAutoSpin;

        if(bAutoSpin && _iCurState === GAME_STATE_IDLE){
            this.onSpin();
        }
    };
    
    this.onStopAutoSpin = function(){
        this.resetAutoSpin();
        
        if(_iCurState !== GAME_STATE_SPINNING && _iCurState !== GAME_STATE_BONUS){
            _oInterface.enableGuiButtons();
        }
    };
    
    this.generateLosingPattern = function(){
         var aFirstCol = new Array();
         for(var i=0;i<NUM_ROWS;i++){
            var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
            var iRandSymbol = s_aRandSymbols[iRandIndex];
            aFirstCol[i] = iRandSymbol;  
        }
        
        _aFinalSymbolCombo = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aFinalSymbolCombo[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                
                if(j === 0){
                    _aFinalSymbolCombo[i][j] = aFirstCol[i];
                }else{
                    do{
                        var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
                        var iRandSymbol = s_aRandSymbols[iRandIndex];
                    }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol);

                    _aFinalSymbolCombo[i][j] = iRandSymbol;
                }  
            }
        }
        
        _aWinningLine = new Array();
        _bReadyToStop = true;
 
    };

    this.onInfoClicked = function(){
        if(_iCurState === GAME_STATE_SPINNING){
            return;
        }
        
        if(_oPayTable.isVisible()){
            _oPayTable.hide();
        }else{
            _oPayTable.show();
        }
    };
    
    this.resetAutoSpin = function(){
        _bAutoSpin = false;
        _oInterface.setAutoSpinState(TEXT_AUTO_SPIN);
    };
    
    this.exitFromFreespinPanel = function(){
        _bFreespinEnable = true;
        _oInterface.refreshFreeSpinNum(_iTotFreeSpin);
        _oInterface.refreshFreeSpinAmount(0);
        _oLogo.gotoAndPlay("freespin");
        createjs.Tween.get(_oBgFreespin).to({alpha:1}, 2000, createjs.Ease.cubicOut);
        
        _oInterface.disableSpin(_iTotFreeSpin>0?false:true);
        _iCurState = GAME_STATE_IDLE;
        this.onSpin();
    };
    
    
    this.exitFromBonus = function(iTotBonusWin){
        _oInterface.refreshMoney( _iMoney );
        _oInterface.refreshWinText(iTotBonusWin);
        
        if(_bActivateFreespin){
            _bActivateFreespin = false;
            _oFreespinPanel.show(_iFreeSpinWin);
        }else if(_bAutoSpin){
            this.onSpin();
        }else{
            _oInterface.enableGuiButtons();
            _oInterface.disableBetBut(false);
            _oInterface.enableSpin(_iTotFreeSpin>0?false:true);
            
            _oInterface.enableGuiButtons();
        } 
    };
    
    this.refreshMoney = function(iMoney){
        _iMoney = iMoney;
        _oInterface.refreshMoney(_iMoney);
    };

    this.onExit = function(){      
        $(s_oMain).trigger("start_session");
        
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this.getState = function(){
        return _iCurState;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
   
        switch(_iCurState){
            case GAME_STATE_SPINNING:{
                for(var i=0;i<_aMovingColumns.length;i++){
                    _aMovingColumns[i].update();
                }
                break;
            }
            case GAME_STATE_SHOW_ALL_WIN:{
                    
                    _iTimeElaps += s_iTimeElaps;
                    if(_iTimeElaps> TIME_SHOW_ALL_WINS){ 
                        _iTimeElaps = 0;
                        this._hideAllWins();
        
                        if(_bAutoSpin){
                            _iCurWinShown = _aWinningLine.length;
                        }else{
                            _iCurWinShown = 0; 
                        }
                        this._prepareForWinsShowing();
                    }
                    break;
            }
            case GAME_STATE_SHOW_WIN:{
                for(var i=0;i<NUM_ROWS;i++){
                    for(var j=0;j<NUM_REELS;j++){
                        _aAnimSymbol[i][j].update();
                    }
                }
                break;
            }
            case GAME_STATE_BONUS:{
                    _oBonusPanel.update();
                    break;
            }
        }

    };
    
    s_oGame = this;
    
    this._init();
}

var s_oGame = null;
var s_oTweenController;