window.onload = initGame;
var gameScore=0;

/*===============================像素块====================================*/
//定义像素块
function Block(){
    this.item = document.createElement("div");
    this.value = 0;
}

Block.prototype.setValue = function(val){
    this.value = val;
    if(this.value==1)
    {
        this.item.style.backgroundColor="black";
        //this.item.style["background-color"]= "black !important";
    }
    else{
        this.item.style["background-color"]= "azure";
    }
};

Block.prototype.checkValue = function(){
    if(this.value==1)
    {
        this.item.style.backgroundColor="black";
        //this.item.style["background-color"]= "black !important";
    }
    else{
        this.item.style["background-color"]= "azure";
    }
};

Block.prototype.initItem = function(left, top){
    var style_left = left*10;
    var style_top = top*10;
    this.item.setAttribute("class", "block")
    //this.item.setAttribute("left", style_left+"px");
    this.item.style.cssText += "left: "+style_left+"px !important";
    //this.item.setAttribute("top", style_top+"px");
    this.item.style.cssText += "top: "+style_top+"px !important";
    document.getElementById("screen").appendChild(this.item);
};


/*=========================================形状类================================*/


//定义形状
function Shape(x, y, type, direction, screen)
{
    this.id;
    this.position_x=x;
    this.position_y=y;
    this.type = type;
    this.shapedirection = direction;
    this.screen = screen;
    this.block1Position=[];
    this.block2Position=[];
    this.block3Position=[];
    this.block4Position=[];
    this.address();

};

//得分后向下平移
Shape.prototype.updateScreen = function (row){
    if(row<=0){
        return;
    }
    var tempRow = this.screen[row-1];
    var judge = Array.prototype.every.call(tempRow, function (vale, index, arr){
        if(vale.value == 0){
            return true;
        }else{
            return false;
        }
    });
    if(judge){
        console.log("stopupdate");
        rowCopy(this.screen[row], this.screen[row-1]);
        return;
    }else{
        console.log("running update");
        rowCopy(this.screen[row], this.screen[row-1]);
        this.updateScreen(row-1);
    }
    
};

//清除行
Shape.prototype.clearRow = function (row){
    var tempRow = this.screen[row];
    Array.prototype.forEach.call(tempRow, function (value, index, arr){
        arr[index].setValue(0);
    });
    this.updateScreen(row);
};


//检查是否有得分项
Shape.prototype.checkScore = function(startPoint ){
    if(startPoint<0){
        return;
    }
    
    var temp = this.screen[startPoint];
    if(Array.prototype.every.call(temp, function (value, index, arr){
        if(value.value == 0){
            return true;
        }
        else{
            return false;
        }
    })){
        return;
    }
    var judge = Array.prototype.every.call(temp, function (value, index, arr){
        if(value.value == 1){
            return true;
        }else{
            return false;
        }
    });
    if(!judge){
        this.checkScore(startPoint-1);
    }
    else{
        gameScore+=1000;
        console.log("score:"+gameScore);
        this.clearRow(startPoint);
        this.checkScore(startPoint);
    }
};

//初始化形状
Shape.prototype.initShape = function(flag){
        this.screen[this.position_x+this.block1Position[0]][this.position_y+this.block1Position[1]].setValue(flag);
        this.screen[this.position_x+this.block2Position[0]][this.position_y+this.block2Position[1]].setValue(flag);
        this.screen[this.position_x+this.block3Position[0]][this.position_y+this.block3Position[1]].setValue(flag);
        this.screen[this.position_x+this.block4Position[0]][this.position_y+this.block4Position[1]].setValue(flag);
};

//清楚当前位置
Shape.prototype.clearPosition = function(){
        this.screen[this.position_x+this.block1Position[0]][this.position_y+this.block1Position[1]].setValue(0);
        this.screen[this.position_x+this.block2Position[0]][this.position_y+this.block2Position[1]].setValue(0);
        this.screen[this.position_x+this.block3Position[0]][this.position_y+this.block3Position[1]].setValue(0);
        this.screen[this.position_x+this.block4Position[0]][this.position_y+this.block4Position[1]].setValue(0);
};

//碰撞检测
Shape.prototype.checkCrash = function(moveDirection){
    var nextPosition_x = this.position_x;
    var nextPosition_y = this.position_y;
    switch(moveDirection){
        case 0:
            break;
        case 1:
            nextPosition_y -=1;
            break;
        case 2:
            nextPosition_x += 1;
            break;
        case 3:
            nextPosition_y +=1;
            break;
    }
    if(nextPosition_x<0 || nextPosition_x>15 || nextPosition_y<0 || nextPosition_y>7)
    {
        console.log("钉子错误");
        console.log(moveDirection);
        console.log(nextPosition_y);
        return true;
    }
    //此处插入各个方块溢出检测代码
    this.clearPosition();
    var judge = nextPosition_x+this.block1Position[0]>15 || nextPosition_y + this.block1Position[1]>7
    || nextPosition_x+this.block2Position[0]>15 || nextPosition_y + this.block2Position[1]>7
    || nextPosition_x+this.block3Position[0]>15 || nextPosition_y + this.block3Position[1]>7
    || nextPosition_x+this.block4Position[0]>15 || nextPosition_y + this.block4Position[1]>7  
    ||this.screen[nextPosition_x+this.block1Position[0]][nextPosition_y + this.block1Position[1]].value
    ||this.screen[nextPosition_x +this.block2Position[0]][nextPosition_y + this.block2Position[1]].value
    ||this.screen[nextPosition_x + this.block3Position[0]][nextPosition_y + this.block3Position[1]].value
    ||this.screen[nextPosition_x + this.block4Position[0]][nextPosition_y + this.block4Position[1]].value;
    this.initShape(1);
    return judge;
};

//下一个方块
Shape.prototype.nextShape = function ()
{
    this.type =Math.ceil(Math.random()*5) ;
    console.log("type:"+this.type);
    this.position_x = 0;
    this.position_y = 0;
    this.shapedirection = 1;
    this.address();
    this.initShape(1);
    if(this.checkCrash(2))
    {

        alert("game over");
    }else{
        this.autoDown(1000);
    }

};

//移动
Shape.prototype.move = function(direction){
    var isCrash = this.checkCrash(direction);
    if(isCrash)
    {
        console.log("crash");
        if(direction == 2)
        {
            clearInterval(this.id);
            this.checkScore(15);
            this.nextShape();
            return false;
        }
        return true;
    }
    this.clearPosition();
    switch(direction){
        case 1:
            this.position_y -= 1;
            break;
        case 2:
            this.position_x += 1;
            break;
        case 3:
            this.position_y += 1;
            break;
    }
    this.initShape(1);
    return true;
};

//监听键盘
Shape.prototype.listenKey = function(){
    switch(event.keyCode){
        case 40:
            this.move(2);
            break;
        case 39:
            this.move(3);
            break;
        case 38:
            this.transform();
            break;
        case 37:
            this.move(1);
            break;
    }
};

//自动下降
Shape.prototype.autoDown = function(mil){
    this.id = setInterval(this.move.bind(this), mil, 2);

};

//旋转
Shape.prototype.transform = function(){
    this.shapedirection = ++this.shapedirection>4? 1: this.shapedirection;
    
    console.log(this.shapedirection);
    this.clearPosition();
    this.address();
    if(this.checkCrash(0)){
        this.shapedirection = --this.shapedirection<1? 4: this.shapedirection;
        this.address();
    }
    this.initShape(1);
};

//确定坐标轴
Shape.prototype.address = function(){
    console.log("transform");
    if(this.type == 1 && (this.shapedirection == 1|| this.shapedirection ==3))//长条
    {
        this.block1Position = [0,0];
        this.block2Position = [0,1];
        this.block3Position = [0,2];
        this.block4Position = [0,3];
    }
    if(this.type == 1 && (this.shapedirection == 2|| this.shapedirection ==4))//长条
    {
        this.block1Position = [0,0];
        this.block2Position = [1,0];
        this.block3Position = [2,0];
        this.block4Position = [3,0];
    }
    if(this.type == 2)//方块
    {
        this.block1Position = [0,0];
        this.block2Position = [0,1];
        this.block3Position = [1,0];
        this.block4Position = [1,1];
    }
    if(this.type == 3 && this.shapedirection == 1)//丁块
    {
        this.block1Position = [0,1];
        this.block2Position = [1,0];
        this.block3Position = [1,1];
        this.block4Position = [1,2];
    }
    if(this.type == 3 && this.shapedirection == 2)//丁块
    {
        this.block1Position = [0,1];
        this.block2Position = [1,0];
        this.block3Position = [1,1];
        this.block4Position = [2,1];
    }
    if(this.type == 3 && this.shapedirection == 3)//丁块
    {
        this.block1Position = [0,0];
        this.block2Position = [0,1];
        this.block3Position = [0,2];
        this.block4Position = [1,1];
    }
    if(this.type == 3 && this.shapedirection == 4)//丁块
    {
        this.block1Position = [0,0];
        this.block2Position = [1,0];
        this.block3Position = [2,0];
        this.block4Position = [1,1];
    }
    if(this.type == 4 && (this.shapedirection == 1 || this.shapedirection == 3))//左方块
    {
        this.block1Position = [0,0];
        this.block2Position = [0,1];
        this.block3Position = [1,1];
        this.block4Position = [1,2];
    }
    if(this.type == 4 && (this.shapedirection == 2 || this.shapedirection == 4))//左方块
    {
        this.block1Position = [0,1];
        this.block2Position = [1,0];
        this.block3Position = [1,1];
        this.block4Position = [2,0];
    }
    if(this.type == 5 && (this.shapedirection == 1 || this.shapedirection == 3))//右方块
    {
        this.block1Position = [1,0];
        this.block2Position = [1,1];
        this.block3Position = [0,1];
        this.block4Position = [0,2];
    }
    if(this.type == 5 && (this.shapedirection == 2 || this.shapedirection == 4))//右方块
    {
        this.block1Position = [0,0];
        this.block2Position = [1,0];
        this.block3Position = [1,1];
        this.block4Position = [2,1];
    }
}

/*========================通用方法=======================*/
function rowCopy(row1, row2)
{
    for(var cur=0; cur<row1.length; cur++)
    {
        row1[cur].setValue(row2[cur].value);
    }
}


/*===================================初始化游戏==========================================*/
//初始化游戏
function initGame(){
    
    var block_point = new Array(16);
    var test = new Block();
    test.initItem(0,0);
    var test2 = new Block();
    test2.initItem(1,1);
    for(var rows=0; rows<block_point.length; rows++)
    {
        block_point[rows] = new Array(8);
        for(var cols = 0; cols<block_point[rows].length; cols++)
        {
            block_point[rows][cols] = new Block();
            block_point[rows][cols].initItem(cols,rows);
 
        }
    }

    var test = new Shape(0,0,3,1,block_point);
    document.onkeydown = test.listenKey.bind(test);
    test.initShape(1);
    test.autoDown(1000);
}