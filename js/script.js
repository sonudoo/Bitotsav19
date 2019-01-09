$(document).ready(function () {
    var s = skrollr.init();
})
let lastScroll = 0;
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if(scroll > lastScroll){
        if(scroll < 4000){
            $("#plane").css({'transform': 'rotate(90deg)'});
        }
        else if(scroll >= 4000 && scroll < 8000){
            $("#plane").css({'transform': 'rotate(-45deg)'});
        }
        else if(scroll >= 8000 && scroll < 12000){
            $("#plane").css({'transform': 'rotate(90deg)'});
        }
        else if(scroll >= 12000){
            $("#plane").css({'transform': 'rotate(-90deg)'});
        }
    }
    else{
        if(scroll < 4000){
            $("#plane").css({'transform': 'rotate(-90deg)'});
        }
        else if(scroll >= 4000 && scroll < 8000){
            $("#plane").css({'transform': 'rotate(135deg)'});
        }
        else if(scroll >= 8000 && scroll < 12000){
            $("#plane").css({'transform': 'rotate(-90deg)'});
        }
        else if(scroll >= 12000){
            $("#plane").css({'transform': 'rotate(90deg)'});
        }
    }
    lastScroll = scroll;
});