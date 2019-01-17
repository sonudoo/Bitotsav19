// GET request for Profile Page
var requrl = "https://bitotsav.in";
var userbitId,userbitCollege,userbitEmail;
$.ajax({
    url: requrl+"/api/participants/dashboard",
    type: 'GET',
    headers: {
        token: localStorage.getItem('token')
    },
    success: function(res) {
        res = JSON.parse(res);

        // Event id team leader
        if(res.success===false) {
            alert(res.msg);
            window.location.href = "login.html";
            return;
        }
        console.log(res);
        $("#username").text(res.data.name.toUpperCase());
        $("#username").text(res.data.username);
        $("#email").text(res.data.email);
        $("#bitotsavId").text(res.data.id);
        $("#phone").text(res.data.phno);
        $("#college").text(res.data.college);
        $("#rollno").text(res.data.rollno);
        $("#year").text(res.data.year);
        $("#emailT1").val(res.data.email);
        $("#bitotsavIdT1").val(res.data.id);
        var gender=res.data.gender.toLowerCase();
        if(gender==="female") {
            $("#gender").attr("src","img/woman.png");
        }
        userbitId=res.data.id;
        userbitCollege=res.data.college;
        userbitEmail=res.data.email;
        prepareEventTable(res.data.id,res.data.events);
    },
    error: function(res){
        res = JSON.parse(res);
        alert(res.msg);
    }
});

// Championship registration
$('#team-registration').submit(function(e){
    e.preventDefault();
    var tName=$("#teamName").val().trim();
    if(tName==="")
    {
        $("#error-message3").text("*Team Name Field is empty!");
        $("#error-message3").css("color", "red");
        return false;
    }
    var emails=[],bitIds=[];
    for(var i=2;i<9;i++) {
        emails.push($("#emailT"+i).val().trim());
        bitIds.push($("#bitotsavIdT"+i).val().trim());
    }
    for(var i=0;i<7;i++) {
        if(emails[i]==="")
        {
            var fieldNum=i+2;
            $("#error-message3").text("*Email field "+fieldNum+" is empty!");
            $("#error-message3").css("color", "red");
            return false;
        }
        if(bitIds[i]==="")
        {
            var fieldNum=i+2;
            $("#error-message3").text("*Bitotsav ID field "+fieldNum+" is empty!");
            $("#error-message3").css("color", "red");
            return false;
        }
    }
    for(var i=0;i<7;i++) {
        if(check_email(emails[i])===false) {
            var fieldNum=i+2;
            $("#error-message3").text("*Email "+fieldNum+" is incorrect!");
            $("#error-message3").css("color", "red");
            return false;
        }
    }
    var members=[];
    members.push({
        memberEmail: userbitEmail,
        memberId: userbitId
    });
    for(var i=0;i<7;i++) {
        members.push({
            memberEmail: emails[i],
            memberId: bitIds[i]
        });
    }
    $.ajax({
        url: requrl + "/api/participants/championship",
        type: 'POST',
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            teamMembers: members,
            teamLeader: userbitId,
            teamName: tName
        },
        success: function(res) {
            res = JSON.parse(res);
            alert(res.msg);
            location.reload(true);
        },
        error: function(res){
            res = JSON.parse(res);
            alert(res.msg);
        }
    });
});

// GET request for Events Page
function prepareEventTable(id, events) {
    $.ajax({
        url: requrl+"/api/participants/getEvents",
        type: 'GET',
        success: function(res) {
            res = JSON.parse(res);
            if(res.success===false) {
                alert(res.msg);
                return;
            }
            function compare(a, b) {
                return a.eventId-b.eventId;
            }
            res.data.sort(compare);
            var userEvents=[],n=events.length,n2=res.data.length,mark=[];
            for(var i=0;i<n2;i++) {
                mark[i]=0;
            }
            for(var i=0;i<n;i++) {
                var eventId=events[i].eventId;
                var ans,optionButton;
                if(events[i].teamLeader===id) {
                    ans="Yes";
                    optionButton="<button id='"+ eventId +"' class='btn btn-warning'>Deregister</button>"
                } else {
                    ans="No";
                    optionButton="<span class='btn btn-warning disabled'>Deregister</span>"
                }
                userEvents[i]={
                    eventId: eventId,
                    eventName: res.data[eventId-1].eventName,
                    leader: ans,
                    options: optionButton
                };
                mark[eventId-1]=1;
            }
            // Pagination
            $('#event-table').pagination({
                dataSource: userEvents,
                pageSize: 5,
                callback: function(data, pagination) {
                    var html = template(data);
                    $("#eventData").html(html);
                }
            });
            // register routes
            var visited=false;
            for(var i=0;i<n2;i++) {
                if(mark[i]===0) {
                    $("#js-dropdown").append(`<option value=${res.data[i].eventId}>${res.data[i].eventName}</option>`);
                    if(visited==false) {
                        for(var j=res.data[i].mini;j<=res.data[i].maxx;j++) {
                            $("#js-dropdown2").append(`<option value=${j}>${j}</option>`);
                        }
                    }
                    visited=true;
                }
            }
            $('#js-dropdown').select2();
            $('#js-dropdown2').select2();
            $("#memberInfo").html("");
            var members=$("#js-dropdown2").val();
            for(var i=0;i<members;i++) {
                $("#memberInfo").append("<br><div class='row'><div class='col-xs-2'>Member "+(i+1)+"</div><div class='col-xs-5'><input type='text' id='email"+i+"' placeholder='email' required></div><div class='col-xs-5'><input type='text' id='bitotsavId"+i+"' placeholder='BitotsavId' required></div></div>");
            }
            $("#memberInfo").append("<br><p style='line-height: 1em; font-size: 1em;' id='error-message2'></p>");
            $("#memberInfo").append("<input type='submit' style='width:inherit' class='btn btn-primary' name='registerUsers' value='Register' id='registerUsers'>");

            $('#js-dropdown').on('change', function() {
                $("#js-dropdown2").html("");
                $("#memberInfo").html("");
                var mini=res.data[$(this).val()-1].mini;
                var maxx=res.data[$(this).val()-1].maxx;
                for(var i=mini;i<=maxx;i++) {
                    $("#js-dropdown2").append(`<option value=${i}>${i}</option>`);
                }
                $("#memberInfo").html("");
                var members=$("#js-dropdown2").val();
                for(var i=0;i<members;i++) {
                    $("#memberInfo").append("<br><div class='row'><div class='col-xs-2'>Member "+(i+1)+"</div><div class='col-xs-5'><input type='text' id='email"+i+"' placeholder='email' required></div><div class='col-xs-5'><input type='text' id='bitotsavId"+i+"' placeholder='BitotsavId' required></div></div>");
                }
                $("#memberInfo").append("<br><p style='line-height: 1em; font-size: 1em;' id='error-message2'></p>");
                $("#memberInfo").append("<input type='submit' style='width:inherit' class='btn btn-primary' name='registerUsers' value='Register' id='registerUsers'>");
            });

            $("#js-dropdown2").on("change",function(){
                $("#memberInfo").html("");
                var eventId=$("#js-dropdown").val();
                var members=$("#js-dropdown2").val();
                for(var i=0;i<members;i++) {
                    $("#memberInfo").append("<br><div class='row'><div class='col-xs-2'>Member "+(i+1)+"</div><div class='col-xs-5'><input type='text' id='email"+i+"' placeholder='email' required></div><div class='col-xs-5'><input type='text' id='bitotsavId"+i+"' placeholder='BitotsavId' required></div></div>");
                }
                $("#memberInfo").append("<br><p style='line-height: 1em; font-size: 1em;' id='error-message2'></p>");
                $("#memberInfo").append("<input type='submit' style='width:inherit' class='btn btn-primary' name='registerUsers' value='Register' id='registerUsers'>");
            });

            // Deregister Routes
            $("#eventData button").on("click",function(){
                var eventId=$(this)[0].id;
                deregisterAjax(eventId);
            });
        },
        error: function(res){
            res = JSON.parse(res);
            alert(res.msg);
        }
    });
}

function template(data) {
    var ans="<tr><th>Event ID</th><th>Event Name</th><th>Team Leader</th><th>Options</th></tr>";
    var n=data.length;
    for(var i=0;i<n;i++) {
        ans+="<tr>";
        ans+="<td>"+data[i].eventId+"</td>";
        ans+="<td>"+data[i].eventName+"</td>";
        ans+="<td>"+data[i].leader+"</td>"
        ans+="<td>"+data[i].options+"</td>";
        ans+="</tr>";
    }
    return ans;
}

function deregisterAjax(eventId) {
    var userbitId2=userbitId.slice(5,10);
    $.ajax({
        type: 'GET',
        headers: {
            token: localStorage.getItem('token')
        },
        url: requrl+'/api/participants/eventDeregistration/'+eventId+'/'+userbitId2,
        success: function (res) {
            res = JSON.parse(res);
            if(res.success===false) {
                alert(res.msg);
                return false;
            }
            alert(res.msg);
            location.reload(true);
        },
        error: function(res){
            res = JSON.parse(res);
            alert(res.msg);
        }
    });
}

$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
});

$("#sidebar a").on("click",function(){
    $(this).tab('show');
});

$("#memberInfo").submit(function(e) {
    e.preventDefault();
    // Validation
    var emails=[],bitIds=[];
    var memberSize=$("#js-dropdown2").val();
    for(var i=0;i<memberSize;i++) {
        emails[i]=$("#email"+i).val().trim();
        bitIds[i]=$("#bitotsavId"+i).val().trim();
    }
    for(var i=0;i<memberSize;i++) {
        if(emails[i]==="")
        {
            var fieldNum=i+1;
            $("#error-message2").text("*Email field "+fieldNum+" is empty!");
            $("#error-message2").css("color", "red");
            return false;
        }
        if(bitIds[i]==="")
        {
            var fieldNum=i+1;
            $("#error-message2").text("*Bitotsav ID field "+fieldNum+" is empty!");
            $("#error-message2").css("color", "red");
            return false;
        }
    }
    for(var i=0;i<memberSize;i++) {
        if(check_email(emails[i])===false) {
            var fieldNum=i+1;
            $("#error-message2").text("*Email "+fieldNum+" is incorrect!");
            $("#error-message2").css("color", "red");
            return false;
        }
    }

    // Request
    var eventId=$("#js-dropdown").val();
    var memberSize=$("#js-dropdown2").val();
    var members=[];
    for(var i=0;i<memberSize;i++) {
        members.push({
            memberEmail: emails[i],
            memberId: bitIds[i]
        });
    }
    var leaderId=userbitId;
    var leaderEmail=userbitEmail;
    var leaderCollege=userbitCollege;
    var memberData = {
        members: JSON.stringify(members),
        eventId: eventId,
        leaderId: leaderId,
        leaderEmail: leaderEmail,
        leaderCollege: leaderCollege
    };
    $.ajax({
        type: 'POST',
        headers: {
            token: localStorage.getItem('token')
        },
        url: requrl+'/api/participants/eventRegistration',
        data: memberData,
        success: function (res) {
            res = JSON.parse(res);
            if(res.success===false) {
                $("#error-message2").text("*"+res.msg);
                $("#error-message2").css("color", "red");
                return false;
            }
            alert(res.msg);
            location.reload(true);
        },
        error: function(res){
            res = JSON.parse(res);
            $("#error-message2").text("*"+res.msg);
            $("#error-message2").css("color", "red");
            return false;
        }
    });
    return false;
});

function check_email(email) {
    var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
    if(pattern.test(email)&&email!='') {
        return true;
    }
    else {
        return false;
    }
}

$("#passwordUpdate").submit(function(e) {
    e.preventDefault();
    var oldPassword=$('#old-password').val();
    var newPassword=$('#new-password').val();
    var confirmNewPassword=$('#confirm-new-password').val();
    if((oldPassword === "")||(newPassword === "")||(confirmNewPassword === ""))
    {
        $("#error-message").text("*Fields can't be empty!");
        $("#error-message").css("color", "red");
        return false;
    }
    if (newPassword !== confirmNewPassword)
    {
        $("#error-message").text("*Password Mismatch");
        $("#error-message").css("color", "red");
        return false;
    }
    // Now we send Passwords for verification
    $.ajax({
        type: 'POST',
        headers: {
            token: localStorage.getItem('token')
        },
        url: requrl+'/api/participants/updatePassword',
        data: {
           oldPassword: oldPassword,
           newPassword: newPassword
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res.success===false) {
                $("#error-message").text("*"+res.msg);
                $("#error-message").css("color", "red");
                return false;
            }
            $("#error-message").text("*"+res.msg);
            $("#error-message").css("color", "green");
        },
        error: function(res){
            res = JSON.parse(res);
            $("#error-message").text("*"+res.msg);
            $("#error-message").css("color", "red");
        }
    });
    return false;
});
