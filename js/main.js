(function ($) {
  "use strict";

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (! $('#header').hasClass('header-scrolled')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();
  
    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
          bottom = top + $(this).outerHeight();
  
      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('menu-active menu-item-active');
        main_nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('menu-active menu-item-active');
      }
    });
  });

  // Intro carousel
  var introCarousel = $(".carousel");
  var introCarouselIndicators = $(".carousel-indicators");
  introCarousel.find(".carousel-inner").children(".carousel-item").each(function(index) {
    (index === 0) ?
    introCarouselIndicators.append("<li data-target='#introCarousel' data-slide-to='" + index + "' class='active'></li>") :
    introCarouselIndicators.append("<li data-target='#introCarousel' data-slide-to='" + index + "'></li>");

    $(this).css("background-image", "url('" + $(this).children('.carousel-background').children('img').attr('src') +"')");
    $(this).children('.carousel-background').remove();
  });

  $(".carousel").swipe({
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
      if (direction == 'left') $(this).carousel('next');
      if (direction == 'right') $(this).carousel('prev');
    },
    allowPageScroll:"vertical"
  });

  // Skills section
  $('#skills').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, { offset: '80%'} );

  // jQuery counterUp (used in Facts section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  var portfolioIsotope = $('.portfolio-container');

  $('#portfolio-flters li').on( 'click', function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');

    portfolioIsotope.isotope({ filter: $(this).data('filter') });
  });

  // Clients carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 }
    } 
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Modal
  var elements = $('.modal-overlay, .modal');

    $('#services button').on("click",function(){
        elements.addClass('active');
    });

    $('.close-modal').on("click",function(){
        elements.removeClass('active');
    }); 

})(jQuery);

$(window).ready(function(){
  const requrl = "https://bitotsav.in";
var eventCategoryList = ['Music','Dance','Dramatics','Speaking Arts','Literary Arts','Digital Arts','Fine Arts','Fashion','Journalism','Informals'];

eventCategoryList.forEach(function(category){
    $.ajax({
      type: 'POST',
      url: requrl + '/api/events/getEventByCategory',
      data: {
          "category": category
      }
  })
      .done((result) => {
          // if (result.success === 'fail') {
          //     location.reload(true);
          // }
            console.log(category);
            // console.log(i);
            // console.log(eventCategoryList[i]);
            let tmp = ``;
            let tmp2 = ``;
            for(var j=0;j<result.length;j++){
              tmp+=`<div class="col-lg-4 col-md-6 portfolio-item filter-`+category.toLowerCase().replace(' ','-')+` fadeInUp" >
              <div class="portfolio-wrap">
                <figure>
                <button style="position:absolute;z-index:1;margin:31% 42%;" class = "btn btn-success" data-toggle="modal" data-target="#event`+result[j].eventId+`"><i class="ion ion-eye"></i></button>
                  <img src="./img/events/event`+result[j].eventId+`.png" class="img-fluid" alt="">

                    </figure>
                <div class="portfolio-info">
                  <h4><a href="#">`+result[j].eventName+`</a></h4>
                  <p>`+category+`</p>
                </div>
              </div>
          </div>`
          tmp2+= `<div class="modal fade" id="event`+result[j].eventId+`" role="dialog">
          <div class="modal-dialog">
          
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
              <h4 class="modal-title">`+result[j].eventName+`</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>  
              </div>
              <div class="modal-body">
              <div><div class="modal-event-description"><h2>Description</h2><hr><div class="event-team-size">Team Size: `+result[j].eventMinimumMembers +` - `+result[j].eventMaximumMembers +`</div> <div class="event-venue">Venue: `+result[j].eventVenue+`</div> <div class="event-time">Time: `+result[j].eventTime+`</div> <div class="event-day">Day: `+result[j].eventDay+` </div><br> <div class="event-description">`+result[j].eventDescription.replace(/\n/g,"<br>")+`<br><br></div></div></div>
              <div><div class="modal-event-rules"><h2>Rules</h2><hr><div class="event-rules"><ol><li>`+result[j].eventRules.replace(/\n/g,"<li>")+`</ol></div>  </div></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
            
          </div>
        </div>`;
            }
            $(".row.portfolio-container").append(tmp);
            $("body").append(tmp2);
      })

      .fail((err) => {
          alert('Some error occured.Please try again.');
          location.reload(true);
      });
     
  })

});

/**
 * Flagship js
 */
var elements = $('#services .modal-overlay,#services .modal');

    $('#services button').on("click",function(){
        elements.addClass('active');
    });

    $('.close-modal').on("click",function(){
        elements.removeClass('active');
    }); 
