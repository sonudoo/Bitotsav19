const requrl = "http://localhost:3000";
$(document).ready(function(){
    $("#music").click(function(e){
        e.preventDefault();
        
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Music"
            },
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })
    
    $("#dance").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl+'/api/admin/getEventByCategory',
            data :{
                "category": "Dance"
            },
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })

   // console.log("fejejwfbh");

    $("#dramatics").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Dramatics"
            },
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })

    $("#speaking-arts").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Speaking Arts"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })


    $("#literary-arts").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Literary Arts"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })


    $("#digital-arts").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Digital Arts"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })
    

    $("#fine-arts").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Fine Arts"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })


    $("#fashion").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Fashion"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })


    $("#journalism").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Journalism"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })


    $("#informals").click(function(e){
        e.preventDefault();
        $(".event-card-group").fadeOut();
        $(".heading").fadeOut();
        $("#event-details").css("display","none");
        $("#event-details").html("");
        $("#back").fadeIn();
        $.ajax({
            type:'POST',
            url:requrl + '/api/admin/getEventByCategory',
            data :{
                "category": "Informals"
            },
            
            headers:{
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.success === 'fail'){
                alert(result.message);
                location.reload(true);
            }
            else{
                //$("#event-details").empty();
                console.log(result);
                $(".heading").html(result[0].eventCategory);
                $("#event-details").append("<div class = \"event-card-group row\" >")
                    for(var i=0;i<result.length;i++){
                        $("#event-details").append("<div data-toggle=\"modal\" data-target=\"#"+result[i]._id+"\" class = \"event-card col-mid-3\"><div class=\"thumb\"></div><div class=\"infos\"><h2 class=\"title\" style=\"margin-left:-1vw\">"+ result[i].eventName+ "<span class=\"flag\"></span></h2></div></div>");
                    }
                for(var i=0;i<result.length;i++){
                    $(".wrap").append("<div id=\""+result[i]._id+"\" class=\"modal fade\" role=\"dialog\" style=\"overflow-y:hidden\" ><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\">"+
                    "<div class=\"modal-header\">"+
                        "<div><h4 style=\"float:left;text-align:center\" class=\"modal-title\">"+result[i].eventName+"</h4></div>"+   
                      "<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>"+  
                    "</div>"+
                    "<div class=\"modal-body\" >"+
                      "<div><div class=\"modal-event-rules\" style=\"overflow-y:scroll\" ><h2>Rules</h2><hr><div class=\"event-team-size\">"+"Team Size: "+result[i].eventMinimumMembers +" - " +result[i].eventMaximumMembers +"</div> <div class=\"event-venue\">"+"Venue: "+result[i].eventVenue+"</div> <div class=\"event-time\">"+"Time: "+result[i].eventTime+"</div> <div class=\"event-day\">"+"Day: "+result[i].eventDay+" </div><br><br> <div class=\"event-rules\"><ol><li>"+result[i].eventRules.replace(/\n/g,"<li>")+"</ol></div>  </div></div>"+
                    "</div>"+
                    "<div class=\"modal-footer\">"+
                      "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"+
                    "</div>"+
                  "</div>  "+
                "</div>"
                    );
            
            }
                $("#event-details").append("</div>");
                $("#event-details").fadeIn();
                $(".heading").fadeIn();    
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'event.html';
        });
    })

});
$("#back").click(function(e){
    e.preventDefault();
    $("#event-details").fadeOut();
    $(".heading").fadeOut();
    $("#back").fadeOut();
    setTimeout(function(){
        $(".event-card-group.row").fadeIn();
        $(".heading").html("Events");
        $(".heading").fadeIn();
        
      }, 1000);
    
 
   
});
