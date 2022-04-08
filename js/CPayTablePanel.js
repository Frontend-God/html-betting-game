function CPayTablePanel(){
    var _iCurPage;
    var _aNumSymbolComboText;
    var _aWinComboText;
    var _aPages;

    var _oCurPage;
    
    var _oButExit;
    var _oButArrowNext;
    var _oButArrowPrev;
    var _oContainer;
    
    this._init = function(){
        _iCurPage = 0;
        _aPages = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.on("click",function(){});
        _oContainer.visible = false;
        s_oAttachSection.addChild(_oContainer);
        
        //ATTACH PAGE 1
        var oContainerPage = new createjs.Container();
        _oContainer.addChild(oContainerPage);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable1'));
        oContainerPage.addChild(oBg);
        
        //LIST OF COMBO TEXT

        this._createPayouts(oContainerPage);
        
        _aPages[0] = oContainerPage;
        
        //ATTACH PAGE 2
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        
        oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable2'));
        oContainerPage.addChild(oBg);

        _aPages[1] = oContainerPage;
        
        _oCurPage = _aPages[_iCurPage];
        
        //ATTACH PAGE 3
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        
        oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable3'));
        oContainerPage.addChild(oBg);
        
        var oText = new CTLText(oContainerPage, 
                    543, 169, 280, 80, 
                    21, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    TEXT_HELP_BONUS1,
                    true, true, true,
                    false );

        
        var oText2 = new CTLText(oContainerPage, 
                    543, 274, 280, 140, 
                    32, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    TEXT_HELP_BONUS2,
                    true, true, true,
                    false );

        
        _aPages[2] = oContainerPage;
        
        //ATTACH PAGE 4
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        
        oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable4'));
        oContainerPage.addChild(oBg);
        
        var iYPos = 185;
        for(var j=0;j<3;j++){
            var oText = new createjs.Text((j+3)+"X  "+NUM_FREESPIN[j],"17px "+FONT_GAME_1, "#fce0ab");
            oText.textAlign = "left";
            oText.x = CANVAS_WIDTH/2 + 21;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);

            iYPos += 28;
        }
        
        var oText = new CTLText(oContainerPage, 
                    CANVAS_WIDTH/2 - 155, 284, 312, 125, 
                    31, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    TEXT_HELP_FREESPIN,
                    true, true, true,
                    false );
                    

        
        _aPages[3] = oContainerPage;
        
        _oCurPage = _aPages[_iCurPage];

        //ATTACH ARROW
        _oButArrowPrev = new CGfxButton(217,CANVAS_HEIGHT - 119,s_oSpriteLibrary.getSprite('but_arrow_prev'),_oContainer);
        _oButArrowPrev.addEventListener(ON_MOUSE_UP, this._onPrev, this);
        
        _oButArrowNext = new CGfxButton(CANVAS_WIDTH - 221,CANVAS_HEIGHT - 124,s_oSpriteLibrary.getSprite('but_arrow_next'),_oContainer);
        _oButArrowNext.addEventListener(ON_MOUSE_UP, this._onNext, this);
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit_info');
        _oButExit = new CGfxButton(840, 122, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
    };
    
    this.unload = function(){
        return;
        _oContainer.off("click",function(){});
        _oButExit.unload();
        
        _oButArrowNext.unload();
        _oButArrowPrev.unload();
        
        s_oAttachSection.removeChild(_oContainer);
        
        for(var i=0;i<_aNumSymbolComboText.length;i++){
            _oContainer.removeChild(_aNumSymbolComboText[i]);
        }
        
        for(var j=0;j<_aWinComboText.length;j++){
            _oContainer.removeChild(_aWinComboText[j]);
        }
        
    };
    
    this._createPayouts = function(oContainerPage){
        _aNumSymbolComboText = new Array();
        _aWinComboText = new Array();
        
        var aPos = [{x:673,y:300},{x:519,y:300},{x:365,y:300},{x:750,y:223},{x:593,y:223},{x:439,y:223},{x:285,y:223},{x:131,y:223}];
        var iCurPos = 0;
        for(var i=0;i<PAYTABLE_VALUES.length;i++){
            var aSymbolPayouts = PAYTABLE_VALUES[i];
            do{
                var iIndex = aSymbolPayouts.indexOf(0);
                if(iIndex !== -1){
                    aSymbolPayouts.splice(iIndex, 1);
                }
                
            }while(iIndex !== -1);
            
            var iLen = aSymbolPayouts.length;
            
            if(iLen === 0){
                continue;
            }
            
            var iOffsetY = 17;
            if(iLen === 4){
                iOffsetY = 13;
            }
            
            var iYPos = aPos[iCurPos].y;
            _aNumSymbolComboText[i] = new Array();
            _aWinComboText[i] = new Array();

            for(var j=0;j<iLen;j++){
                var oTextMult = new CTLText(oContainerPage, 
                    aPos[iCurPos].x, iYPos, 30, 15, 
                    15, "left", "#fff", FONT_GAME_1, 1,
                    0, 0,
                    "X"+(5-j),
                    true, true, false,
                    false );


                _aNumSymbolComboText[i][j] = oTextMult;
                
                var oText =  new CTLText(oContainerPage, 
                    aPos[iCurPos].x+ 35, iYPos, 50, 15, 
                    15, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    aSymbolPayouts[iLen-j-1],
                    true, true, false,
                    false );
                    


                _aWinComboText[i][j] = oText;
            
                iYPos += iOffsetY;
            }
            
            iCurPos++;
        }
    };
    
    this._onNext = function(){
        if(_iCurPage === _aPages.length-1){
            _iCurPage = 0;
        }else{
            _iCurPage++;
        }
        
        
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
    };
    
    this._onPrev = function(){
        if(_iCurPage === 0){
            _iCurPage = _aPages.length -1;
        }else{
            _iCurPage--;
        }
        
        
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
    };

    
    this.show = function(){
        _iCurPage = 0;
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
        
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this.resetHighlightCombo = function(){
        return;
        for(var i=0;i<_aNumSymbolComboText.length;i++){
            if(_aNumSymbolComboText[i] !== undefined){
                for(var j=0;j<_aNumSymbolComboText[i].length;j++){
                    _aNumSymbolComboText[i][j].color = "#ffffff";
                    _aWinComboText[i][j].color = "#ffff00";
                    createjs.Tween.removeTweens(_aWinComboText[i][j]);
                    _aWinComboText[i][j].alpha = 1;
                }
            }
            
        } 
    };
    
    this.highlightCombo = function(iSymbolValue,iNumCombo){
        
        _aWinComboText[iSymbolValue-1][NUM_REELS-iNumCombo].color = "#ff9000";
        
        this.tweenAlpha(_aWinComboText[iSymbolValue-1][NUM_REELS-iNumCombo],0);
        
    };
    
    this.tweenAlpha = function(oText,iAlpha){
        var oParent = this;
        createjs.Tween.get(oText).to({alpha:iAlpha}, 200).call(function(){if(iAlpha === 1){
                                                                                    oParent.tweenAlpha(oText,0);
                                                                                }else{
                                                                                    oParent.tweenAlpha(oText,1);
                                                                                }
        });
    };
    
    this._onExit = function(){
        s_oGame.hidePayTable();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this._init();
}