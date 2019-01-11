// GET request for Profile Page
$.ajax({
    url: "/dashboard",
    type: 'GET',
    success: function(res) {
        // Considering res is an object

        $("#age").text(res.age);
        $("#username").text(res.username);
        $("#email").text(res.email);
        $("#bitotsavId").text(res.bitotsavID);
        $("#phone").text(res.phone);
        $("#college").text(res.college);
        $("#rollno").text(res.rollno);
        $("#year").text(res.year);

        // If res.gender is male set img src="man.png" else img src="woman.png"
        if(res.gender.equals("female")==true)
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
    if(($('#old-password').val() === "")||($('#new-password').val() === "")||($('#confirm-new-password').val() === "")) 
    {
        alert("Fields can't be empty!");
        return false;
    }
    if($('#old-password').val() === $('#new-password').val()) 
    {
        if ($('#new-password').val() !== $('#confirm-new-password').val()) 
        {
            alert("Password Mismatch");
            return false;
        }
        alert("Passwords Match");
        // Now we send Passwords for verification
        // action="/linkToresetPassword" method="POST"
        // Yet to write
        $.ajax({
            type: 'post',
            url: '/linktoResetPassword',
            data: xyz,
            success: function () {
              alert('form was submitted');
            }
        });
        return false;
    }
    alert("Password Mismatch 2");
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



