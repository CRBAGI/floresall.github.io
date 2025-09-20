document.addEventListener('click', function () {
  document.querySelectorAll('css-doodle').forEach(function (o) {o.update();});
});
document.addEventListener('touchstart', function () {
  document.querySelectorAll('css-doodle').forEach(function (o) {o.update();});
});