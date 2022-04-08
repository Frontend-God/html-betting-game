function CMenu(){
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosCredits;
    var _pStartPosDelete;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oBg;
    var _oButPlay;
    var _oButDeleteSavings;
    var _oAudioToggle;
    var _oButCredits;
    var _oButFullscreen;
    var _oFade;
    var _oAreYouSurePanel;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oAttachSection.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -164,oSprite,s_oAttachSection);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.width/4) - 4, y: (oSprite.height/2) + 4};   
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        if(SHOW_CREDITS){
            var oSprite = s_oSpriteLibrary.getSprite('but_credits');
            _pStartPosCredits = {x:(oSprite.width/2) + 4,y:(oSprite.height/2) + 4};
            _oButCredits = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite,s_oAttachSection);
            _oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditsRelease, this);
            
            _pStartPosFullscreen = {x: _pStartPosCredits.x + oSprite.width + 4,y:_pStartPosCredits.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
             _pStartPosFullscreen = {x:(oSprite.width/4) + 4,y:(oSprite.height/2) + 4};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oAttachSection);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite("but_delete_savings")
        _pStartPosDelete = {x:oSprite.width/2 +4,y:CANVAS_HEIGHT-oSprite.height/2-4};
        _oButDeleteSavings = new CGfxButton(_pStartPosDelete.x,_pStartPosDelete.y,oSprite,s_oAttachSection);
        _oButDeleteSavings.addEventListener(ON_MOUSE_UP,this._onDeleteSavings,this);


        if(!s_bStorageAvailable){
            s_oMsgBox.show(TEXT_ERR_LS);
            _oButDeleteSavings.setVisible(false);
        }else if(!RESTART_CREDIT && getItem(LOCALSTORAGE_STRING+"score")){
            TOTAL_MONEY = parseFloat(getItem(LOCALSTORAGE_STRING+"score"));
        }else{
            _oButDeleteSavings.setVisible(false);
        }
        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onExitYes,this);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oAttachSection.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos ();
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        
        _oButDeleteSavings.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if(SHOW_CREDITS){
            _oButCredits.unload();
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oAttachSection.removeChild(_oBg);
        _oBg = null;
        
        s_oAttachSection.removeChild(_oFade);
        _oFade = null;
        
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if(SHOW_CREDITS){
            _oButCredits.setPosition(_pStartPosCredits.x + s_iOffsetX,_pStartPosCredits.y + s_iOffsetY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButDeleteSavings.setPosition(_pStartPosDelete.x + s_iOffsetX,_pStartPosDelete.y-s_iOffsetY)
    };
    
    this._onButPlayRelease = function(){
        this.unload();
        $(s_oMain).trigger("start_session");
        s_oMain.gotoGame();
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButCreditsRelease = function(){
        new CCreditsPanel();
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onDeleteSavings = function(){
        _oAreYouSurePanel.show(TEXT_DELETE_SAVINGS+": "+START_MONEY+TEXT_CURRENCY+"\n"+TEXT_ARE_SURE);
    };
    
    this._onExitYes = function(){
        clearLocalStorage();
        _oButDeleteSavings.setVisible(false);
    };
    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;