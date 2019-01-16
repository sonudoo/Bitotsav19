var div1 = document.getElementById('div1');
var ul1 = document.getElementById('ul1');
var li = document.getElementsByTagName('li');
var img = div1.getElementsByTagName('img');
var imgHead = document.getElementById('imgHead');
var background = document.getElementById('background');
var albumImg = document.getElementById('albumImg');
var before = document.getElementById('before');
var after = document.getElementById('after');
var speed = 1;
ul1.innerHTML = ul1.innerHTML + ul1.innerHTML; //將兩個UL合併
ul1.style.width = li[0].offsetWidth * li.length + 192 + 'px'; //
function move(){
   if(-ul1.offsetLeft > ul1.offsetWidth/2){  //如果ul左邊offset>ul寬度/2
      ul1.style.left = 0;   //ul左邊offset歸0
   }
   if(ul1.offsetLeft > 0){  //如果ul左邊offset>0
      ul1.style.left = -ul1.offsetWidth/2 + 'px';   //ul左邊offset瞬間拉到ul寬度/2 px 的位置
   }
   ul1.style.left = ul1.offsetLeft + speed + 'px';
}
function moveClickLeft(){
   if(ul1.offsetLeft%136 != 0){ //補滿整張相片
      ul1.style.left = ul1.offsetLeft - ul1.offsetLeft%136 - 136 + 'px';
      
   }
   else{

      if(-ul1.offsetLeft >= ul1.offsetWidth/2){  //如果ul左邊offset>ul寬度/2
         ul1.style.left = 0;   //ul左邊offset歸0
      }

      ul1.style.left = ul1.offsetLeft + speed + 'px';
   }
}     

function moveClickRight(){
   if(ul1.offsetLeft%136 != 0){ //補滿整張相片
      ul1.style.left = ul1.offsetLeft - ul1.offsetLeft%136 + 'px';
   }else{
      if(ul1.offsetLeft >= 0){  //如果ul左邊offset>0
         ul1.style.left = -ul1.offsetWidth/2 + 'px';   //ul左邊offset瞬間拉到ul寬度/2 px 的位置
      }
      ul1.style.left = ul1.offsetLeft + speed + 'px';     
   }
}
//*/
var timer = setInterval( move, 30 );

div1.onmouseover = function(){
   clearInterval(timer);  
}
div1.onmouseout = function(){
   timer = setInterval( move, 30 ); //不要再重新var一個timer
   speed = 1;
}
before.onclick = function(){
   speed = -68;
   timer = setTimeout( moveClickLeft, 1 );
}
after.onclick = function(){
   speed = 68;
   timer = setTimeout( moveClickRight, 1 );
}

for(i=0 ; i<img.length ; i++){
   img[i].onclick = function(){
      //background.src = this.src;
      albumImg.src = this.src;
      albumImg.className = "none";
      setTimeout(function(){
         albumImg.className = 'fadeIn'
      },1);
   }
}


//*/
//alert(li[0].offsetWidth * li.length + 'px');