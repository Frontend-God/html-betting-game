function CSlotSettings(){
    
    this._init = function(){
        this._initSymbolSpriteSheets();
        this._initSymbolsOccurence();
        this._initSymbolSplashEffect();
    };
    
    this._initSymbolSpriteSheets = function(){
        s_aSymbolData = new Array();
        for(var i=0;i<NUM_SYMBOLS;i++){
            var oData = {   // image to use
                            images: [s_oSpriteLibrary.getSprite('symbol_'+i)], 
                            // width, height & registration point of each sprite
                            frames: {width: SYMBOL_WIDTH, height: SYMBOL_HEIGHT, regX: SYMBOL_WIDTH/2, regY: SYMBOL_HEIGHT/2}, 
                            animations: {  static: 0,slice_left:1,slice_right:2,moving:3 }
            };

            s_aSymbolData[i] = new createjs.SpriteSheet(oData);
        }  
    };

    this._initSymbolsOccurence = function(){
        s_aRandSymbols = new Array();
        
        var i;
        
        for(i=0;i<1;i++){
            s_aRandSymbols.push(9);
        }
        
        for(i=0;i<2;i++){
            s_aRandSymbols.push(8);
        }
        
        for(i=0;i<3;i++){
            s_aRandSymbols.push(7);
        }
        
        
        for(i=0;i<4;i++){
            s_aRandSymbols.push(6);
        }
        
        
        for(i=0;i<5;i++){
            s_aRandSymbols.push(5);
        }
        
        for(i=0;i<6;i++){
            s_aRandSymbols.push(4);
        }
        
        
        for(i=0;i<7;i++){
            s_aRandSymbols.push(3);
        }
        
        
        for(i=0;i<8;i++){
            s_aRandSymbols.push(2);
            s_aRandSymbols.push(1);
            s_aRandSymbols.push(0);
        }
        
    
        
        
    };
    
    this._initSymbolSplashEffect = function(){
        s_aSymbolSplashId = new Array();
        s_aSymbolSplashId[0] = 0;
        s_aSymbolSplashId[1] = 0;
        s_aSymbolSplashId[2] = 1;
        s_aSymbolSplashId[3] = 0;
        s_aSymbolSplashId[4] = 2;
        s_aSymbolSplashId[5] = 0;
        s_aSymbolSplashId[6] = 1;
        s_aSymbolSplashId[7] = 3;
        s_aSymbolSplashId[8] = 3;
        s_aSymbolSplashId[9] = 3;
    };

    this._init();
}

var s_aSymbolData;
var s_aRandSymbols;
var s_aSymbolSplashId;