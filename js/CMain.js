function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);  
        
        s_oAttachSection = new createjs.Container();
        s_oStage.addChild(s_oAttachSection);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.framerate = FPS;
	createjs.Ticker.addEventListener("tick", this._update);
	
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

    };
    
    this.preloaderReady = function(){
        this._loadImages();
        if( (DISABLE_SOUND_DESKTOP === false && s_bMobile === false) ||
                                            s_bMobile === true &&  DISABLE_SOUND_MOBILE === false  ){
            this._initSounds();
        }
        
        
        
        _bUpdate = true;
    };

    this.soundLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);

    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);


        s_aSoundsInfo = new Array();

        s_aSoundsInfo.push({path: './sounds/',filename:'press_but',loop:false,volume:1, ingamename: 'press_but'});
        s_aSoundsInfo.push({path: './sounds/',filename:'reel_stop',loop:false,volume:1, ingamename: 'reel_stop'});
        s_aSoundsInfo.push({path: './sounds/',filename:'reel_stop_bonus',loop:false,volume:1, ingamename: 'reel_stop_bonus'});
        s_aSoundsInfo.push({path: './sounds/',filename:'reel_stop_freespin',loop:false,volume:1, ingamename: 'reel_stop_freespin'});
        s_aSoundsInfo.push({path: './sounds/',filename:'start_reel',loop:false,volume:1, ingamename: 'start_reel'});
        s_aSoundsInfo.push({path: './sounds/',filename:'spin_but',loop:false,volume:1, ingamename: 'spin_but'});
        s_aSoundsInfo.push({path: './sounds/',filename:'symbol_0_1_2',loop:false,volume:1, ingamename: 'symbol_0_1_2'});
        s_aSoundsInfo.push({path: './sounds/',filename:'symbol_3_4_5',loop:false,volume:1, ingamename: 'symbol_3_4_5'});
        s_aSoundsInfo.push({path: './sounds/',filename:'symbol_6',loop:false,volume:1, ingamename: 'symbol_6'});
        s_aSoundsInfo.push({path: './sounds/',filename:'symbol_7_8_9',loop:false,volume:1, ingamename: 'symbol_7_8_9'});
        s_aSoundsInfo.push({path: './sounds/',filename:'avatar_win',loop:false,volume:1, ingamename: 'avatar_win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'avatar_cut',loop:false,volume:1, ingamename: 'avatar_cut'});
        s_aSoundsInfo.push({path: './sounds/',filename:'bonus_end',loop:false,volume:1, ingamename: 'bonus_end'});
        s_aSoundsInfo.push({path: './sounds/',filename:'swoosh',loop:false,volume:1, ingamename: 'swoosh'});
        s_aSoundsInfo.push({path: './sounds/',filename:'bonus_mult',loop:false,volume:1, ingamename: 'bonus_mult'});
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
        
    };  
    
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
        
        
    };

    
    this._loadImages = function(){
        
        
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("paytable1","./sprites/paytable1.jpg");
        s_oSpriteLibrary.addSprite("paytable2","./sprites/paytable2.jpg");
        s_oSpriteLibrary.addSprite("paytable3","./sprites/paytable3.jpg");
        s_oSpriteLibrary.addSprite("paytable4","./sprites/paytable4.jpg");
        s_oSpriteLibrary.addSprite("mask_slot","./sprites/mask_slot.png");
        s_oSpriteLibrary.addSprite("but_text","./sprites/but_text.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_arrow_next","./sprites/but_arrow_next.png");
        s_oSpriteLibrary.addSprite("but_arrow_prev","./sprites/but_arrow_prev.png");
        s_oSpriteLibrary.addSprite("logo","./sprites/logo.png");
        s_oSpriteLibrary.addSprite("bg_loading_bonus","./sprites/bg_loading_bonus.jpg");
        s_oSpriteLibrary.addSprite("bg_loading","./sprites/bg_loading.jpg");
        s_oSpriteLibrary.addSprite("but_exit_info","./sprites/but_exit_info.png");
        s_oSpriteLibrary.addSprite("bg_freespins","./sprites/bg_freespins.jpg");
        s_oSpriteLibrary.addSprite("amount_freespins","./sprites/amount_freespins.png");
        s_oSpriteLibrary.addSprite("amount_freespin_win","./sprites/amount_freespin_win.png");
        s_oSpriteLibrary.addSprite("amount_bonus_win","./sprites/amount_bonus_win.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
       
        s_oSpriteLibrary.addSprite("symbol_0","./sprites/symbol_0.png");
        s_oSpriteLibrary.addSprite("symbol_1","./sprites/symbol_1.png");
        s_oSpriteLibrary.addSprite("symbol_2","./sprites/symbol_2.png");
        s_oSpriteLibrary.addSprite("symbol_3","./sprites/symbol_3.png");
        s_oSpriteLibrary.addSprite("symbol_4","./sprites/symbol_4.png");
        s_oSpriteLibrary.addSprite("symbol_5","./sprites/symbol_5.png");
        s_oSpriteLibrary.addSprite("symbol_6","./sprites/symbol_6.png");
        s_oSpriteLibrary.addSprite("symbol_7","./sprites/symbol_7.png");
        s_oSpriteLibrary.addSprite("symbol_8","./sprites/symbol_8.png");  
        s_oSpriteLibrary.addSprite("symbol_9","./sprites/symbol_9.png");
        
        s_oSpriteLibrary.addSprite("particle_effect_0","./sprites/particle_effect_0.png");
        s_oSpriteLibrary.addSprite("particle_effect_1","./sprites/particle_effect_1.png");
        s_oSpriteLibrary.addSprite("particle_effect_2","./sprites/particle_effect_2.png");
        s_oSpriteLibrary.addSprite("particle_effect_3","./sprites/particle_effect_3.png");
        s_oSpriteLibrary.addSprite("avatar_idle","./sprites/avatar/avatar_idle.png");
        s_oSpriteLibrary.addSprite("bet_but","./sprites/paylines/bet_but.png");
        s_oSpriteLibrary.addSprite("paylines","./sprites/paylines/paylines.png");
        s_oSpriteLibrary.addSprite("avatar_win","./sprites/avatar/avatar_win.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_no","./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_delete_savings","./sprites/but_delete_savings.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onRemovePreloader = function(){
        APIgetSlotInfos(this.settingPhase,this);
    };
    

    this.settingPhase = function( oInfos){
        try{
            saveItem(LOCALSTORAGE_STRING+"ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
        
        s_oGameSettings = new CSlotSettings();
        s_oMsgBox = new CMsgBox();
        
        _oPreloader.unload();
        
 
        COIN_BET = oInfos.bets;
        START_BET = oInfos.start_bet;
        MIN_BET  = oInfos.bets[0];
        MIN_REEL_LOOPS = _oData.min_reel_loop;
        REEL_DELAY = _oData.reel_delay;
        TIME_SHOW_WIN = _oData.time_show_win;
        TIME_SHOW_ALL_WINS = _oData.time_show_all_wins;
        TOTAL_MONEY = oInfos.start_money;  
        ENABLE_FULLSCREEN = oData.fullscreen;
        SHOW_CREDITS = oData.show_credits;
        ENABLE_CHECK_ORIENTATION = oData.check_orientation;
        PAYTABLE_VALUES = oInfos.paytable;

        playSound("soundtrack",1,true);
        this.gotoMenu();
    };
    /*
    this.setInterfaceValues = function(iEntries,iWinnings,iWin){
        if(s_oGame !== null){
            s_oGame.setCredits(iEntries,iWinnings,iWin);
        }
    };*/
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame(_oData);   
							
        _iState = STATE_GAME;
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this.stopUpdateNoBlock = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
    };

    this.startUpdateNoBlock = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false; 
    };

    
    this.refreshCredits = function(){
        if( _oGame ){
            _oGame.refreshCredits();
        }
    };    
  
    
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
                
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);
    };
    
    s_oMain = this;
    _oData = oData;
    ENABLE_CHECK_ORIENTATION = _oData.check_orientation;
    NUM_SPIN_FOR_ADS = oData.num_spin_for_ads;
    RESTART_CREDIT = oData.restart_credit;
    s_bAudioActive = oData.audio_enable_on_startup;

    this.initContainer();
}

var s_bMobile;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oAttachSection;
var s_oMain;
var s_oSpriteLibrary;
var s_oMsgBox;
var s_oGameSettings;
var s_aSounds;
var s_aSoundsInfo;
var s_bStorageAvailable = true;