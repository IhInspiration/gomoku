/**
 * Created by lenovo on 2016/8/3.
 * @author jackwang <wdmzjjm@163.com>
 * @blog http://www.notalent.cn
 */

var chessBoard = [];  //棋子状态
var me = true;         //判断黑白棋
var over = false;      //棋是否结束

//赢法数组
var wins = [];

//赢法统计数组
var myWin = [];
var computerWin = [];

//棋子状态初始化
for(var i = 0; i < 15; i++){
    chessBoard[i] = [];
    for(var j = 0; j < 15; j++){
        chessBoard[i][j] = 0;
    }
}

//赢法数组初始化
for(var i = 0; i < 15; i++){
    wins[i] = [];
    for(var j = 0; j < 15; j++){
        wins[i][j] = [];
    }
}

var count = 0; //赢法种类索引

//横行赢法
for(var i = 0; i < 15; i++){
    for(var j = 0; j < 11; j++){
        for(var k = 0; k < 5; k++){
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

//竖行赢法
for(var i = 0; i < 15; i++){
    for(var j = 0; j < 11; j++){
        for(var k = 0; k < 5; k++){
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

//斜线赢法
for(var i = 0; i < 11; i++){
    for(var j = 0; j < 11; j++){
        for(var k = 0; k < 5; k++){
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

//反斜线赢法
for(var i = 0; i < 11; i++){
    for(var j = 14; j > 3; j--){
        for(var k = 0; k < 5; k++){
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}


for(var i = 0; i < count; i++){
    myWin[i] = 0;
    computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#bfbfbf";

//棋盘
var drawChessBord = function(){
    for(var i = 0;i < 15; i++){
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
};

drawChessBord();

//棋子
var oneStep = function(i, j, me){
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(17 + i * 30, 13 + j * 30, 13, 17 + i * 30, 13 + j * 30, 0);
    if(me){
        //黑棋
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636766");
    }else{
        gradient.addColorStop(0, "#d1d1d1");
        gradient.addColorStop(1, "#f9f9f9");
    }
    context.fillStyle = gradient;
    context.fill();
};

//下棋
chess.onclick = function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if(chessBoard[i][j] == 0){
        oneStep(i, j, me);
        chessBoard[i][j] = 1;
        for(var k = 0; k < count; k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k] = -1;
                if(myWin[k] == 5){
                    alert("你赢了");
                    over = true;
                }
            }
        }
    }else{
        alert('此处已经有子');
    }
    if(!over){
        me = !me;
        computerAI();
    }
};

var computerAI = function(){
    var myScore = [];
    var computerScore = [];
    var max = 0;      //保存最高分数
    var u = 0, v = 0; //最分数点坐标
    for(var i = 0; i < 15; i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(var j = 0; j < 15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 15; j++){
            if(chessBoard[i][j] == 0){
                for(var k = 0; k < count; k++){
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            myScore[i][j] += 400;
                        }else if(myWin[k] == 3){
                            myScore[i][j] += 2000;
                        }else if(myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }
                    }
                    if(computerScore[i][j][k]){
                        if(myWin[k] == 1){
                            computerScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            computerScore[i][j] += 420;
                        }else if(myWin[k] == 3){
                            computerScore[i][j] += 2100;
                        }else if(myWin[k] == 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    oneStep(u, v, false);
    chessBoard[u][v] = 2;
    for(var k = 0; k < count; k++){
        if(wins[u][v][k]){
            computerWin[k]++;
            myWin[k] = -1;
            if(computerWin[k] == 5){
                alert("计算机赢了");
                over = true;
            }
        }
    }
    if(!over){
        me = !me;
    }
};
















