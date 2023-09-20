let buttonTog = document.querySelector('.main-nav__toggle');
let navigation = document.querySelector('.site-list--hidden');

buttonTog.onclick = function () {
  navigation.classList.toggle('site-list--hidden');
  buttonTog.classList.toggle('main-nav__toggle');
};
