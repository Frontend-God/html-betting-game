function CBonusPanel(){
    var _bUpdate;
    var _bSpriteLoaded = false;
    var _iCurPrize;
    var _iTotWin;
    var _iMaskWidth;
    var _iMaskHeight;
    var _iCurResources;
    var _iTotResources;
    var _iCurBet;
    var _aPosXFruits;
    var _aBonusSeq;
    var _aButtons;
    var _aShadows;
    var _oMaskPreloader;
    var _oListenerBlock;
    var _pStartPosScore;

    var _oBg;
    var _oBgLoading;
    var _oCurFruit;
    var _oLoadingText;
    var _oProgressBar;
    var _oResultPanel;
    var _oScoreText = null;
    var _oCharacter;
    var _oContainerButtons = null;
    var _oTextInstructions;
    var _oMultAmountText;
    var _oContainerScore;
    var _oBlock;
   
    var _oContainer;
    
    this._init = function(){
        _bUpdate = false;
        _bSpriteLoaded = true;

        _aPosXFruits = [CANVAS_WIDTH/2-210,CANVAS_WIDTH/2,CANVAS_WIDTH/2+210];
        _oContainer.removeAllChildren();
        _oContainer.visible = false;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_bonus');
        _oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(_oBg);
        
        _oCharacter = new CBonusCharacter(180,CANVAS_HEIGHT-40,_oContainer);
        
        _oContainerButtons = new createjs.Container();
        _oContainer.addChild(_oContainerButtons);
        
        
        var oSpiteScoreBg = s_oSpriteLibrary.getSprite("amount_bonus_win");
        _pStartPosScore = {x:CANVAS_WIDTH/2-oSpiteScoreBg.width/2,y:7};
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = _pStartPosScore.x;
        _oContainerScore.y = _pStartPosScore.y;
        _oContainer.addChild(_oContainerScore);
        
        
        var oBgScore = createBitmap(oSpiteScoreBg);
        _oContainerScore.addChild(oBgScore);
        
        _oMultAmountText = new createjs.Text(formatEntries(0),"32px "+FONT_GAME_1, "#fce0ab");
        _oMultAmountText.textAlign="center";
        _oMultAmountText.x = oSpiteScoreBg.width/2;
        _oMultAmountText.y = 7;
        _oMultAmountText.shadow = new createjs.Shadow("#000", 1, 1, 1);
        _oContainerScore.addChild(_oMultAmountText);
        
        _oTextInstructions = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-200, 112, 400, 70, 
                    35, "center", "#fce0ab", FONT_GAME_1, 1,
                    0, 0,
                    TEXT_BONUS_HELP,
                    true, true, true,
                    false );
        _oTextInstructions.setShadow("#000", 1, 1, 1);

        
        _oBlock = new createjs.Shape();
        _oBlock.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListenerBlock = _oBlock.on("click",function(){});
        _oContainer.addChild(_oBlock);
        
        this.refreshButtonPos();
        
        this._startBonus();
    };
    
    this._loadAllResources = function(){

        _oContainer = new createjs.Container();
        s_oAttachSection.addChild(_oContainer);

        var oSprite = s_oSpriteLibrary.getSprite('bg_loading_bonus');
        _oBgLoading = createBitmap(oSprite);
        _oContainer.addChild(_oBgLoading);
        
        var oSprite = s_oSpriteLibrary.getSprite('progress_bar');
       _oProgressBar  = createBitmap(oSprite);
       _oProgressBar.x = CANVAS_WIDTH/2 - (oSprite.width/2);
       _oProgressBar.y = CANVAS_HEIGHT - 91;
       _oContainer.addChild(_oProgressBar);
       
       _iMaskWidth = oSprite.width;
       _iMaskHeight = oSprite.height;
       _oMaskPreloader = new createjs.Shape();
       _oMaskPreloader.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oProgressBar.x, _oProgressBar.y, 1,_iMaskHeight);
       _oContainer.addChild(_oMaskPreloader);
       
       _oProgressBar.mask = _oMaskPreloader;
       
        _oLoadingText = new createjs.Text("","21px "+FONT_GAME_2, "#fff");
        _oLoadingText.x = CANVAS_WIDTH/2;
        _oLoadingText.y = CANVAS_HEIGHT - 59;
        _oLoadingText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oLoadingText.textBaseline = "alphabetic";
        _oLoadingText.textAlign = "center";
        _oContainer.addChild(_oLoadingText);

        s_oSpriteLibrary.init( this._onResourceBonusLoaded,this._onAllImagesLoaded, this );
        
        //LOAD BONUS SPRITES
        s_oSpriteLibrary.addSprite("bg_bonus","./sprites/bonus/bg_bonus.jpg");
        s_oSpriteLibrary.addSprite("shadow_fruit","./sprites/bonus/shadow_fruit.png");
        s_oSpriteLibrary.addSprite("avatar_strafe_in","./sprites/bonus/avatar_strafe_in.png");
        s_oSpriteLibrary.addSprite("avatar_strafe_out","./sprites/bonus/avatar_strafe_out.png");
        
        _iCurResources = 0;
       
        _iTotResources = s_oSpriteLibrary.getNumSprites() ;
        if(_iTotResources === 0){
            this._startBonus();
        }else{
            s_oSpriteLibrary.loadSprites();
        }

    };
    
    // CALLBACK FOR LOADED RESOURCES
    this._onResourceBonusLoaded = function(){
        _iCurResources++;
        var iPerc = Math.floor(_iCurResources/_iTotResources *100);
        _oLoadingText.text = iPerc+"%";
        _oMaskPreloader.graphics.clear();
        var iNewMaskWidth = Math.floor((iPerc*_iMaskWidth)/100);
        _oMaskPreloader.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oProgressBar.x, _oProgressBar.y, iNewMaskWidth,_iMaskHeight);
        
        if(_iCurResources === _iTotResources){
           this._init();
        }
    };

    this.refreshButtonPos = function(){
        if(_oContainerScore !== undefined){
            _oContainerScore.y = _pStartPosScore.y + s_iOffsetY;
        }
    };
    
    this.unload = function(){
        _oBlock.off("click",_oListenerBlock);
        for(var i=0;i<_aButtons.length;i++){
            _aButtons[i].unload();
            _oContainer.removeChild(_aShadows[i]);
        }
    };
    
    this._onAllImagesLoaded = function(){
    };
    
    this.reset = function(){
        _oResultPanel.unload();
        
        if(_oScoreText !== null){
            _oScoreText.unload();
            _oScoreText = null;
        }
        _oMultAmountText.text = formatEntries(0);
        _oCharacter.reset();
    };
    
    this.show = function(aBonusSeq,iCurBet){
  
        _iCurBet = iCurBet;
        _aBonusSeq = aBonusSeq;
        
        if(_bSpriteLoaded){
            this._startBonus();
        }else{
            this._loadAllResources();
        }
    };
    
    this.hide = function(){
        _bUpdate = false;
        
        _oBg.off("click",function(){});
        _oContainer.visible = false;

        this.reset();
        s_oGame.exitFromBonus(_iTotWin);

    };
    
    this._startBonus = function(){
        _iTotWin = 0;
        this._initFruitButtons();
        

        _oTextInstructions.setAlpha(0);
        createjs.Tween.get(_oTextInstructions.getText()).to({alpha:1}, 800);
        
        _oBg.on("click",function(){});
        _oContainer.visible = true;
        _bUpdate = true;
    };
    
    this.endBonus = function(){
        _oResultPanel = new CBonusResultPanel(_iTotWin,_oContainer);
        

        playSound("bonus_end",1,false);
    };
    
    this._initFruitButtons = function(){
        _oCurFruit = null;

        if(_aBonusSeq.length === 0){
            this.endBonus();
        }else{
            
            _aButtons = new Array();   
            _aShadows = new Array();
            _iCurPrize = _aBonusSeq.shift();
            _iTotWin += _iCurPrize;
            
            var oSpriteShadow = s_oSpriteLibrary.getSprite("shadow_fruit");
            
            var aFruits = shuffle([0,1,2,3,4,5,6])
            for(var i=0;i<3;i++){
                var iIndex = aFruits.pop();
                var oButton = new CBonusBut(i,_aPosXFruits[i],-70,iIndex,_oContainerButtons);
                oButton.pulseAnimation();
                oButton.addEventListener(ON_MOUSE_UP,this._onButtonRelease,this);

                _aButtons.push(oButton);
                
                
                var oShadow = createBitmap(oSpriteShadow);
                oShadow.regX = oSpriteShadow.width/2;
                oShadow.regY = oSpriteShadow.height/2;
                oShadow.x = _aPosXFruits[i];
                oShadow.y = 469;
                oShadow.alpha = 0.6;
                _oContainer.addChild(oShadow);
                createjs.Tween.get(oShadow,{loop:true}).to({alpha: 1}, 850, createjs.Ease.quadOut).to({alpha: 0.7}, 650, createjs.Ease.quadIn);
                
                _aShadows.push(oShadow);
            }

            this._showAllButtons();
        }
        
        
    };
    
    this._showAllButtons = function(){
        _oBlock.visible = false;
        var iTime = 500;
        for(var i=0;i<_aButtons.length;i++){
            _aButtons[i].tweenDown(243,iTime);
            
            iTime += 200;
        }
        
        _oTextInstructions.setAlpha(0);
        createjs.Tween.get(_oTextInstructions.getText()).to({alpha:1}, 800);
    };
    
    this._disableAllButtons = function(){
        _oBlock.visible = true;
        
        for(var i=0;i<_aButtons.length;i++){
            _aButtons[i].stopPulse();
            createjs.Tween.removeTweens(_aShadows[i]);
        }
    };
    
    this.cutTheFruit = function(){
        _oCurFruit.playCutAnim();
        if(_iCurPrize>0){
            new CScoreText(formatEntries(_iCurPrize),_oCurFruit.getX(),_oCurFruit.getY(),_oContainer);
        }else{
            new CScoreText(TEXT_NO_WIN,_oCurFruit.getX(),_oCurFruit.getY(),_oContainer);
        }
        
        playSound("bonus_mult",1,false);
        
        this.refreshScoreAmount(_iTotWin);
        
        for(var i=0;i<_aButtons.length;i++){
            if(_oCurFruit !== _aButtons[i]){
                _aButtons[i].tweenUp(-70,350);
                
            }
            createjs.Tween.get(_aShadows[i]).to({alpha:0}, 500, createjs.Ease.backIn);
        }
    };
    
    this.checkNextTurn = function(){
        this._initFruitButtons();
    };
    
    this._onButtonRelease = function(iIndex){
        createjs.Tween.get(_oTextInstructions.getText()).to({alpha:0}, 800);
        
        s_oBonusPanel._disableAllButtons();
        
        _oCurFruit = _aButtons[iIndex];
        
        if(_oCharacter.getCurX() === _aPosXFruits[iIndex] +100){
            _oCharacter.cutFruit();
        }else{
            _oCharacter.startMoving(_aPosXFruits[iIndex] + 100);
        }
    };
    
    this.refreshScoreAmount = function(iScore){
        _oMultAmountText.text = formatEntries(iScore);
    };

    
    this.update = function(){
	if(_bUpdate){
            if(_oCurFruit !== null){
                
                _oCurFruit.update();
            }
        }
    };
    
    s_oBonusPanel = this;
}


var s_oBonusPanel = null;