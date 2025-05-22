let isMenuOpen = true;

const menuButton = document.querySelector(".menu-btn");

menuButton.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    if(isMenuOpen){
        menuButton.classList.add('open')
    }
    else{
        menuButton.classList.remove('open')
    }
})


document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuBtn.classList.toggle("open"); // Optional: animate hamburger icon
  });
});
