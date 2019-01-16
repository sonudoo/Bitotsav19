var requrl = "https://bitotsav.in";

//merge conflict

//incoming changes
var dataList = document.getElementById('json-datalist');
var input = document.getElementById('reg-college');
$.ajax({
    type: 'GET',
    url: requrl + '/api/participants/getCollegeList',
}).done((data)=>{
    //data = data.substring(15, data.length-2);
    //const arr = data.split(',');
    data = JSON.parse(data);
    const arr = data.collegeList.colleges;
    //console.log(arr);
    arr.forEach(function(item) {
        // Create a new <option> element.
        item = item.trim();
        //item = item.substring(1, item.length-1);
        var option = document.createElement('option');
        // Set the value using the item in the JSON array.
        option.value = item;
        // Add the <option> element to the <datalist>.
        dataList.appendChild(option);
    });
}).fail((err) => {
    alert('Some error occured.Please try again.');
    location.reload(true);
});

$(window).ready(function(){
    $('#email_error').hide();
    $('#name_error').hide();
    $('#phone_error').hide();
    $('#password_error').hide();
    $('#cpassword_error').hide();
    $('#roll_error').hide();
    $('#source_error').hide();
    $('#year_error').hide();

    var email_error = false;
    var name_error = false;
    var phone_error = false;
    var password_error = false;
    var phone_otp_error = false;
    var email_otp_error = false;
    var college_error = false;
    var roll_error=false;

    $("#reg-name").focusout(function(){
        check_name();
    });

    $("#reg-email").focusout(function(){
        check_email();
    });

    $("#reg-phone").focusout(function(){
        check_phone();
    });

    $("#reg-cpassword").focusout(function(){
        check_password();
    });
    $("#reg-password").focusout(function(){
        check_password();
    });
    $("#reg-email-otp").focusout(function(){
        checkOtp();
    });
    $("#reg-phone-otp").focusout(function(){
        checkOtp();
    });
    $("#reg-college").focusout(function(){
        check_college();
    });
    $("#reg-roll").focusout(function(){
        check_roll();
    })

    function check_name() {
        var name = $('#reg-name').val();
        name.trim();
        if(name!='') {
            $('#name_error').hide();
        }
        else {
            $('#name_error').html("Name field cannot be empty");
            $('#name_error').show();
            name_error=true;
        }
    }
    function check_college() {
        var name = $('#reg-college').val();

        if(name!=undefined) {
            $('#college_error').hide();
        }
        else {
            $('#college_error').html("College name cannot be empty");
            $('#college_error').show();
            college_error=true;
        }
    }
    function check_roll() {
        var name = $('#reg-roll').val();
        name.trim();
        if(name!='') {
            $('#roll_error').hide();
        }
        else {
            $('#roll_error').html("Roll number cannot be empty");
            $('#roll_error').show();
            roll_error=true;
        }
    }



    function checkOtp(){
        var phone = $("#reg-phone-otp").val().trim();
        var email = $("#reg-email-otp").val().trim();
        if(phone!=''){
            $("#phone_otp_error").hide();
        }
        else{
            $("#phone_otp_error").html("Phone OTP is not entered.");
            $("#phone_otp_error").show();
            phone_otp_error = true;
        }

        if(email!=''){
            $("#email_otp_error").hide();
        }
        else{
            $("#email_otp_error").html("Email OTP is not entered.");
            $("#email_otp_error").show();
            email_otp_error = true;
        }
    }
    function check_email() {
        var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
        var email = $('#reg-email').val().trim();
        if(pattern.test(email)&&email!='') {
            $('#email_error').hide();
        }
        else {
            $('#email_error').html("Invalid email address");
            $('#email_error').show();
            email_error=true;
        }
    }
    function check_phone() {
        var pattern = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        var phone = $('#reg-phone').val().trim();
        console.log(phone);
        if(phone.match(pattern)&&parseInt(phone)>6000000000&&parseInt(phone)<10000000000) {
            $('#phone_error').hide();
        }
        else {
            $('#phone_error').html("Invalid phone number");
            $('#phone_error').show();
            phone_error=true;
        }
    }
    function check_password() {
        var password = $('#reg-password').val();
        var password2 = $('#reg-cpassword').val();
        if(password!='' && password2!='') {
            if(password == password2) {
                $('#password_error').hide();
            }
            else {
                $('#password_error').html("Passwords do not match");
                $('#password_error').show();
                password_error=true;
            }
        }

    }



    $("#reg-one").click(function(e){
        e.preventDefault();
        console.log("regone is entered.")

        //validation
        name_error = false;
        email_error=false;
        password_error=false;
        phone_error=false;
        check_name();
        check_email();
        check_password();
        check_phone();

        //data entered
        var email = $("#reg-email").val().trim();
        var name = $("#reg-name").val().trim();
        var phone = $("#reg-phone").val().trim();
        var password = $("#reg-password").val();

        if(!name_error && !email_error && !password_error && !phone_error){
            console.log("sadasd");
            var data = {
                "email":email,
                "name":name,
                "phno":phone,
                "password":password
            }

            $.ajax({
                type:'POST',
                url:requrl + "/api/participants/register/",
                data:data,
                success : function(res){
                    res = JSON.parse(res);
                    if(res.success === false){
                        alert(res.msg);
                        location.reload(true);
                    }
                    else{
                        $(".page-one").fadeOut();
                        setTimeout(function(){
                            $(".page-two").fadeIn();
                        },1000);
                    }
                },
                error: function(err) {
                    alert("Error! Please try again.");
                    location.reload(true);
                }
            })
        }
    });



    $("#reg-two").click(function(e){
        e.preventDefault();
        var phone_otp_error = false;
        var email_otp_error = false;
        checkOtp();
        var data ={
            email: $("#reg-email").val().trim(),
            phoneOtp:parseInt($("#reg-phone-otp").val().trim()),
            emailOtp:parseInt($("#reg-email-otp").val().trim())
        }
        if(!phone_otp_error&&!email_otp_error){
            $.ajax({
                type:'POST',
                url:requrl + "/api/participants/verifyOTP",
                data:data,
                success:function(res){
                    res = JSON.parse(res);
                    if(res.success === false){
                        $("#reg-phone-otp").val("");
                        $("#reg-email-otp").val("");
                        alert(res.msg);
                    }
                    else{
                        $(".page-two").fadeOut();
                        setTimeout(function(){$(".page-three").fadeIn();},1000);
                    }
                },
                error: function(err){
                    alert("Error! Please try again.");
                    location.reload(true);
                }
            });
        }
    });
    $("#reg-three").click(function(e){
        //api/admin/saveparticipant
        e.preventDefault();
        college_error=false;
        roll_error=false;
        check_college();
        check_roll();



        //data entered
        var gender = $("#reg-gender").val().trim();
        var college = $("#reg-college").val().trim();
        var roll = $("#reg-roll").val().trim();
        var source = $("#reg-source").val().trim();
        var year = $("#reg-year").val().trim();

        if(!college_error && !roll_error){
            var data = {
                email: $("#reg-email").val().trim(),
                password: $('#reg-password').val(),
                gender:gender,
                rollno:roll,
                source:source,
                year:year,
                college:college
            }

            $.ajax({
                type:'POST',
                url:requrl + "/api/participants/saveparticipant",
                data:data,
                success : function(res){
                    res = JSON.parse(res);
                    if(res.success === true){
                        alert(res.msg);
                        location.reload(true);
                    }
                    else{
                        alert("Error!Please try again.");
                    }
                },
                error: function() {
                    alert("Error! Please try again.");
                }
            });
        }


    });

})
