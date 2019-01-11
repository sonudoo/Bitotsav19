// GET request for Profile Page
var requrl = "http://localhost:3000";
var userbitId,userbitCollege,userbitEmail;
$.ajax({
    url: requrl+"/api/admin/dashboard",
    type: 'GET',
    headers: {
        token: localStorage.getItem('token')
    },
    success: function(res) {
        res = JSON.parse(res);

        // Event id team leader
        if(res.success===false) {
            alert(res.msg);
            return;
        }
        console.log(res.data);
        $("#username").text(res.data.name);
        $("#age").text(res.data.age);
        $("#username").text(res.data.username);
        $("#email").text(res.data.email);
        $("#bitotsavId").text(res.data.id);
        $("#phone").text(res.data.phno);
        $("#college").text(res.data.college);
        $("#rollno").text(res.data.rollno);
        $("#year").text(res.data.year);
        var gender=res.data.gender.toLowerCase();
        if(gender==="female") {
            $("#gender").attr("src","img/woman.jpg");
        }
        userbitId=res.data.id;
        userbitCollege=res.data.college;
        userbitEmail=res.data.email;
        prepareEventTable(res.data.id,res.data.events);
    }
});   

// GET request for Events Page
function prepareEventTable(id, events) {
    $.ajax({
        url: requrl+"/api/admin/getEvents",
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

            console.log(res.data);

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
            $("#memberInfo").append("<br><input type='submit' class='btn btn-primary' name='registerUsers' value='Register' id='regsiterUsers'>");

            $('#js-dropdown').on('change', function() {
                $("#js-dropdown2").html("");
                $("#memberInfo").html("");
                var mini=res.data[$(this).val()-1].mini;
                var maxx=res.data[$(this).val()-1].maxx;
                console.log(mini,maxx);
                for(var i=mini;i<=maxx;i++) {
                    $("#js-dropdown2").append(`<option value=${i}>${i}</option>`);
                }
                $("#memberInfo").html("");
                var members=$("#js-dropdown2").val();
                for(var i=0;i<members;i++) {
                    $("#memberInfo").append("<br><div class='row'><div class='col-xs-2'>Member "+(i+1)+"</div><div class='col-xs-5'><input type='text' id='email"+i+"' placeholder='email' required></div><div class='col-xs-5'><input type='text' id='bitotsavId"+i+"' placeholder='BitotsavId' required></div></div>");
                }
                $("#memberInfo").append("<br><input type='submit' class='btn btn-primary' name='registerUsers' value='Register' id='regsiterUsers'>");
            });

            $("#js-dropdown2").on("change",function(){
                $("#memberInfo").html("");
                var eventId=$("#js-dropdown").val();
                var members=$("#js-dropdown2").val();
                for(var i=0;i<members;i++) {
                    $("#memberInfo").append("<br><div class='row'><div class='col-xs-2'>Member "+(i+1)+"</div><div class='col-xs-5'><input type='text' id='email"+i+"' placeholder='email' required></div><div class='col-xs-5'><input type='text' id='bitotsavId"+i+"' placeholder='BitotsavId' required></div></div>");
                }
                $("#memberInfo").append("<br><input type='submit' class='btn btn-primary' name='registerUsers' value='Register' id='regsiterUsers'>");
            });

            // Deregister Routes
            $("#eventData button").on("click",function(){
                var eventId=$(this)[0].id;
                deregisterAjax(eventId);
            });
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
        url: requrl+'/api/admin/eventDeregistration/'+eventId+'/'+userbitId2,
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

    // Request
    var eventId=$("#js-dropdown").val();
    var memberSize=$("#js-dropdown2").val();
    var members=[];
    for(var i=0;i<memberSize;i++) {
        members.push({
            memberEmail: $("#email"+i).val(),
            memberId: $("#bitotsavId"+i).val()
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
        url: requrl+'/api/admin/eventRegistration',
        data: memberData,
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

    return false;
});

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
        url: requrl+'/api/admin/updatePassword',
        data: {
           oldPassword: oldPassword,
           newPassword: newPassword
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res.success===false) {
                $("#error-message").text(res.msg);
                $("#error-message").css("color", "red");
                return false;
            }
            $("#error-message").text(res.msg);
            $("#error-message").css("color", "green");
        },
        error: function(res){
            res = JSON.parse(res);
            $("#error-message").text(res.msg);
            $("#error-message").css("color", "red");
        }
    });
    return false;
});