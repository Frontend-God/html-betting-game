var TOTAL_MONEY = START_MONEY = 100;
var WIN_OCCURRENCE = 30;         //WIN PERCENTAGE. SET A VALUE FROM 0 TO 100.
var FREESPIN_OCCURRENCE = 10;    //FREESPIN OCCURRENCE IF THERE IS A WINNING COMBO
var BONUS_OCCURRENCE = 10;       //BONUS OCCURRENCE IF THERE IS A WINNING COMBO
var SLOT_CASH = 100;             //THIS IS THE CURRENT SLOT CASH AMOUNT. THE GAME CHECKS IF THERE IS AVAILABLE CASH FOR WINNINGS.

var NUM_FREESPIN = [3,4,5];     //THIS IS THE NUMBER OF FREESPINS IF IN THE FINAL WHEEL THERE ARE 3,4 OR 5 FREESPIN SYMBOLS
var BONUS_PRIZE = [10,30,60,90,100]; //THIS IS THE LIST OF BONUS MULTIPLIERS.
var BONUS_PRIZE_OCCURRENCE = [40,25,20,10,5];
var MAX_PRIZES_BONUS = 5;     //MAX NUMBR OF PRIZES ASSIGNED IN BONUS GAME

var COIN_BET = [0.05, 0.1,0.15,0.20,0.25,0.3,0.35,0.4,0.45,0.5]; //COIN BET VALUES

/***********PAYTABLE********************/
//EACH SYMBOL PAYTABLE HAS 5 VALUES THAT INDICATES THE MULTIPLIER FOR X1,X2,X3,X4 OR X5 COMBOS
var PAYTABLE_VALUES = [ [0,0,5,20,100],    //PAYTABLE FOR SYMBOL 0
                        [0,0,5,20,100], //PAYTABLE FOR SYMBOL 1
                        [0,0,5,20,100], //PAYTABLE FOR SYMBOL 2
                        [0,0,10,30,150],  //PAYTABLE FOR SYMBOL 3
                        [0,0,20,50,200],   //PAYTABLE FOR SYMBOL 4
                        [0,0,25,70,300],   //PAYTABLE FOR SYMBOL 5
                        [0,0,25,100,500]   //PAYTABLE FOR SYMBOL 6
                        
                    ];

/*************************************/
var _bBonus = false;
var _bFreespinEnable = false;
var _iMinWin;
var _iTotFreeSpin = 0;
var _iNumSymbolFreeSpin = 0;
var _aCbCompleted = new Array();
var _aCbOwner = new Array();
var _aSymbolWin = new Array();
var _iFreespinSymbolNumOccur = [50,30,20];//WHEN PLAYER GET FREESPIN, THIS ARRAY GET THE OCCURRENCE OF RECEIVING 3,4 OR 5 FREESPIN SYMBOLS IN THE WHEEL
var _aPaylineCombo = new Array();
var _aFinalSymbols;

    
function APIgetSlotInfos(oCallback, oCallbackOwner){
    
    oCallback.call(oCallbackOwner,{start_money:TOTAL_MONEY,bets:COIN_BET,start_bet:COIN_BET[0],paytable:PAYTABLE_VALUES});
    
}

function APIAttemptSpin(iCurBet, iCoin,iNumBettingLines,oCallback, oCallbackOwner){
    //CHECK IF iCurBet IS < DI iMoney OR THERE IS AN INVALID BET
    if(iCurBet > TOTAL_MONEY){
        _dieError("INVALID BET: "+iCurBet+",money:"+TOTAL_MONEY,oCallback, oCallbackOwner);
        return;
    }
    

    //DECREASING USER MONEY WITH THE CURRENT BET
    TOTAL_MONEY -= iCurBet;
    SLOT_CASH += iCurBet;
    
    TOTAL_MONEY = parseFloat(TOTAL_MONEY.toFixed(2));
    SLOT_CASH = parseFloat(SLOT_CASH.toFixed(2));
    
    _bBonus = false;

    var bFreespin = false;
    var oData;
    
    //IF SLOT CASH IS LOWER THAN MINIMUM WIN, PLAYER MUST LOSE
    if(SLOT_CASH < _iMinWin*iCoin){

        //PLAYER MUST LOSE
        generLosingPattern();
        if(_bFreespinEnable === true){
            _iTotFreeSpin--;

            if(_iTotFreeSpin < 0){
                    _iTotFreeSpin = 0;
                    _bFreespinEnable = false;
            }
        }
        
        
        
        oData = {res:true,win:false,pattern:_aFinalSymbols,win_lines:{},money:TOTAL_MONEY,tot_win:0,freespin:false,
                                            num_freespin:_iTotFreeSpin,bonus:false,bonus_prize:-1,cash:SLOT_CASH};
                        
        oCallback.call(oCallbackOwner,oData);
        return;
    }
            
    var iRandOccur = Math.floor(Math.random()*100);
    var iRand;
    if(iRandOccur < WIN_OCCURRENCE){
            //WIN
            if(_bFreespinEnable === false && _bBonus === false){
                    iRand = Math.floor(Math.random()*100);
                    if(_iTotFreeSpin === 0 && iRand < (FREESPIN_OCCURRENCE+BONUS_OCCURRENCE)){
                            //PLAYER GET BONUS OR FREESPIN
                            iRand = Math.floor(Math.random()*(FREESPIN_OCCURRENCE+BONUS_OCCURRENCE)+1);
                            
                            if(iRand <= FREESPIN_OCCURRENCE){
                                    bFreespin = true;
                            }else if(SLOT_CASH >= (BONUS_PRIZE[0] * iCoin)){
                                    _bBonus = true;
                            }else{
                                    //NOT ENOUGH MONEY FOR ANY BONUS PRIZE
                                    _bBonus = false;
                            }

                    }
            }

            var iPrizeReceived = -1;
            var iBonusWin = 0;
            var iCont = 0;
            do{
                generateRandomSymbols(bFreespin);
                var aRet = checkWin(bFreespin,iNumBettingLines);
                var iTotWin = 0;
                for(var i=0;i<aRet.length;i++){
                        iTotWin += aRet[i]['amount'];
                }
                iTotWin *= iCoin;

               
                iCont++;
            }while(aRet.length === 0 || (iBonusWin+iTotWin) > SLOT_CASH || (iBonusWin+iTotWin) < iCurBet);
            
            
            TOTAL_MONEY +=  (iTotWin + iBonusWin); 
            SLOT_CASH -=  (iTotWin + iBonusWin);
            
            TOTAL_MONEY = parseFloat(TOTAL_MONEY.toFixed(2));
            SLOT_CASH = parseFloat(SLOT_CASH.toFixed(2));
    
            //DECREASE FREESPIN NUMBER EVENTUALLY
            if(bFreespin && _iNumSymbolFreeSpin > 2){
                    _bFreespinEnable = true;
                    _iTotFreeSpin = NUM_FREESPIN[_iNumSymbolFreeSpin-3];

            }else if(_bFreespinEnable === true){
                    _iTotFreeSpin--;

                    if(_iTotFreeSpin < 0){
                            _iTotFreeSpin = 0;
                            _bFreespinEnable = false;
                    }
            }
            
            
           
            
            oData =  {res:true,win:true,pattern:_aFinalSymbols,win_lines:aRet,money:TOTAL_MONEY,tot_win:iTotWin,freespin:bFreespin,
                        num_freespin:_iTotFreeSpin,bonus:_bBonus,bonus_prize:iPrizeReceived,cash:SLOT_CASH };
            
            oCallback.call(oCallbackOwner,oData);
            return;
    }else{
            //LOSE
            generLosingPattern();
            if(_bFreespinEnable === true){
                _iTotFreeSpin--;

                if(_iTotFreeSpin < 0){
                        _iTotFreeSpin = 0;
                        _bFreespinEnable = false;
                }
            }
            
            
           
            oData = {res:true,win:false,pattern:_aFinalSymbols,win_lines:{},money:TOTAL_MONEY,tot_win:0,freespin:false,num_freespin:_iTotFreeSpin,
                        bonus:false,bonus_prize:-1};
            oCallback.call(oCallbackOwner,oData);
            return;
    }
}

function apiAttemptBonus(iCoin,oCallback, oCallbackOwner){
    var aPrizeLength = new Array();
    for(var k=0; k<BONUS_PRIZE_OCCURRENCE.length; k++){
            var iCount = BONUS_PRIZE_OCCURRENCE[k];
            for(var j=0;j<iCount;j++){
                    aPrizeLength.push(k);
            }
    }

                    
    var iRandNumMultipliers = Math.floor(Math.random() * MAX_PRIZES_BONUS) + 1;
    var aPrizeList = new Array();
    var iTotWin = 0;
    for(var k=0;k<iRandNumMultipliers;k++){
        
        var iRandIndex = Math.floor(Math.random()*(aPrizeLength.length));
        var iPrizeReceived = aPrizeLength[iRandIndex];
        var iBonusWin = (BONUS_PRIZE[iPrizeReceived]*iCoin);
        
        

        if(iTotWin+iBonusWin > SLOT_CASH){
            iBonusWin = 0;
        }
        
        iTotWin += iBonusWin;
        aPrizeList.push(iBonusWin);
        
        TOTAL_MONEY += iBonusWin; 
        SLOT_CASH -= iBonusWin;
        
        TOTAL_MONEY = parseFloat(TOTAL_MONEY.toFixed(2));
        SLOT_CASH = parseFloat(SLOT_CASH.toFixed(2));
    }
           
    if(aPrizeList.length === 0){
        aPrizeList = [0];
    }

    var oData = {res:true,money:TOTAL_MONEY,bonus_win:iTotWin,prize_list:aPrizeList};                
    oCallback.call(oCallbackOwner,oData);
}

function checkWin(bFreespin,iNumBettingLines){

    //trace(_aFinalSymbols)
    //CHECK IF THERE IS ANY COMBO
    var _aWinningLine = new Array();
  
    for(var k=0;k<iNumBettingLines;k++){
        var aCombos = _aPaylineCombo[k];

        var aCellList = new Array();
        var iValue = _aFinalSymbols[aCombos[0]['row']][aCombos[0]['col']];

        var iNumEqualSymbol = 1;
        var iStartIndex = 1;

        aCellList.push({row:aCombos[0]['row'],col:aCombos[0]['col'],value:_aFinalSymbols[aCombos[0]['row']][aCombos[0]['col']]} );

        while(iValue === WILD_SYMBOL && iStartIndex<NUM_REELS){
            iNumEqualSymbol++;
            iValue = _aFinalSymbols[aCombos[iStartIndex]['row']][aCombos[iStartIndex]['col']];

            aCellList.push( {row: aCombos[iStartIndex]['row'] ,col:aCombos[iStartIndex]['col'] ,value:_aFinalSymbols[aCombos[iStartIndex]['row']][aCombos[iStartIndex]['col']]} );                                                    
            iStartIndex++;
        }

        for(var t=iStartIndex;t<aCombos.length;t++){
            if(_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === iValue || 
                                        _aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === WILD_SYMBOL){
                iNumEqualSymbol++;


                aCellList.push({row:aCombos[t]['row'],col:aCombos[t]['col'],value:_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']]} );
            }else{
                break;
            }
        }
        
        
        if(_aSymbolWin[iValue][iNumEqualSymbol-1] > 0 && !(bFreespin && iValue === FREESPIN_SYMBOL) && !(_bBonus && iValue === BONUS_SYMBOL) ){
            aCellList.sort(sortListByCol);
            _aWinningLine.push({line:k+1,amount:_aSymbolWin[iValue][iNumEqualSymbol-1],num_win:iNumEqualSymbol,value:iValue,list:aCellList});
        }
    }

    if(bFreespin){
        aCellList = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                if(_aFinalSymbols[i][j] === FREESPIN_SYMBOL){
                    aCellList.push({row:i,col:j,value:FREESPIN_SYMBOL});
                }
            }
        }

        aCellList.sort(sortListByCol);
        _aWinningLine.push({line:0,amount:0,num_win:aCellList.length,value:FREESPIN_SYMBOL,list:aCellList});

    }else if(_bBonus){
        var aCellList = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            for(j=0;j<NUM_REELS;j++){
                if(_aFinalSymbols[i][j] === BONUS_SYMBOL){
                    aCellList.push({row:i,col:j,value:BONUS_SYMBOL});
                }
            }
        }

        aCellList.sort(sortListByCol);
        _aWinningLine.push({line:0,amount:0,num_win:aCellList.length,value:BONUS_SYMBOL,list:aCellList});
    }


    return _aWinningLine;
}
    
function generateRandomSymbols(bFreespin){
    _aFinalSymbols = new Array();
    for(var i=0;i<NUM_ROWS;i++){
        _aFinalSymbols[i] = new Array();
        for(var j=0;j<NUM_REELS;j++){
            do{
                var iRandIndex = Math.floor(Math.random()*s_aRandSymbols.length);
                var iRandSymbol = s_aRandSymbols[iRandIndex];
                _aFinalSymbols[i][j] = iRandSymbol;
            }while(iRandSymbol === BONUS_SYMBOL || iRandSymbol === FREESPIN_SYMBOL);
        }
    }

    if(bFreespin){
        //DECIDE HOW NAMY FREESPIN SYMBOL MUST APPEAR( MINIMUM 3, MAX 5)
        var aTmp = new Array();
        for(i=0;i<_iFreespinSymbolNumOccur.length;i++){
            for(j=0;j<_iFreespinSymbolNumOccur[i];j++){
                aTmp.push(i);
            }
        }

        var iRand =  Math.floor(Math.random()*aTmp.length);
        _iNumSymbolFreeSpin = 3 + aTmp[iRand];

        var aCurReel = [0,1,2,3,4];
        aCurReel = shuffle ( aCurReel );
        for(var k=0;k<_iNumSymbolFreeSpin;k++){
            var iRandRow = Math.floor(Math.random()*3);
            _aFinalSymbols[iRandRow][aCurReel[k]] = FREESPIN_SYMBOL;
        }
    }else if(_bBonus){
        //DECIDE WHERE BONUS SYMBOL MUST APPEAR.          
        aCurReel = [0,1,2,3,4];
        aCurReel = shuffle ( aCurReel );
        var iNumBonusSymbol = Math.floor(Math.random()*3+3);
        for(var k=0;k<iNumBonusSymbol;k++){
            iRandRow = Math.floor(Math.random()*3);
            _aFinalSymbols[iRandRow][aCurReel[k]] = BONUS_SYMBOL;
        }
    }
}

function generLosingPattern(){
    var aFirstCol = new Array();
    for(var i=0;i<NUM_ROWS;i++){
        do{
            var iRandIndex = Math.floor(Math.random()*(s_aRandSymbols.length)); 
        }while(s_aRandSymbols[iRandIndex] === BONUS_SYMBOL || s_aRandSymbols[iRandIndex] === FREESPIN_SYMBOL || s_aRandSymbols[iRandIndex] === WILD_SYMBOL);
        
        var iRandSymbol = s_aRandSymbols[iRandIndex];
        aFirstCol[i] = iRandSymbol;  
    }
    
    _aFinalSymbols = new Array();
    for(var i=0;i<NUM_ROWS;i++){
        _aFinalSymbols[i] = new Array();
        for(var j=0;j<NUM_REELS;j++){
            if(j == 0){
                _aFinalSymbols[i][j] = aFirstCol[i];
            }else{
                do{
                    iRandIndex =  Math.floor(Math.random()*s_aRandSymbols.length);
                    iRandSymbol = s_aRandSymbols[iRandIndex];
                }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol ||
                        iRandSymbol === BONUS_SYMBOL || iRandSymbol === FREESPIN_SYMBOL || iRandSymbol === WILD_SYMBOL);

                _aFinalSymbols[i][j] = iRandSymbol;			
            }  
        }
    }
    
    return _aFinalSymbols;
};

function refreshCredit(iCredit,oCallback, oCallbackOwner){
    TOTAL_MONEY = iCredit;
    oCallback.call(oCallbackOwner,TOTAL_MONEY);
};

function formatEntries(iValue){
    return iValue.toFixed(2);
}

function _dieError( szReason,oCallback, oCallbackOwner){
    var oData = "res=false&desc="+szReason;
    oCallback.call(oCallbackOwner,oData);
}	

function sortListByCol(a,b) {
        if (a.col < b.col)
           return -1;
        if (a.col > b.col)
          return 1;
        return 0;
    };

//THIS FUNCTION INIT WIN FOR EACH SYMBOL COMBO
//EXAMPLE: _aSymbolWin[0] = array(0,0,20,25,30) MEANS THAT
//CHERRY SYMBOL GIVES THE FOLLOWING PRIZE FOR:
//COMBO 1 : 0$
//COMBO 2 : 0$
//COMBO 3 : 20$
//COMBO 4 : 25$
//COMBO 5 : 30$
function _initSymbolWin(){
    _aSymbolWin = new Array();
    for(var i=0;i<PAYTABLE_VALUES.length;i++){
        _aSymbolWin[i] = new Array();
        for(var j=0;j<PAYTABLE_VALUES[i].length;j++){
             _aSymbolWin[i][j] = PAYTABLE_VALUES[i][j];
        }
    }

    for(var k=PAYTABLE_VALUES.length;k<NUM_SYMBOLS;k++){
        _aSymbolWin[k] = [0,0,0,0,0];
    }
};

function _setMinWin(){
    
    //FIND MIN WIN
    _iMinWin = 9999999999999;
    for(var i=0;i<_aSymbolWin.length;i++){
        var aTmp = _aSymbolWin[i];
       
        for(var j=0;j<aTmp.length;j++){
            if(aTmp[j] !== 0 && aTmp[j] < _iMinWin){
                _iMinWin = aTmp[j];
            }
        }
    }
}

function _initPaylines(){
    //STORE ALL INFO ABOUT PAYLINE COMBOS

    _aPaylineCombo[0] = [{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[1] = [{row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[2] = [{row:2,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[3] = [{row:0,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[4] = [{row:2,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[5] = [{row:1,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[6] = [{row:1,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:1,col:4}];
    _aPaylineCombo[7] = [{row:0,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[8] = [{row:2,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:0,col:4}]; 
    _aPaylineCombo[9] = [{row:1,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[10] = [{row:1,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:1,col:4}];
    _aPaylineCombo[11] = [{row:0,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[12] = [{row:2,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[13] = [{row:0,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:0,col:4}]; 
    _aPaylineCombo[14] = [{row:2,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[15] = [{row:1,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[16] = [{row:1,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[17] = [{row:0,col:0},{row:0,col:1},{row:2,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[18] = [{row:2,col:0},{row:2,col:1},{row:0,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[19] = [{row:0,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:0,col:4}];
    
    return _aPaylineCombo;
};

function _init(){
    _initSymbolWin();

    _aPaylineCombo = _initPaylines();
    _setMinWin();
}

_init();