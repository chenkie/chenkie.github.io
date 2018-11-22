$(function() {
  'use strict';

  /* ==========================================================================
   Preload
   ========================================================================== */

  $(window).load(function() {
    $('#status').fadeOut();

    $('#preloader').fadeOut('slow');
  });

  /* ==========================================================================
   parallax scrolling 
   ========================================================================== */

  if (
    !/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent || navigator.vendor || window.opera
    )
  ) {
    if ($(window).width() > 992) {
      skrollr.init({ forceHeight: false });
    }
    $(window).on('resize', function() {
      if ($(window).width() <= 992) {
        skrollr.init().destroy();
      }
    });
    $(window).on('resize', function() {
      if ($(window).width() > 992) {
        skrollr.init({ forceHeight: false });
      }
    });
  }

  /* ==========================================================================
   Tweet
   ========================================================================== */

  $('.tweet').twittie(
    {
      username: 'envatomarket', // change username here
      dateFormat: '%b. %d, %Y',
      template: '{{tweet}}',
      count: 10
    },
    function() {
      var item = $('.tweet ul');

      item
        .children('li')
        .first()
        .show()
        .siblings()
        .hide();
      setInterval(function() {
        item.find('li:visible').fadeOut(500, function() {
          $(this).appendTo(item);
          item
            .children('li')
            .first()
            .fadeIn(500);
        });
      }, 5000);
    }
  );

  /* ==========================================================================
   Smooth Scroll
   ========================================================================== */

  $('a[href*=#]:not([href=#])').click(function() {
    if (
      location.pathname.replace(/^\//, '') ==
        this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate(
          {
            scrollTop: target.offset().top - 40
          },
          1000
        );
        return false;
      }
    }
  });

  /* ==========================================================================
   Review slider
   ========================================================================== */

  $('.review-slider').slick({
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: false
  });

  /* ==========================================================================
     sub form
     ========================================================================== */

  $(document).ready(function() {
    function loading() {
      $('.result')
        .show()
        .html('Sending...');
    }

    function formResult(data) {
      $('.result').html(data);
      $('#mc-form input').val('');
    }

    function onSubmit() {
      $('#mc-form').submit(function() {
        var action = $(this).attr('action');
        loading();
        $.ajax({
          url: action,
          type: 'POST',
          data: {
            email: $('#mailchimp-email').val(),
            fname: $('#mailchimp-fname').val(),
            lname: $('#mailchimp-lname').val()
          },
          success: function(data) {
            formResult(data);
          },
          error: function(data) {
            formResult(data);
          }
        });
        return false;
      });
    }
    onSubmit();
  });

  /* ==========================================================================
       Contact Form
       ========================================================================== */

  $('#contact-form').validate({
    rules: {
      name: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true
      },

      message: {
        required: true,
        minlength: 10
      }
    },
    messages: {
      name:
        "<i class='fa fa-exclamation-triangle'></i>Please specify your name.",
      email: {
        required:
          "<i class='fa fa-exclamation-triangle'></i>We need your email address to contact you.",
        email:
          "<i class='fa fa-exclamation-triangle'></i>Please enter a valid email address."
      },
      message:
        "<i class='fa fa-exclamation-triangle'></i>Please enter your message."
    },
    submitHandler: function(form) {
      $(form).ajaxSubmit({
        type: 'POST',
        data: $(form).serialize(),
        url: 'php/contact-me.php',
        success: function() {
          $('#contact-form :input').attr('disabled', 'disabled');
          $('#contact-form').fadeTo('slow', 0.15, function() {
            $(this)
              .find(':input')
              .attr('disabled', 'disabled');
            $(this)
              .find('label')
              .css('cursor', 'default');
            $('.success-cf').fadeIn();
          });
          $('#contact-form')[0].reset();
        },
        error: function() {
          $('#contact-form').fadeTo('slow', 0.15, function() {
            $('.error-cf').fadeIn();
          });
        }
      });
    }
  });

  /* ==========================================================================
   ScrollTop Button
   ========================================================================== */

  $(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
      $('.scroll-top a').fadeIn(200);
    } else {
      $('.scroll-top a').fadeOut(200);
    }
  });

  $('.scroll-top a').click(function(event) {
    event.preventDefault();

    $('html, body').animate(
      {
        scrollTop: 0
      },
      1000
    );
  });

  /* ==========================================================================
   sticky nav
   ========================================================================== */

  var menu = $('.navbar');

  // var stickyNav = menu.offset().top;

  $(window).scroll(function() {
    if ($(window).scrollTop() > $(window).height()) {
      menu.addClass('stick');
    } else {
      menu.removeClass('stick');
    }
  });

  /* ==========================================================================
	   Collapse nav bar
	   ========================================================================== */
  $('.navbar-nav li a').on('click', function() {
    $('.navbar-collapse').collapse('hide');
  });

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
      var t = getTimeRemaining(endtime);

      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
  }

  var deadline = new Date(1529002823000);
  // initializeClock('clock', deadline);
});
