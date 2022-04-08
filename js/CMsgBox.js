function CMsgBox(){
    var _oListenerBlock;
    var _oBlock;
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
    var _oButExit;
    var _oGroup;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.visible = false;
        s_oStage.addChild(_oGroup);
        
        _oBlock = new createjs.Shape();
        _oBlock.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListenerBlock = _oBlock.on("click",function(){});
        _oGroup.addChild(_oBlock);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oGroup.addChild(_oBg);

        _oMsgTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-179, (CANVAS_HEIGHT/2)-48, 360, 90, 
                    30, "center", "#000", FONT_GAME_1, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
       


        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-180, (CANVAS_HEIGHT/2)-48, 360, 90, 
                    30, "center", "#fff", FONT_GAME_1, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

                                                      
        _oButExit = new CGfxButton((CANVAS_WIDTH/2) + 160,CANVAS_HEIGHT/2 - 70,s_oSpriteLibrary.getSprite('but_exit_info'),_oGroup);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this); 
    };
    
    this.unload = function(){
        _oBlock.off("click",_oListenerBlock);
        _oButExit.unload();
    };
    
    this.show = function(szMsg){
        _oMsgTextBack.refreshText(szMsg);
        _oMsgText.refreshText(szMsg);
        _oGroup.visible = true;
    };
    
    this.hide = function(){
        _oGroup.visible = false;
    };
    
    this._onExit = function(){
        this.hide();
    };
    
    this._init();
    
    return this;
}