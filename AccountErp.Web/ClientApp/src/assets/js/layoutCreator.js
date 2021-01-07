$(document).ready(function() {
    $(".nav-collapse-btn-lg").click(function() {
      $(".sidebar").toggleClass("bar-collapse");
      // $('body').toggleClass("sidebar-collapse");
    });

    if ($(window).width() <= 767) {
      $(".card-body ul li a").click(function() {
        $(".gray-area").hide(200);
        $(".detail-area").show(200);
      });
      $(".detail-back-btn").click(function() {
        $(".gray-area").show(200);
        $(".detail-area").hide(200);
      });
    }
    s;
  });

  function setNav() {
    if ($(window).width() < 767) {
      $("div#demo").addClass("collapse");
    } else {
      $("div#demo").removeClass("collapse");
    }
  }
  setNav();
  $(window).resize(function() {
    setNav();
  });