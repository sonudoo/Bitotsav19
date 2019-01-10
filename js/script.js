$(document).ready(function () {
    var s = skrollr.init();
});
let countries = ["None", "India", "China", "Russia"]
let countriesX = [0, 550, 800, 650];
let countriesY = [0, 700, 500, 200];
let order = [0];
for(let i = 0; i<100; i++){
    let r = order[order.length-1];
    while(r == order[order.length-1] || r==0){
        r = parseInt(Math.random()*100000) % countries.length;
    }
    order.push(r);
}
for(let i=0;i<order.length;i++){
    $("#image").attr("data-"+i*4000, "background-position: -"+countriesX[order[i]]+"px -"+countriesY[order[i]]+"px;");
    $("#plane").attr("data-"+i*4000, "height: 25%; width: 25%;");
    $("#plane").attr("data-"+(i*4000+2000), "height: 100%; width: 100%;");
}
let currentCountry = 0;
let lastScroll = 0;
let offset = -45;
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if(scroll > lastScroll){
        if(scroll >= (currentCountry+1)*4000){
            currentCountry++;
        }
        let fx = countriesX[order[currentCountry]];
        let gx = countriesX[order[currentCountry+1]];
        let fy = countriesY[order[currentCountry]];
        let gy = countriesY[order[currentCountry+1]];
        let angle = Math.atan2((gy-fy), (gx-fx)) * (180/Math.PI) - offset;
        console.log("Angle between "+countries[order[currentCountry]]+" and "+countries[order[currentCountry+1]]+" is "+(angle-offset));
        $("#plane").css('transform', 'rotate(' + angle + 'deg)');
    }
    else{
        if(scroll < (currentCountry)*4000){
            currentCountry--;
        }
        let gx = countriesX[order[currentCountry]];
        let fx = countriesX[order[currentCountry+1]];
        let gy = countriesY[order[currentCountry]];
        let fy = countriesY[order[currentCountry+1]];
        let angle = Math.atan2((gy-fy), (gx-fx)) * (180/Math.PI) - offset;
        console.log("Angle between "+countries[order[currentCountry+1]]+" and "+countries[order[currentCountry]]+" is "+(angle+offset));
        $("#plane").css('transform', 'rotate(' + angle + 'deg)');
    }
    lastScroll = scroll;
});

function fly(){
    $('html, body').animate({
        scrollTop: lastScroll + 4000,
        scrollLeft: 0
    }, 1000);
}