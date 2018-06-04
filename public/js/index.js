(function($) {
  "use strict"; // Start of use strict
  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  })
  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });
  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
  // Scroll to top button appear
  $('.content-wrapper').scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip()
  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('.content-wrapper').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

  // navigation menu (top)
  if(isConnected() && isMaster()) {
    $('#navbar-top').html('' +
    '<li class="nav-item dropdown">' +
      '<a class="nav-link dropdown-toggle mr-lg-2" id="userDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fa fa-fw fa-user"></i> Signed as ' + getUserName() + ' (master)' +
      '</a>' +
      '<div class="dropdown-menu" aria-labelledby="userDropdown">' +
        '<a class="dropdown-item" href="profile.html">' +
          '<strong>My Profile</strong>' +
          '<div class="dropdown-message small">Your personnal information</div>' +
        '</a>' +
        '<div class="dropdown-divider"></div>' +
        '<a class="dropdown-item" href="admin.html">' +
          '<strong>Admin</strong>' +
          '<div class="dropdown-message small">Manage user permissions</div>' +
        '</a>' +
      '<div>' +
    '</li>' +
    '<li class="nav-item">' +
      '<a class="nav-link" href="/api/user/logout">' +
        '<i class="fa fa-fw fa-sign-out"></i>Logout</a>' +
    '</li>');
  } else if(isConnected()) {
    $('#navbar-top').html('' +
    '<li class="nav-item dropdown">' +
      '<a class="nav-link dropdown-toggle mr-lg-2" id="userDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fa fa-fw fa-user"></i> Signed as ' + getUserName() + ' (master)' +
      '</a>' +
      '<div class="dropdown-menu" aria-labelledby="userDropdown">' +
        '<a class="dropdown-item" href="profile.html">' +
          '<strong>My Profile</strong>' +
          '<div class="dropdown-message small">Your personnal information</div>' +
        '</a>' +
      '<div>' +
    '</li>' +
    '<li class="nav-item">' +
      '<a class="nav-link" href="/api/user/logout">' +
        '<i class="fa fa-fw fa-sign-out"></i>Logout</a>' +
    '</li>');
  } else {
    $('#navbar-top').html('' +
    '<li class="nav-item">' +
      '<a class="nav-link" href="login.html">' +
        '<i class="fa fa-fw fa-sign-in"></i>Login</a>' +
    '</li>');
  }


  // -------------------------- Functions -------------------------- //

  function isConnected() {
    var res = false;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = !user.error;
      }
    });
    return res;
  }

  function hasWritePermission() {
    var res = false;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = user['write_permission'];
      }
    });
    return res;
  }

  function isMaster() {
    var res = false;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = user.master;
      }
    });
    return res;
  }

  function getUserName() {
    var res;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = user.name;
      }
    });
    return res;
  }

  function getMasterList() {
    var res = "";
    $.ajax({
      type: 'GET',
      url: 'api/user/master',
      async: false,
      success: function(masters) {
        masters.forEach(function(master){
          res += master.firstname + ' ' + master.lastname + ': ' + master.email + '\n';
        });
      }
    });
    return res;
  }

})(jQuery); // End of use strict
