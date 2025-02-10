const swiper = new Swiper('.swiper', {
  spaceBetween: 16,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    768: {
      slidesPerView: 'auto',
    },
  },
});

// document.addEventListener('DOMContentLoaded', function () {
//   const image = document.querySelector('.method-card__img--image.second');
//   image.onload = function () {
//     image.style.top = '-145%'; // Apply positioning after load
//   };
// });
