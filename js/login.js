var requrl = "https://bitotsav.in";
$(window).ready(function(){
    $("#username-error").hide();
    $("#password-error").hide();

    var username_error =false;
    var password_error = false;

    $("#log-username").focusout(function(){
        checkUsername();
    });

    $("#log-password").focusout(function(){
        checkPassword();
    });
    function checkUsername() {
        var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
        var email = $('#log-username').val().trim();
        if(pattern.test(email)&&email!='') {
            $('#username_error').hide();
        }
        else {
            $('#username_error').html("Invalid email address");
            $('#username_error').show();
            email_error=true;
        }
    }
    function checkPassword(){
        var password = $("#log-password");
        if(password!=''){
            $("password-error").hide();
        }
        else{
            $("#password-error").html("Please enter the password.");
            $("#password-error").show();
            password_error = true;
        }
    }

    $("#login").click(function(e){
        e.preventDefault();
         var username_error = false;
         var password_error = false;
         checkUsername();
         checkPassword();
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

    });

});
