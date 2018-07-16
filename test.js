window.onload = initGame;
var gameScore=0;
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

function Shape(x, y, type, direction, screen)
{
    this.position_x=x;
    this.position_y=y;
    this.type = type;
    this.direction = direction;
    this.screen = screen;
}

//得分后向下平移
Shape.prototype.updateScreen = function (row){
    if(row==0){
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
    if(judge == 1){
        return;
    }else{
        this.screen[row] = Array.prototype.slice.call(this.screen[row-1], 0);
        this.updateScreen(row);
    }
    
};

//清除行
Shape.prototype.clearRow = function (row){
    var tempRow = this.screen[row];
    Array.prototype.forEach.call(tempRow, function (value, index, arr){
        arr[index] = 0;
    });
    this.updateScreen(row);
};


//检查是否有得分项
Shape.prototype.checkScore = function(startPoint ){
    
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
        this.clearRow(startPoint);
        this.checkScore(startPoint);
    }
};

Shape.prototype.initShape = function(flag){
    if(this.type = 1 && this.direction == 1)
    {
        this.screen[this.position_x][this.position_y].setValue(flag);
        this.screen[this.position_x][this.position_y+1].setValue(flag);
        this.screen[this.position_x][this.position_y+2].setValue(flag);
        this.screen[this.position_x][this.position_y+3].setValue(flag);
    }
};

Shape.prototype.clearPosition = function(){
    if(type ==1 && direction == 1)
    {
        block_point[this.position_x][this.position_y].setValue(0);
        block_point[this.position_x][this.position_y+1].setValue(0);
        block_point[this.position_x][this.position_y+2].setValue(0);
        block_point[this.position_x][this.position_y+3].setValue(0);
    }
}



Shape.prototype.moveDown = function(){
    if(this.type ==1)
    {
        this.initShape(0);
        this.position_x++;
        this.initShape(1);
    }
};



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
    var test = new Shape(0,0,1,1,block_point);
    test.initShape(1);
    setTimeout(test.moveDown.bind(test), 2000);
}