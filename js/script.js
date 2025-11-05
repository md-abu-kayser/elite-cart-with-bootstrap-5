// JS Start
// ----------------------------------------------------->
// Here is Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = "modern-blue";
    this.isDarkMode = false;
    this.init();
  }

  init() {
    this.loadPreferences();
    this.bindEvents();
    this.applyTheme();
    this.updateUI();
  }

  loadPreferences() {
    const savedTheme = localStorage.getItem("theme");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTheme) this.currentTheme = savedTheme;
    if (savedDarkMode) this.isDarkMode = JSON.parse(savedDarkMode);
  }

  bindEvents() {
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setTheme(e.target.dataset.theme);
      });
    });

    // Dark mode toggle
    document.getElementById("darkModeToggle").addEventListener("click", () => {
      this.toggleDarkMode();
    });

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Set initial value
      if (!localStorage.getItem("darkMode")) {
        this.isDarkMode = mediaQuery.matches;
        this.applyTheme();
      }

      // Listen For Changes
      mediaQuery.addEventListener("change", (e) => {
        if (!localStorage.getItem("darkMode")) {
          this.isDarkMode = e.matches;
          this.applyTheme();
          this.updateUI();
        }
      });
    }
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`.theme-btn.${themeName}`).classList.add("active");

    this.applyTheme();
    this.savePreferences();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.updateUI();
    this.savePreferences();
  }

  applyTheme() {
    const html = document.documentElement;

    // Apply color themes
    html.setAttribute("data-color-theme", this.currentTheme);

    // Apply dark and light mode
    if (this.isDarkMode) {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
  }

  updateUI() {
    const toggleBtn = document.getElementById("darkModeToggle");
    const icon = toggleBtn.querySelector("i");
    const text = toggleBtn.querySelector("span");

    if (this.isDarkMode) {
      icon.className = "fas fa-sun";
      text.textContent = "Light Mode";
    } else {
      icon.className = "fas fa-moon";
      text.textContent = "Dark Mode";
    }
  }

  savePreferences() {
    localStorage.setItem("theme", this.currentTheme);
    localStorage.setItem("darkMode", JSON.stringify(this.isDarkMode));
  }
}

// Product Management System
class ProductManager {
  constructor() {
    this.cart = [];
    this.wishlist = [];
    this.init();
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.updateCartBadge();
  }

  loadData() {
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");

    if (savedCart) this.cart = JSON.parse(savedCart);
    if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);
  }

  bindEvents() {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.addToCart(e.target.closest(".product-card"));
      });
    });

    // Wishlist buttons
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.toggleWishlist(e.target.closest(".product-card"));
      });
    });

    // View buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.quickView(e.target.closest(".product-card"));
      });
    });
  }

  addToCart(productCard) {
    const product = this.getProductData(productCard);

    this.cart.push(product);
    this.saveCart();
    this.showNotification("Product added to cart!", "success");
    this.updateCartBadge();
    this.animateButton(productCard.querySelector(".add-to-cart"));
  }

  toggleWishlist(productCard) {
    const productId = this.getProductId(productCard);
    const wishlistBtn = productCard.querySelector(".wishlist-btn");
    const icon = wishlistBtn.querySelector("i");
    const isInWishlist = this.wishlist.find((item) => item.id === productId);

    if (isInWishlist) {
      this.wishlist = this.wishlist.filter((item) => item.id !== productId);
      icon.className = "far fa-heart";
      this.showNotification("Removed from wishlist", "info");
    } else {
      const product = this.getProductData(productCard);
      this.wishlist.push(product);
      icon.className = "fas fa-heart";
      this.showNotification("Added to wishlist!", "success");
    }

    this.saveWishlist();
    this.animateButton(wishlistBtn);
  }

  quickView(productCard) {
    const product = this.getProductData(productCard);
    this.showNotification(`Quick view: ${product.name}`, "info");
  }

  getProductData(productCard) {
    return {
      id: this.getProductId(productCard),
      name: productCard.querySelector(".product-title").textContent,
      price: productCard.querySelector(".current-price").textContent,
      image: productCard.querySelector("img").src,
      description: productCard.querySelector(".product-description")
        .textContent,
    };
  }

  getProductId(productCard) {
    return productCard.dataset.productId || `product-${Date.now()}`;
  }

  animateButton(button) {
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "";
    }, 150);
  }

  updateCartBadge() {
    const cartBadge = document.querySelector(
      ".user-action-btn:nth-child(3) .action-badge"
    );
    if (cartBadge) {
      cartBadge.textContent = this.cart.length;
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

    // Add Styles
    Object.assign(notification.style, {
      position: "fixed",
      top: "100px",
      right: "20px",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      padding: "1rem 1.5rem",
      borderRadius: "var(--border-radius)",
      boxShadow: "var(--shadow-lg)",
      borderLeft: `4px solid ${this.getNotificationColor(type)}`,
      zIndex: "9999",
      transform: "translateX(400px)",
      transition: "transform 0.3s ease",
      maxWidth: "300px",
      border: "1px solid var(--border-color)",
    });

    document.body.appendChild(notification);

    // Animate In
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove After Selay
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  getNotificationColor(type) {
    const colors = {
      success: "var(--success-color)",
      error: "var(--error-color)",
      warning: "var(--warning-color)",
      info: "var(--primary-color)",
    };
    return colors[type] || "var(--primary-color)";
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(this.wishlist));
  }
}

// Search Functionality
class SearchManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");

    searchInput.addEventListener("input", (e) =>
      this.handleSearch(e.target.value)
    );
    searchBtn.addEventListener("click", () => this.performSearch());
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch();
    });
  }

  handleSearch(query) {
    console.log("Searching for:", query);
  }

  performSearch() {
    const query = document.querySelector(".search-input").value;
    if (query.trim()) {
      this.showNotification(`Searching for: ${query}`, "info");
    }
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--bg-primary);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            border-left: 4px solid var(--primary-color);
            z-index: 9999;
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }
}

// Newsletter Subscription
class NewsletterManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const form = document.querySelector(".newsletter-form form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    if (this.validateEmail(email)) {
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
        this.showSuccess();
        e.target.reset();
      }, 1500);
    } else {
      this.showError("Please enter a valid email address.");
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showLoading() {
    const submitBtn = document.querySelector(
      '.newsletter-form button[type="submit"]'
    );
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
  }

  hideLoading() {
    const submitBtn = document.querySelector(
      '.newsletter-form button[type="submit"]'
    );
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
    submitBtn.disabled = false;
  }

  showSuccess() {
    this.showNotification("Thank you for subscribing!", "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type) {
    alert(message);
  }
}

class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupScrollAnimations();
  }

  bindEvents() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Navbar scroll effect
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleScroll() {
    const navbar = document.querySelector(".navbar");
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      navbar.style.background = "var(--bg-primary)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.style.background = "";
      navbar.style.backdropFilter = "";
    }
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Elements for animation
    document
      .querySelectorAll(".product-card, .feature-card, .category-card")
      .forEach((el) => {
        observer.observe(el);
      });
  }
}

// DOM Load
document.addEventListener("DOMContentLoaded", function () {
  new ThemeManager();
  new ProductManager();
  new SearchManager();
  new NewsletterManager();
  new ScrollManager();

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
        .product-card, .feature-card, .category-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
  document.head.appendChild(style);
});

// Error Handling For Images
window.addEventListener(
  "error",
  function (e) {
    if (e.target.tagName === "IMG") {
      e.target.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
      e.target.alt = "Image not available";
    }
  },
  true
);

// JS End
