/*
 Theme Name:    Marcelo Davanzo Portfolio
 Theme URI:     http://www.marcelodavanzo.com
 Description:   Marcelo Davanzo Portfolio Theme
 Author:        Marcelo Davanzo
 Author URI:    http://www.marcelodavanzo.com
 Template:      twentythirteen
 Version:       1.0.0
*/

var clickHandler  = ('ontouchstart' in document.documentElement ? 'touchend' : 'click'),
    downHandler   = ('ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown'),
    headerHeight;

/* --------------------------------
// DEV MODE TOGGLE
-------------------------------- */
$(document).on(clickHandler, '.header-nav .copy h2', function(){
  $('body').toggleClass('devMode');
});

/* --------------------------------
// DETECT PAGE AND ACT ACCORDINGLY
-------------------------------- */
$(window).on('load', function(){
  if ( $('body').hasClass('home') ) {
    homePageStart();
  } else if ( $('body').hasClass('project') || $('body').hasClass('error404') ) {
    //if more than one slide
    if ( $('.swiper-slide').length > 1 ) {
      projectPageStart();
    } else {
      $('.swiper-container').addClass('single');
    }
    stickyNavAutohide();
  }
});

/* --------------------------------
// HOME PAGE
-------------------------------- */
function homePageStart(){
  //console.log('HOME PAGE');
  getDribbbleUser();
  killLoader();
  dribbbleWaypoints();
  parallaxHeader();
}

/* --------------------------------
// PROJECT PAGE
-------------------------------- */
function projectPageStart(){
  //console.log('PROJECT PAGE');
  startMoreSwiper();
}

  // MORE SWIPER - only on project and error404 pages
  function startMoreSwiper(){
    var moreSwiper = new Swiper('.swiper-container', {
        pagination:'.swiper-pagination',
        nextButton:'.swiper-button-next',
        prevButton:'.swiper-button-prev',
        slidesPerView:1,
        paginationClickable:true,
        spaceBetween:0,
        loop:true,
        autoplay:5000,
        autoplayDisableOnInteraction:true,
        grabCursor:true
    });
  }

  // BURGER TOGGLE
  $(document).on(clickHandler, '.header-nav .burger', function(){
    $('.header-nav').toggleClass('open');
  });

  // CLICKING ANYWHERE CLOSES MENU
  $('body').on(downHandler, function(evt) {
    if ( evt.target.id == '.header-nav.open')
      return;
    // DESCENDANTS
    if ( $(evt.target).closest('.header-nav.open').length)
      return;
      menuClose();
  });

  function menuClose(){
    $('.header-nav').removeClass('open');
  }

/* --------------------------------
// DRIBBBLE API
-------------------------------- */
var dribbbleShots,
    dribbbleToken  = '5d033ab7a2975f939dbdd073dd449c5c3dd0862b34cde6d22d8a49cf797e9761',
    dribbbleUser   = 'nathalycoutinho';

// get total shots
function getDribbbleUser(){
  $.jribbble.setToken(dribbbleToken);

  $.jribbble.users(dribbbleUser).then(function(user) {
    dribbbleShots = user.shots_count;
    getDribbbleShots();
  });

}//fetchDribbble()

// fetch all shots
function getDribbbleShots(){
  $.jribbble.users(dribbbleUser).shots({per_page:dribbbleShots}).then(function(shots) {
    var html = [];

    //console.log(shots);

    shots.forEach(function(shot, i) {
      var id                = shot.id,
          image_hidpi       = shot.images.hidpi,
          image_normal      = shot.images.normal,
          image_teaser      = shot.images.teaser,
          likes_count       = shot.likes_count,
          views_count       = shot.views_count,
          title             = shot.title,
          url               = shot.html_url,
          myDelay           = i*60+'ms';

      //console.log(title, id, url, likes_count, views_count);

      html += '<li style="transition-delay:' + myDelay + '; -webkit-transition-delay:' + myDelay + '">';
      html +=   '<a href="' + url + '" target="_blank">';
      html +=     '<div class="info flex-it flex-align-item-end">';
      html +=       '<div class="details flex-it flex-align-item-center flex-justify-between">';
      html +=         '<h2 class="views_count"><svg class="icon-eye"><use xlink:href="#eye"></use></svg>' + views_count + '</h2>';
      html +=         '<h2 class="likes_count"><svg class="icon-heart"><use xlink:href="#heart"></use></svg>' + likes_count + '</h2>';
      html +=       '</div>';
      html +=     '</div>';
      html +=     '<img src="' + image_normal + '" alt="' + title + '" />';
      html +=   '</a>';
      html += '</li>';

      //console.log('my delay will be '+ myDelay);
    });

    $('.dribbble ul').html(html);
	});
} //getShots()

  // KILL LOADER FN
  function killLoader(){
    $('.header-nav').removeClass('loading');
    // GET HEADER HEIGHT
    setTimeout(function(){
      headerHeight = $('.header-nav').outerHeight();
      //console.log('header height is '+ headerHeight);
    }, 1200);
  }

/* --------------------------------
// WAYPOINTS
-------------------------------- */
function dribbbleWaypoints(){
  var dribbbleVisibility = $('#dribbble').waypoint(function(direction) {
    //console.log(this.element.id + ' hit');
    $('#dribbble').addClass('visible').removeClass('loading');
  }, {
    offset: '50%'
  });
}

/* --------------------------------
// AUTOHIDE STICKY NAV
-------------------------------- */
function stickyNavAutohide(){
  var didScroll,
      lastScrollTop = 0,
      delta         = 50,
      navbarHeight  = $('.header-nav').outerHeight();

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
      return;

    if (st > lastScrollTop && st > navbarHeight){
      // Scroll Down
      $('body').addClass('hide-nav');
    } else {
      // Scroll Up
      if(st + $(window).height() < $(document).height()) {
        $('body').removeClass('hide-nav');
      }
    }

    lastScrollTop = st;
  }
}

/* --------------------------------
// PARALLAX ON HEADER
-------------------------------- */
function parallaxHeader(){
  if ( $('html').hasClass('no-touch') && !$('html').hasClass('-ms-') ) {
    var headerHeight = $('.header-nav').outerHeight() - 175;
    $('.brand').attr('data-top-bottom','transform:translate3d(0px,' + headerHeight + 'px,0px)');
    $('.brand, .copy, .location').addClass('notransition');

    // Init Skrollr
    skrollr.init({
      forceHeight:true,
      smoothScrolling:true,
      render:function(data) {
        //Debugging - Log the current scroll position.
        //console.log('data.curTop: ' + data.curTop);
      }
    });
  }

  $(window).on('resize', function(){
    skrollr.get().refresh();
  });
}

/////////////////////////////////////////////////////////////////////////

function headerParallax(){
  var progress = ((scrolled / headerHeight) * 100).toFixed(0);
  //console.log(progress);

  function translateY(ratio) { // ratio is the original value of the property
  	var transX = (scrolled / ratio);
    return transX;
  }

  function scale(start,end) { // ratio is the original value of the property
  	var scale = start - ( progress / 100 ) * (1 - end);
    return scale;
  }
  //'scale3d('+ scale(1,0.75) +','+ scale(1,0.75) +',1)'

  function opacity(start,end) { // ratio is the original value of the property
  	var opacity = start - ( progress / 100 );
    return opacity.toFixed(2);
  }
  //opacity:opacity(1,0)

  function blur(start,end) {
  	var blur = start + ( progress / end );
    return blur.toFixed(1);
  }
  //'-webkit-filter':'blur('+ blur(0,10) +'px)'

  $('.header-nav .brand').addClass('notransition').css({transform:'translate3d(0,'+ translateY(1.7) +'px,0)'});
  $('.header-nav .copy').addClass('notransition').css({transform:'translate3d(0,-'+ translateY(4) +'px,0) scale3d('+ scale(1,0.85) +','+ scale(1,0.85) +',1)', opacity:opacity(1,0)});
  $('.header-nav .location').addClass('notransition').css({opacity:opacity(0.7,0)});
}
