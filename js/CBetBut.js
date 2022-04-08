function CBetBut(iXPos,iYPos,szLabel,szText,szFont,szColor,iFontSize,oParentContainer){
    var _bDisable;
    var _szLabel = szLabel;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];

    var _oButton;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iXPos,iYPos,szLabel){
        _bDisable = false;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);
               
        var oData = {   // image to use
                        images: [s_oSpriteLibrary.getSprite("bet_but")], 
                        // width, height & registration point of each sprite
                        frames: {width: 34, height: 29}, 
                        animations: {  bet_but1_on: 0,bet_but1_off:1,
                                       bet_but2_on: 2,bet_but2_off:3,
                                       bet_but3_on: 4,bet_but3_off:5,
                                       bet_but4_on: 6,bet_but4_off:7,
                                       bet_but5_on: 8,bet_but5_off:9,
                                       bet_but6_on: 10,bet_but6_off:11,
                                       bet_but7_on: 12,bet_but7_off:13,
                                       bet_but8_on: 14,bet_but8_off:15,
                                       bet_but9_on: 16,bet_but9_off:17,
                                       bet_but10_on: 18,bet_but10_off:19,
                                       bet_but11_on: 20,bet_but11_off:21,
                                       bet_but12_on: 22,bet_but12_off:23,
                                       bet_but13_on: 24,bet_but13_off:25,
                                       bet_but14_on: 26,bet_but14_off:27,
                                       bet_but15_on: 28,bet_but15_off:29,
                                       bet_but16_on: 30,bet_but16_off:31,
                                       bet_but17_on: 32,bet_but17_off:33,
                                       bet_but18_on: 34,bet_but18_off:35,
                                       bet_but19_on: 36,bet_but19_off:37,
                                       bet_but20_on: 38,bet_but20_off:39
            
            
                                    }
       };
       
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oButton = createSprite(oSpriteSheet, szLabel+"_on",0,0,34,29);         
        _oButton.stop();
        _oButton.cursor = "pointer";
        _oContainer.addChild(_oButton);

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease); 
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.disable = function(bDisable){
        _bDisable = bDisable;
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setOn = function(){
        _oButton.gotoAndStop(_szLabel+"_on");
    };
    
    this.setOff = function(){
        _oButton.gotoAndStop(_szLabel+"_off");
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_aCbCompleted[ON_MOUSE_UP] && _bDisable === false){
            playSound("press_but",1,false);
            
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
       if(_aCbCompleted[ON_MOUSE_DOWN] && _bDisable === false){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
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
    
    _oParentContainer = oParentContainer;
    this._init(iXPos,iYPos,szLabel,szText,szFont,szColor,iFontSize);
}