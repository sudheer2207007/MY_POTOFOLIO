ScrollReveal().reveal('.hero-left', { origin: 'left', distance: '50px', duration: 1000, delay: 300 });
ScrollReveal().reveal('.hero-right', { origin: 'right', distance: '50px', duration: 1000, delay: 500 });
ScrollReveal().reveal('.navbar', { origin: 'top', distance: '20px', duration: 800, delay: 200 });

ScrollReveal().reveal('.about-img', {
  origin: 'left',
  distance: '50px',
  duration: 1000,
  delay: 200
});
ScrollReveal().reveal('.about-content', {
  origin: 'right',
  distance: '50px',
  duration: 1000,
  delay: 300
});


ScrollReveal().reveal('.contact-section', {
  origin: 'bottom',
  distance: '60px',
  duration: 1000,
  delay: 300,
});
<script>
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check for previous mode in localStorage
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
      toggle.textContent = "☀️";
    } else {
      localStorage.setItem("dark-mode", "disabled");
      toggle.textContent = "🌙";
    }
  });
</script>
