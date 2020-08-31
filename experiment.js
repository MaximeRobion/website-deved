// const hikeExp = document.querySelector(".hike-exp");
// const slide = document.querySelector(".hike");

// //KINDA OLD SCHOOL SCROLLING
// window.addEventListener("scroll", scrollReveal);

// function scrollReveal() {
//   const hikePos = hikeExp.getBoundingClientRect().top; //get the poisition of the scroll from the top
//   const windowHeight = window.innerHeight / 1.5; //height of the window
//   if (hikePos < windowHeight) {
//     hikeExp.style.color = "red";
//   }
// }

// //INTERSECTION OBSERVER : WHEN IT COMES UP TO VUE/WHEN IT CROSS THE INTERSECTION
// let options = {
//   threshold: 0.5,
// };

// let observer = new IntersectionObserver(slideAnimation, options);

// function slideAnimation(entries) {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       slide.style.background = "white";
//     }
//   });
// }

// observer.observe(slide);

//SCROLL MAGIC
const controller = new ScrollMagic.Controller();

const exploreScene = new ScrollMagic.Scene({
  triggerElement: ".hike-exp",
  triggerHook: 0.5,
})
  .addIndicators({ colorStart: "white", colorTrigger: "orange" })
  .setClassToggle(".hike-exp", "active")
  .addTo(controller);
