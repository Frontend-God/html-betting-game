function CBonusCharacter(iX,iY,oParentContainer){
    var _iFinalX;
    var _pStartPos;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oAnimIdle;
    var _oAnimStrafeIn;
    var _oAnimStrafeOut;
    var _oContainer;
    var _oParentContainer = oParentContainer;

    
    this._init = function(iX,iY){
        _iFinalX = iX;
        _pStartPos = {x:iX,y:iY};
        _aCbCompleted = new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.scaleX = _oContainer.scaleY = 0.9;
        _oParentContainer.addChild(_oContainer);
        
        var oData = {   
                        images: [
                                        s_oSpriteLibrary.getSprite("avatar_idle")
                                    ],

                        framerate: 6,
                        "frames": [
                                        [1, 1, 280, 228, 0, 131, 228],
                                        [285, 1, 280, 228, 0, 131, 228],
                                        [569, 1, 280, 228, 0, 131, 228],
                                        [1137, 1, 280, 228, 0, 131, 228],
                                        [1421, 1, 280, 228, 0, 131, 228],
                                        [1705, 1, 280, 228, 0, 131, 228],
                                        [1, 1, 280, 228, 0, 131, 228],
                                        [285, 1, 280, 228, 0, 131, 228],
                                        [569, 1, 280, 228, 0, 131, 228],
                                        [1137, 1, 280, 228, 0, 131, 228],
                                        [1421, 1, 280, 228, 0, 131, 228],
                                        [1705, 1, 280, 228, 0, 131, 228],
                                        [1, 1, 280, 228, 0, 131, 228],
                                        [285, 1, 280, 228, 0, 131, 228],
                                        [569, 1, 280, 228, 0, 131, 228],
                                        [1137, 1, 280, 228, 0, 131, 228],
                                        [1421, 1, 280, 228, 0, 131, 228],
                                        [1705, 1, 280, 228, 0, 131, 228],
                                ],

                                "animations": {
                                    "anim": { "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] }
                                },
        };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oAnimIdle = new createjs.Sprite(oSpriteSheet,"anim");
        _oContainer.addChild(_oAnimIdle);
        
        
        var oData = {   
                        images: [
                                        s_oSpriteLibrary.getSprite("avatar_strafe_in")
                                    ],

                        framerate: 25,
                        "frames": [
                                        [1, 16, 360, 300, 0, 190, 228],
                                        [441, 16, 360, 300, 0, 190, 228],
                                        [883, 16, 360, 300, 0, 190, 228],
                                        [1334, 16, 360, 300, 0, 190, 228],
                                        [1782, 16, 360, 300, 0, 190, 228],
                                        [2230, 16, 360, 300, 0, 190, 228],
                                        [1, 271, 360, 300, 0, 190, 228],
                                        [441, 271, 360, 300, 0, 190, 228],
                                        [883, 271, 360, 300, 0, 190, 228],
                                        [1334, 271, 360, 300, 0, 190, 228],
                                        [1782, 271, 360, 300, 0, 190, 228],
                                        [1, 605, 360, 250, 0, 190, 228],
                                        [441, 605, 360, 250, 0, 190, 228],
                                        [883, 605, 360, 250, 0, 190, 228],
                                        [1334, 605, 360, 250, 0, 190, 228],
                                        [1782, 605, 360, 250, 0, 190, 228],
                                        [2230, 605, 360, 250, 0, 190, 228],
                                ],

                                animations: {start:0,anim:[0,2,"start_cut"],start_cut:[2,5,"end_cut"],end_cut:[5,13,"stop_cut"],stop_cut:13}
        };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oAnimStrafeIn = new createjs.Sprite(oSpriteSheet, "start");
        _oAnimStrafeIn.visible = false;
        _oContainer.addChild(_oAnimStrafeIn);
        _oAnimStrafeIn.on("animationend",this._onEndAnimStrafeIn,this);
        
        
        
        
        var oData = {   
                        images: [
                                        s_oSpriteLibrary.getSprite("avatar_strafe_out")
                                    ],

                        framerate: 20,
                        "frames": [
                                        [],
                                        [1, 16, 360, 300, 0, 190, 228],
                                        [441, 16, 360, 300, 0, 190, 228],
                                        [883, 16, 360, 300, 0, 190, 228],
                                        [1334, 16, 360, 300, 0, 190, 228],
                                        [1782, 16, 360, 300, 0, 190, 228],
                                        [2230, 16, 360, 300, 0, 190, 228],
                                        [1, 271, 360, 300, 0, 190, 228],
                                        [441, 271, 360, 300, 0, 190, 228],
                                        [883, 271, 360, 300, 0, 190, 228],
                                        [1334, 271, 360, 300, 0, 190, 228],
                                        [1782, 271, 360, 300, 0, 190, 228],
                                ],

                                animations: {start:0,anim:[1,9,"move"],move:[10,11,"stop_move"],stop_move:11}
        };

                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oAnimStrafeOut = new createjs.Sprite(oSpriteSheet, "start");
        //_oAnimStrafeOut.visible = false;
        _oContainer.addChild(_oAnimStrafeOut);
        _oAnimStrafeOut.on("animationend",this._onEndAnimStrafeOut,this);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.hide = function(){
        _oAnimIdle.visible = false;
        _oAnimStrafeIn.visible = false;
        _oAnimStrafeIn.gotoAndStop("start");
        _oAnimIdle.gotoAndStop("start");
    };

    this.reset = function(){
        _iFinalX = _pStartPos.x;
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
    };
     
    this.idle = function(){
        _oAnimIdle.visible = true;
        _oAnimStrafeIn.visible = false;
        _oAnimStrafeIn.gotoAndStop("start");
        _oAnimIdle.gotoAndPlay("anim");
    };
    
    this.startMoving = function(iFinalX){
        _iFinalX = iFinalX;
        _oAnimIdle.gotoAndStop("start");
        _oAnimIdle.visible = false;
        
        _oAnimStrafeOut.visible = true;
        _oAnimStrafeOut.gotoAndPlay("anim");
    };
    
    this.cutFruit = function(){
        playSound("avatar_cut",1,false);
        
        _oAnimIdle.gotoAndStop("start");
        _oAnimIdle.visible = false;
        _oAnimStrafeIn.visible = true;
        _oAnimStrafeIn.gotoAndPlay("start_cut");
        
    };
    
    this._onEndAnimStrafeIn = function(evt){
        if(evt.name === "start_cut"){
            //CUT THE FRUIT
            s_oBonusPanel.cutTheFruit();
        }else if(evt.name === "stop_cut"){
            _oAnimStrafeIn.visible = false;
            _oAnimIdle.visible = true;
            _oAnimIdle.gotoAndPlay("anim");
        }
    };

    this._onEndAnimStrafeOut = function(evt){
        if(evt.name === "anim"){
            //START MOVING CHARACTER
            playSound("swoosh",1,false);
            createjs.Tween.get(_oContainer).to({x:_oContainer.x + 70}, 400, createjs.Ease.linear).call(function(){
                                                                                                                    _oAnimStrafeOut.visible = false;
                                                                                                                    _oContainer.x = _iFinalX;
                                                                                                                    _oAnimStrafeIn.visible = true;
                                                                                                                    _oAnimStrafeIn.gotoAndPlay("anim");
                                                                                                                    
                                                                                                                    playSound("avatar_cut",1,false);
                                                                                                                });
            
        }
    };
    
    this.getCurX = function(){
        return _iFinalX;
    };
    
    this._init(iX,iY);
}