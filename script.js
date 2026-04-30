let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const modeToggle = document.getElementById("modeToggle");
  const cards = document.querySelectorAll(".product-card");
  const productsSections = document.querySelectorAll(".products, .section-block");
  const favBtn = document.getElementById("favBtn");
  const clearCartBtn = document.getElementById("clear-cart");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" && modeToggle) {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☀️";
  }

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      modeToggle.textContent = isDark ? "☀️" : "🌙";
    });
  }

  let favActive = localStorage.getItem("fav") === "true";
  if (favBtn) {
    if (favActive) favBtn.classList.add("active-fav");

    favBtn.addEventListener("click", () => {
      favActive = !favActive;
      localStorage.setItem("fav", favActive);
      favBtn.classList.toggle("active-fav");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const value = searchInput.value.trim().toLowerCase();

      productsSections.forEach((section) => {
        const sectionCards = section.querySelectorAll(".product-card");
        let sectionHasVisible = false;

        sectionCards.forEach((card) => {
          const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
          const meta = card.querySelector(".product-meta")?.textContent.toLowerCase() || "";
          const match = title.includes(value) || meta.includes(value);

          card.style.display = match || value === "" ? "block" : "none";
          if (match || value === "") sectionHasVisible = true;
        });

        if (section.classList.contains("products") || section.classList.contains("section-block")) {
          section.style.display = sectionHasVisible || value === "" ? "" : "none";
        }
      });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  cards.forEach((card) => observer.observe(card));

  cards.forEach((card) => {
    const button = card.querySelector(".card-btn");
    if (button) {
      button.addEventListener("click", () => {
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const existingProduct = cart.find((item) => item.name === name);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({ name, price, quantity: 1 });
        }

        saveCart();
        updateCart();
      });
    }
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      saveCart();
      updateCart();
    });
  }

  updateCart();
});

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function scrollToCart() {
  const cartSection = document.querySelector(".cart-section");
  if (cartSection) {
    cartSection.scrollIntoView({ behavior: "smooth" });
  }
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const cartBadge = document.getElementById("cart-badge");

  let totalItems = 0;
  let totalPrice = 0;

  if (cartItemsContainer) cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    if (cartItemsContainer) {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.price} DH x ${item.quantity}</p>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${index})">Supprimer</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    }
  });

  if (cartCount) cartCount.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = totalPrice.toFixed(2);
  if (cartBadge) cartBadge.textContent = totalItems;
}

function changeQty(index, change) {
  if (!cart[index]) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}
function showTab(tabId, btn) {
  const tabs = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabs.forEach(tab => tab.classList.remove("active-tab"));
  tabButtons.forEach(button => button.classList.remove("active"));

  document.getElementById(tabId).classList.add("active-tab");
  btn.classList.add("active");
}

function animateStatus(message) {
  const status = document.getElementById("accountStatus");
  if (!status) return;

  status.classList.remove("show-status");
  void status.offsetWidth;
  status.textContent = message;
  status.classList.add("show-status");
}

function registerUser() {
  const name = document.getElementById("registerName")?.value.trim();
  const email = document.getElementById("registerEmail")?.value.trim();
  const password = document.getElementById("registerPassword")?.value.trim();

  if (!name || !email || !password) {
    animateStatus("Remplis tous les champs.");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("connected", "true");

  animateStatus("Inscription réussie ✅");
  updateWelcomeMessage();

  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";
}

function loginUser() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("connected", "true");
    animateStatus("Connexion réussie ✅");
    updateWelcomeMessage();
  } else {
    animateStatus("Email ou mot de passe incorrect ❌");
  }
}

function logoutUser() {
  localStorage.removeItem("connected");
  animateStatus("Déconnexion réussie.");
  updateWelcomeMessage();
}

function updateWelcomeMessage() {
  const welcome = document.getElementById("welcomeMessage");
  const user = JSON.parse(localStorage.getItem("user"));
  const connected = localStorage.getItem("connected");

  if (!welcome) return;

  if (user && connected === "true") {
    welcome.textContent = "Bonjour " + user.name + " 👋";
  } else {
    welcome.textContent = "Inscris-toi ou connecte-toi";
  }
}

document.addEventListener("DOMContentLoaded", updateWelcomeMessage);