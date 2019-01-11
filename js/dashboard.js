// GET request for Profile Page
var requrl = "http://localhost:3000";
$.ajax({
    url: requrl+"/api/admin/dashboard",
    type: 'GET',
    headers: {
        token: localStorage.getItem('token')
    },
    success: function(res) {
        // Considering res is an object
        res = JSON.parse(res);
        if(res.success===false) {
            alert(res.msg);
            return;
        }
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
        if(gender==="female")
            $("#gender").attr("src","img/woman.jpg");
    }
});   

// GET request for Events Page
$.ajax({
    url: "/getAllData",
    type: 'GET',
    success: function(res) {
        // Considering res an array of objects


        // Pagination
        $('#events').pagination({
            dataSource: res,
            pageSize: 5,
            callback: function(data, pagination) {
                var html = template(data);
                $("#eventData").html(html);
            }
        });
        // register and unregister routes 


        // Dropdown Menu for Large number of events

    }
});

function template(data) {
    var ans="<tr><th>Event ID</th><th>Event Name</th><th>Team Leader</th><th>Options</th></tr>";
    var n=data.length;
    for(var i=0;i<n;i++) {
        ans+="<tr>";
        ans+="<td>"+data[i].eventId+"</td>";
        ans+="<td>"+data[i].eventName+"</td>";
        ans+="<td>"+"Leader"+"</td>"
        ans+="<td>"+"options"+"</td>";
        ans+="</tr>";
    }
    return ans;
}


$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
});

$("#sidebar a").on("click",function(){
    $(this).tab('show');
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
            $("#error-message").text(res.msg);
            $("#error-message").css("color", "red");
        }
    });
    return false;
});

// Dropdown

$('#js-dropdown').select2();
$('#js-dropdown2').select2();
$('#js-dropdown').on('change', function() {
    // Change minimum and maximum members list
    console.log($('#js-dropdown2').val());
});

// Write Users

$("#writeUsers").on("click",function(){
    var eventName=$("#js-dropdown").val();
    var membersNum=$("#js-dropdown2").val();
    $("#members-list").text(membersNum+" member will come here for event "+eventName);

});



