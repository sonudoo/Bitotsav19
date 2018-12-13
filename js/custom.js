$(window).on('load', function() {
  setTimeout(function(){
    $('#status').hide(); // will first fade out the loading animation 
    $('#preloader').fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').css({'overflow':'visible'});
    $('#bitlogo').addClass('animated bounceInLeft');
    $('#bitotsavlogo').addClass('animated bounceInRight');
    $('#bitotsav_main').addClass('animated zoomIn');
    $('#asia').addClass('animated zoomIn');
    $('.sidenav').addClass('animated fadeIn');
    $('#buttons').addClass('animated fadeInUp');
  }, 2000);
})

