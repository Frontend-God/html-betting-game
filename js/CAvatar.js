function CAvatar(oParentContainer){
    var _pStartPosAvatar;
    
    var _oSpriteIdle;
    var _oSpriteWin;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(){
        _pStartPosAvatar = {x:-100,y:CANVAS_HEIGHT-40};
        
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPosAvatar.x;
        _oContainer.y = _pStartPosAvatar.y;
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
        _oSpriteIdle = new createjs.Sprite(oSpriteSheet,"anim");
        _oContainer.addChild(_oSpriteIdle);
        
        
        
         var oData = {   
                        images: [
                                        s_oSpriteLibrary.getSprite("avatar_win")
                                    ],

                       framerate: 25,
                        "frames": [
                                        [1, 16, 350, 300, 0, 190, 228],
                                        [441, 16, 350, 300, 0, 190, 228],
                                        [883, 16, 350, 300, 0, 190, 228],
                                        [1334, 16, 350, 300, 0, 190, 228],
                                        [1782, 16, 350, 300, 0, 190, 228],
                                        [2230, 16, 350, 300, 0, 190, 228],
                                        [1, 271, 350, 300, 0, 190, 228],
                                        [441, 271, 350, 300, 0, 190, 228],
                                        [883, 271, 350, 300, 0, 190, 228],
                                        [1334, 271, 350, 300, 0, 190, 228],
                                        [1782, 271, 350, 300, 0, 190, 228],
                                        [1, 605, 350, 250, 0, 190, 228],
                                        [441, 605, 350, 250, 0, 190, 228],
                                        [883, 605, 350, 250, 0, 190, 228],
                                        [1334, 605, 350, 250, 0, 190, 228],
                                        [1782, 605, 350, 250, 0, 190, 228],
                                        [2230, 605, 350, 250, 0, 190, 228],
                                ],

                                "animations": {
                                    "anim": { "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
                                },
        };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpriteWin = new createjs.Sprite(oSpriteSheet, "start");
        _oSpriteWin.on("animationend",this._onAnimationEnd,this);
        _oSpriteWin.visible = false;
        _oContainer.addChild(_oSpriteWin);

        
        this.refreshButtonPos();
    };
    
    this._hideAllAnims = function(){
        _oSpriteIdle.visible = false;
        _oSpriteWin.visible = false;
    };
    
    this.refreshButtonPos = function(){

        _oContainer.x = _pStartPosAvatar.x + s_iOffsetX;
        if(_oContainer.x > 200){
            _oContainer.x = 200;
        }else if(_oContainer.x < 180){
            _oContainer.x = 180;
        }

    };
    
    this.show = function(iAnim){
        switch(iAnim){
            case 0:{
                    _oSpriteIdle.visible = true;
                    _oSpriteWin.visible = false;
                    _oSpriteWin.gotoAndStop("start");
                    _oSpriteIdle.gotoAndPlay("anim");
                    break;
            }
            case 1:{
                    _oSpriteIdle.visible = false;
                    _oSpriteWin.visible = true;
                    _oSpriteWin.gotoAndPlay("anim");
                    break;
            }
        }
        
    };
    
    this._onAnimationEnd = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            this.show(0);
        }
    };
    
    _oParentContainer = oParentContainer;
    
    this._init();
}