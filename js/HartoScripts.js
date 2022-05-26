
$(document).ready(function(){
  $('.lazy').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: true,
    speed: 500,
    cssEase: 'ease-out',
    prevArrow: '<img src="assets/img/H_e-UI-flecha-prev.png" class="slide-arrow prev-arrow">',
    nextArrow: '<img src="assets/img/H_e-UI-flecha-next.png" class="slide-arrow next-arrow">'
  });
});
