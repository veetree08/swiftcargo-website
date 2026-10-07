/* ============================================================
   SwiftCargo Logistics — Main JavaScript File
   ------------------------------------------------------------
   This file powers all the interactive behaviour of the website:
   mobile menu, smooth scrolling, scroll animations, the
   testimonial slider, gallery filtering + lightbox, FAQ accordion,
   form validation, the tracking simulator and the animated
   stat counters. It is loaded on every page.
   ============================================================ */

/* Wait for the HTML document to finish loading before running */
document.addEventListener("DOMContentLoaded", function () {

  /* ----------------------------------------------------------
     1. MOBILE NAVIGATION MENU
     Toggling the hamburger button opens / closes the mobile
     menu and animates the three lines into an "X".
     ---------------------------------------------------------- */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");   // animate the X icon
      navLinks.classList.toggle("open");    // slide the menu in
    });

    /* Close the mobile menu automatically when a link is tapped */
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ----------------------------------------------------------
     2. NAVBAR SHADOW ON SCROLL
     Adds a stronger shadow to the navbar once the user scrolls
     down the page, giving a subtle "sticky" effect.
     ---------------------------------------------------------- */
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add("navbar--scrolled");
      } else {
        navbar.classList.remove("navbar--scrolled");
      }
    }
  });

  /* ----------------------------------------------------------
     3. BACK-TO-TOP BUTTON
     Shows the floating button after scrolling 500px and scrolls
     smoothly back to the top when it is clicked.
     ---------------------------------------------------------- */
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     Uses an IntersectionObserver to add the .revealed class to
     elements as they enter the viewport, fading them in with a
     slight upward slide. Elements with .reveal start hidden.
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: if the browser has no observer, just show everything */
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  /* ----------------------------------------------------------
     5. ANIMATED STAT COUNTERS
     When the stats band scrolls into view, count the numbers
     up from zero to their final value over ~1.6 seconds.
     ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll("[data-count]");

  if (statNumbers.length) {
    const countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-count"), 10);
            const duration = 1600;          // milliseconds
            const startTime = performance.now();

            function update(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              /* Ease-out curve so the counter slows near the end */
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString();
              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = target.toLocaleString();
              }
            }
            requestAnimationFrame(update);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    statNumbers.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     6. TESTIMONIAL SLIDER
     Slides through the testimonial cards one at a time using a
     flex track. Supports prev/next buttons and auto-play.
     ---------------------------------------------------------- */
  const track = document.querySelector(".testimonial-track");
  const slides = track ? track.children : [];

  if (track && slides.length > 1) {
    let index = 0;
    let autoTimer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length; // wrap around
      track.style.transform = "translateX(-" + index * 100 + "%)";
    }

    /* Wire up the prev / next arrow buttons */
    const prevBtn = document.querySelector(".testimonial__prev");
    const nextBtn = document.querySelector(".testimonial__next");

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); restartAuto(); });

    /* Auto-advance every 6 seconds */
    function restartAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(index + 1); }, 6000);
    }
    restartAuto();
  }

  /* ----------------------------------------------------------
     7. GALLERY FILTERING + LIGHTBOX
     Filter buttons show/hide gallery tiles by category, and
     clicking a tile opens the full-screen lightbox viewer.
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  /* Filtering */
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      /* Highlight the active filter button */
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      galleryItems.forEach(function (item) {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  /* Lightbox */
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = document.querySelector(".lightbox img");
  const lightboxCaption = document.querySelector(".lightbox__caption");
  const lightboxClose = document.querySelector(".lightbox__close");

  if (lightbox && galleryItems.length) {
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        const img = item.querySelector("img");
        const caption = item.querySelector(".gallery-item__overlay h3");
        if (img) lightboxImg.src = img.src;
        if (caption) lightboxCaption.textContent = caption.textContent;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden"; // stop page scroll
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", closeLightbox);
    /* Click anywhere outside the image also closes it */
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    /* The Escape key closes it too */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ----------------------------------------------------------
     8. FAQ ACCORDION
     Clicking a question expands its answer. Only one answer is
     open at a time.
     ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-item__q");
    const answer = item.querySelector(".faq-item__a");

    question.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");

      /* Close every item first */
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        const otherAnswer = other.querySelector(".faq-item__a");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      /* Then open the clicked one (if it was closed) */
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ----------------------------------------------------------
     9. CONTACT FORM VALIDATION
     Checks required fields and email format before "sending".
     Shows inline error messages and a success banner.
     ---------------------------------------------------------- */
  const contactForm = document.querySelector("#contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // stop the page from reloading

      let valid = true;

      /* Helper: validate a single field */
      function validateField(input, check) {
        const group = input.closest(".form-group");
        if (!group) return;
        const ok = check(input.value.trim());
        group.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      }

      /* Name — must not be empty */
      const name = contactForm.querySelector("#name");
      validateField(name, function (v) { return v.length >= 2; });

      /* Email — must match a simple email pattern */
      const email = contactForm.querySelector("#email");
      validateField(email, function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      });

      /* Phone — must not be empty */
      const phone = contactForm.querySelector("#phone");
      validateField(phone, function (v) { return v.length >= 7; });

      /* Subject — must not be empty */
      const subject = contactForm.querySelector("#subject");
      validateField(subject, function (v) { return v.length >= 3; });

      /* Message — must be at least 10 characters */
      const message = contactForm.querySelector("#message");
      validateField(message, function (v) { return v.length >= 10; });

      /* Clear the error state as the user types */
      contactForm.querySelectorAll("input, textarea").forEach(function (input) {
        input.addEventListener("input", function () {
          input.closest(".form-group").classList.remove("invalid");
        });
      });

      /* If everything passed, show the success message */
      if (valid) {
        const success = contactForm.querySelector(".form-success");
        success.classList.add("show");
        contactForm.reset();
        setTimeout(function () { success.classList.remove("show"); }, 6000);
      }
    });
  }

  /* ----------------------------------------------------------
     10. TRACKING SIMULATOR
     The tracking forms (hero strip + tracking section) accept a
     tracking number and show a simulated shipment status with a
     progress timeline.
     ---------------------------------------------------------- */
  const trackingForms = document.querySelectorAll(".tracking-form, .track-strip");

  trackingForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const input = form.querySelector("input[type='text'], input[type='search']");
      const number = input ? input.value.trim() : "";

      /* The tracking result panel lives on the home page */
      const result = document.querySelector(".tracking-result");

      if (!result) {
        /* If no panel exists (e.g. hero strip), scroll to the panel */
        const panel = document.querySelector("#tracking");
        if (panel) panel.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (number.length < 5) {
        alert("Please enter a valid tracking number (at least 5 characters).");
        return;
      }

      /* Display the entered number and reveal the status panel */
      const numberEl = result.querySelector(".tracking-result__number");
      if (numberEl) numberEl.textContent = number.toUpperCase();
      result.classList.add("show");
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ----------------------------------------------------------
     11. NEWSLETTER FORM
     Subscribes the user in the footer without reloading the page.
     ---------------------------------------------------------- */
  const newsletterForms = document.querySelectorAll(".newsletter");

  newsletterForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector("input");
      const email = input ? input.value.trim() : "";

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address to subscribe.");
        return;
      }

      input.value = "";
      alert("Thank you for subscribing to our newsletter!");
    });
  });

});
