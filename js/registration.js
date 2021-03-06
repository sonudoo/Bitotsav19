var requrl = "https://bitotsav.in";
var dataList = document.getElementById('json-datalist');
var input = document.getElementById('reg-college');
$.ajax({
    type: 'GET',
    url: requrl + '/api/participants/getCollegeList',
}).done((data)=>{
    data = JSON.parse(data);
    const arr = data.collegeList.colleges;
    arr.forEach(function(item) {
        item = item.trim();
        var option = document.createElement('option');
        option.value = item;
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
    $("#login-username-error").hide();
    $("#login-password-error").hide();

    var email_error = false;
    var name_error = false;
    var phone_error = false;
    var password_error = false;
    var phone_otp_error = false;
    var email_otp_error = false;
    var college_error = false;
    var roll_error=false;
    var cpassword_error = false;
    var password_less = false;
    var username_error =false;
    var password_error = false;

    function check_name() {
        var name = $('#reg-name').val().trim();
        if(name!='') {
            $('#name_error').hide();
            name_error=false;
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
            college_error=false;
        }
        else {
            $('#college_error').html("College name cannot be empty");
            $('#college_error').show();
            college_error=true;
        }
    }
    function check_roll() {
        var name = $('#reg-roll').val().trim();
        if(name!='') {
            $('#roll_error').hide();
            roll_error=false;
        }
        else {
            $('#roll_error').html("Roll number cannot be empty");
            $('#roll_error').show();
            roll_error=true;
        }
    }
    function checkPhoneOtp(){
        var phone = $("#reg-phone-otp").val().trim();
        if(phone!=''){
            $("#phone_otp_error").hide();
            phone_otp_error = false;
        }
        else{
            $("#phone_otp_error").html("Phone OTP is not entered.");
            $("#phone_otp_error").show();
            phone_otp_error = true;
        }
    }

    function checkEmailOtp(){
        var email = $("#reg-email-otp").val().trim();

        if(email!=''){
            $("#email_otp_error").hide();
            email_otp_error = false;
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
            email_error=false;
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
        if(phone.match(pattern)&&parseInt(phone)>6000000000&&parseInt(phone)<10000000000) {
            $('#phone_error').hide();
            phone_error=false;
        }
        else {
            $('#phone_error').html("Invalid phone number");
            $('#phone_error').show();
            phone_error=true;
        }
    }
    function check_password(){
        var password = $('#reg-password').val();
            if(password.length<6){
                $('#password_error').empty();
                $('#password_error').html("Password should have more than 6 characters.");
                $('#password_error').show();
                password_less=true;
            }
            else{
                $('#password_error').hide();
                password_less=false;
            }
    }
    function check_cpassword() {
        var password = $('#reg-password').val();
        var name = $('#reg-cpassword').val();
        if(name == '') {
            $('#cpassword_error').html("Confirm Password field cannot be empty");
            $('#cpassword_error').show();
            cpassword_error=true;
        }
        else if(password != name) {
            $('#cpassword_error').empty();
            $('#cpassword_error').html("Passwords do not match");
            $('#cpassword_error').show();
            cpassword_error=true;
        }
        else {
            $('#cpassword_error').hide();
            cpassword_error=false;
        }
    }
    function checkLoginUsername() {
        var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
        var email = $('#log-username').val().trim();
        if(pattern.test(email)&&email!='') {
            $('#login-username-error').hide();
            email_error=false;
        }
        else {
            $('#login-username-error').html("Invalid email address");
            $('#login-username-error').show();
            email_error=true;
        }
    }
    function checkLoginPassword(){
        var password = $("#log-password").val();
        if(password.length<6){
            //console.log(password.length)
            $("#login-password-error").html("Invalid Password");
            $("#login-password-error").show();
            password_error = true;
        }
        else{
            $("#login-password-error").hide();
            password_error = false;
        }
    }

    $("#reg-name").focusout(function(){
        check_name();
    });

    $("#reg-email").focusout(function(){
        check_email();
    });

    $("#reg-phone").focusout(function(){
        check_phone();
    });

    $('#reg-cpassword').focusout(function(){
        check_cpassword();
    });

    $('#reg-password').focusout(function(){
        check_password();
    });

    $("#reg-email-otp").focusout(function(){
        checkEmailOtp();
    });

    $("#reg-phone-otp").focusout(function(){
        checkPhoneOtp();
    });

    $("#reg-college").focusout(function(){
        check_college();
    });

    $("#reg-roll").focusout(function(){
        check_roll();
    });

    $("#log-username").focusout(function(){
        checkLoginUsername();
    });

    $("#log-password").focusout(function(){
        checkLoginPassword();
    });

    $('#go-to-login').on('click',function(e){
        e.preventDefault();
        window.location.href = "registration.html";
    });

    $("#login").click(function(e){
        e.preventDefault();
        let loadingText="<i class='fa fa-circle-o-notch fa-spin'></i> Logging"
        $(this).html(loadingText);
        $(this).prop('disabled',true);
         username_error = false;
         password_error = false;
         checkLoginUsername();
         checkLoginPassword();
         if(!username_error && !password_error){
             $.ajax({
                 type:'POST',
                 url:requrl+ "/api/participants/participantLogin",
                 data: {
                     email : $("#log-username").val().trim(),
                     password : $("#log-password").val()
                 }
             }).done(function(res){
                res = JSON.parse(res);
                if(res.success===true){
                    let token = "bearer "+res.token;
                    localStorage.setItem('token',token);
                    window.location.href = 'dashboard.html';
                }
                else{
                    alert(res.msg);
                    if(res.msg == "You are not registered yet."){
                        window.location.href = 'registration.html';
                    }
                    else location.reload(true);
                }
             })
             .fail(function(err){
                alert('Some error occured.Please try again.');
                location.reload(true);
             });
         }
         else{
             $("#login").html('Login');
             $("#login").prop('disabled',false);
         }

    });

    $("#reg-one").click(function(e){
        e.preventDefault();
        let loadingText="<i class='fa fa-circle-o-notch fa-spin'></i> Loading"
        $(this).html(loadingText);
        $(this).prop('disabled',true);
        //validation
        name_error = false;
        email_error=false;
        cpassword_error = false;
        password_error=false;
        phone_error=false;
        password_less = false;
        check_name();
        check_email();
        check_password();
        check_cpassword();
        check_phone();
        //check_password_length();

        let response = grecaptcha.getResponse();

        if (response.length == 0) {
            alert("CAPTCHA Required.");
            return;
        }
        //data entered
        var email = $("#reg-email").val().trim();
        var name = $("#reg-name").val().trim();
        var phone = $("#reg-phone").val().trim();
        var password = $("#reg-password").val();

        if(!password_less && !name_error && !email_error && !password_error && !phone_error && !cpassword_error){
            var data = {
                "email":email,
                "name":name,
                "phno":phone,
                "password":password,
                "g-recaptcha-response": grecaptcha.getResponse()
            }

            $.ajax({
                type:'POST',
                url:requrl + "/api/participants/register/",
                data:data,
                success : function(res){
                    res = JSON.parse(res);
                    if(res.success === false){
                        alert(res.msg);
                        $("#reg-one").html('Register');
                        $("#reg-one").prop('disabled',false);
                        return;
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
        else{
            $("#reg-one").html('Register');
            $("#reg-one").prop('disabled',false);
        }
    });



    $("#reg-two").click(function(e){
        let loadingText="<i class='fa fa-circle-o-notch fa-spin'></i> Loading"
        $(this).html(loadingText);
        $(this).prop('disabled',true);
        e.preventDefault();
         phone_otp_error = false;
         email_otp_error = false;
        checkPhoneOtp();
        checkEmailOtp();
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
                        $("#reg-two").html('Verify');
                        $("#reg-two").prop('disabled',false);
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
        else {
            $("#reg-two").html('Verify');
            $("#reg-two").prop('disabled',false);
        }
    });
    $("#reg-three").click(function(e){
        let loadingText="<i class='fa fa-circle-o-notch fa-spin'></i> Loading"
        $(this).html(loadingText);
        $(this).prop('disabled',true);
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
                        $(".page-three").fadeOut();
                        $('.bit-id').html(res.data);
                        setTimeout(function(){
                            $(".page-four").fadeIn();
                        },1000);
                    }
                    else if(res.success === false){
                        alert(res.msg);
                        $("#reg-three").html('Submit');
                        $("#reg-three").prop('disabled',false);
                    }
                },
                error: function() {
                    alert("Error! Please try again.");
                    $("#reg-three").html('Submit');
                    $("#reg-three").prop('disabled',false);
                }
            });
        }
        else {
            $("#reg-three").html('Submit');
            $("#reg-three").prop('disabled',false);
        }

    });

})
