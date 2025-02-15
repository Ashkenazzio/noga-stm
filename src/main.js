import Swiper from 'swiper';
import { Navigation } from 'swiper/modules'; // <- Correct module path
import 'swiper/css';
import 'swiper/css/navigation';

const swiper = new Swiper('.swiper', {
  modules: [Navigation],
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
