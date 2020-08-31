let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  //init controller
  controller = new ScrollMagic.Controller();
  //select some things
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  //loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    //GSAP - create a timeline
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" }); //take the thing you want to animate, where it should animate from
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1"); //means it's gonna animate 1 second sooner
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    // slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");

    //Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false, //make it not go back to normal
    })
      .setTween(slideTl) //pass the timeline from GSAP <3
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);

    //Define new animation
    const pageTl = gsap.timeline();
    let nextSlide = slide.length - 1 === index ? "end" : slides[index + 1]; //? is if : is else
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" }); //take some time to arrive after scroll
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    //Create new Scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%", //during the whole page
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false }) //when trigger hits the start page, this section of the page get stuck in one place + no black space
      .setTween(pageTl)
      .addTo(controller);
  });
}
const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseTxt.innerText = "";
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}

//Barba page transition
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      // animate slide only when we arrive into the home
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      //get rid of them when leave
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 }); //fade out container
        //swipe colored divs early with the delay
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "O%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        //An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        //start leaving the other way
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "100%", stagger: 0.15, onComplete: done } //stagger : delay between each of the swipe 1 by 1
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav-heaver",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      },
    },
  ],
});

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defualts: { duration: 1 } });
    let nextSlide = slide.length - 1 === index ? "end" : slides[index + 1]; //? is if : is else
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1.25");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "detailscene",
      })
      .addTo(controller);
  });
}

//event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
