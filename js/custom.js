$(window).on('load', function () {
  setTimeout(function () {
    $('#status').hide(); // will first fade out the loading animation 
    $('#preloader').fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').css({ 'overflow': 'visible' });
    $('#sap').hide();
    $('#bitlogo').addClass('animated bounceInLeft');
    $('#bitotsavlogo').addClass('animated bounceInRight');
    $('#bitotsav_main').addClass('animated zoomIn');
    $('#asia').addClass('animated zoomIn');
    $('.sidenav').addClass('animated fadeIn');
    $('#buttons').addClass('animated fadeInUp');
    $('#sap-form2').hide();
    $('#sap-success').hide();
  }, 500);
});


let sapid = null;

function showSAP() {
  $('#main').addClass('animated fadeOutUp');
  $("#main").hide();
  $("#sap").show();
  $('#sap').addClass('animated fadeInUp');
}

function registerSAP() {
  let name = $('#name').val();
  let email = $('#email').val();
  let phno = $('#phno').val();
  let college = $('#college').val();
  let q1 = $('#q1').val();
  let q2 = $('#q2').val();
  let q3 = $('#q3').val();
  let q4 = $('#q4').val();
  let q5 = $('#q5').val();
  if (/^[a-zA-Z .]+$/.test(name) == false) {
    $("#name-error").html("Name is incorrect. Only alphabets, spaces and periods are allowed.");
  }
  else{
    $("#name-error").html("");
  }
  if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false) {
    $("#email-error").html("Email is incorrect.");
  }
  else{
    $("#email-error").html("");
  }
  if (/[0-9]{10}/.test(phno) == false) {
    $("#phno-error").html("Phone number must consists of exactly 10 digits.");
  }
  else{
    $("#phno-error").html("");
  }
  if (/^[a-zA-Z .,]+$/.test(college) == false) {
    $("#college-error").html("College name is incorrect. Only alphabets, spaces and commas allowed.");
  }
  else{
    $("#college-error").html("");
  }
  if (q1.length < 1 || q1.length > 500) {
    $("#q1-error").html("Answer is required. Max 500 characters.");
  }
  else{
    $("#q1-error").html("");
  }
  if (q2.length < 1 || q2.length > 500) {
    $("#q2-error").html("Answer is required. Max 500 characters.");
  }
  else{
    $("#q2-error").html("");
  }
  if (q3.length < 1 || q3.length > 500) {
    $("#q3-error").html("Answer is required. Max 500 characters.");
  }
  else{
    $("#q3-error").html("");
  }
  if (q4.length < 1 || q4.length > 500) {
    $("#q4-error").html("Answer is required. Max 500 characters.");
  }
  else{
    $("#q4-error").html("");
  }
  if (q5.length < 1 || q5.length > 500) {
    $("#q5-error").html("Answer is required. Max 500 characters.");
  }
  else{
    $("#q5-error").html("");
  }
  let response = grecaptcha.getResponse();

  if (response.length == 0) {
    $("#global-error").html("CAPTCHA Required.");
    return;
  }
  else {
    $("#global-error").html("");
  }
  let data = {
    name: name,
    email: email,
    phno: phno,
    college: college,
    q1: q1,
    q2: q2,
    q3: q3,
    q4: q4,
    q5: q5,
    "g-recaptcha-response": grecaptcha.getResponse()
  }
 
  $("#btn").html("Registering..");
  $.ajax({
    url: 'https://bitotsav.in/api/sap',
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      if(data.success == true){
        $("#sap-form").hide(500);
        $("#sap-form2").show(500);
        sapid = data.id;
      }
      else{
        $("#global-error").html("An unknown error occured.");
        $("#btn").html("Register");
      }
    },
    error: function(data){
      $("#global-error").html("An unknown error occured.");
      $("#btn").html("Register");
    },
    data: JSON.stringify(data)
  });
}

function registerSAP2(){
  if(sapid == null){
    alert("SAP ID is missing. Please complete step one of registration.");
    return;
  }
  if (/[0-9]{6,6}/.test($("#otp").val()) == false) {
    $("#otp-error").html("OTP must be 6 digits long.");
    return;
  }
  else{
    $("#otp-error").html("");
  }
  let data = {
    id: sapid,
    otp: $("#otp").val()
  };
  $("#btn2").html("Verifying..");
  $.ajax({
    url: 'https://bitotsav.in/api/sap2',
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      if(data.success == true){
        $("#msg").html("You have successfully registered for SAP. Your SAP ID is <b>BITOTSAV/SAP/"+sapid+"</b>. You will be contacted soon by one of our team member.");
        $("#sap-form2").hide(500);
        $("#sap-success").show(500);
      }
      else{
        $("#global-error2").html("Incorrect OTP.");
        $("#btn2").html("Verify");
      }
    },
    error: function(data){
      $("#global-error2").html("An unknown error occured.");
      $("#btn2").html("Verify");
    },
    data: JSON.stringify(data)
  });
}

