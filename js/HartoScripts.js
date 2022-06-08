
$(document).ready(function(){
  $('.lazy').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 750,
    cssEase: 'ease-out',
    prevArrow: '<img src="assets/img/H_e-UI-flecha-prev.png" class="slide-arrow prev-arrow">',
    nextArrow: '<img src="assets/img/H_e-UI-flecha-next.png" class="slide-arrow next-arrow">'
  });

  $('.autoplay').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
  autoplay: true,
  autoplaySpeed: 2000,
  });

});
