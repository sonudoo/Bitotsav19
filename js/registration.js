
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

    $("#reg-name").focusout(function(){
        check_name();
    });

    $("#reg-email").focusout(function(){
        check_email();
    });

    $("#reg-phone").focusout(function(){
        check_phone();
    });

    $("#reg-password","#reg-cpassword").focusout(function(){
        check_password();
    });

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
    function checkOtp(){
        var phone = $("reg-phone-otp").val().trim();
        var email = $("reg-email-otp").val().trim();
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
            $("#email_otp_error").html("Phone OTP is not entered.");
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
        if(pattern.test(phone)&&phone!='') {
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
        var password = $("#reg-password").trim();
        
        if(!name_error & !email_error && !password_error && !phone_error){
            var data = {
                "email":email,
                "name":name,
                "phone":phone,
                "password":password
            }

            $.ajax({
                type:'POST',
                url:'',
                data:data,
                success : function(){
                    $(".page-one").fadeOut();
                    setTimeout(function(){
                        $(".page-two").fadeIn();
                    },1000)
                },
                error: function() {
                    alert("Error! Please try again.");
                }
            })
        }
    });



    $("#reg-two").click(function(){
        var phone_otp_error = false;
        var email_otp_error = false;
        checkOtp();
        if(!phone_otp_error&&!email_otp_error){
            $.ajax({
                type:'POST',
            })
        }
        
        
        var data ={
            "phoneOtp":$("#reg-phone-otp").val().trim(),
            "emailOtp":$("#reg-phone-otp").val().trim()
        }


        $(".page-two").fadeOut();
        setTimeout(function(){$(".page-three").fadeIn();},1000)
    });
    $("#reg-three").click(function(){
    });

})