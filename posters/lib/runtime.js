(function () {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'))
    img.onload = () => {
      img.removeAttribute('data-src');
    }
  })
})()
