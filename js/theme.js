$(document).ready(function(){
    $("#social").on("click",function(){
        $(".tabs").removeClass("tabs-social");
        $(".tabs").removeClass("tabs-theme");
        $(".tabs").removeClass("tabs-campaign");
        $(".tabs").addClass("tabs-social"); // Social Cause image
    });
	$("#theme").on("click",function(){
        $(".tabs").removeClass("tabs-social");
        $(".tabs").removeClass("tabs-theme");
        $(".tabs").removeClass("tabs-campaign");
        $(".tabs").addClass("tabs-theme"); // Theme image
    });
    $("#campaign").on("click",function(){
        $(".tabs").removeClass("tabs-social");
        $(".tabs").removeClass("tabs-theme");
        $(".tabs").removeClass("tabs-campaign");
        $(".tabs").addClass("tabs-campaign") // Social Campaign image
    });
});