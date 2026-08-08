/* ==========================================================================
   HOTA TOUR & TRAVELS — MAIN JAVASCRIPT LOGIC
   ========================================================================== */

// Universal Form Submission Processor
function processFormSubmission(form, isModal = false) {
  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const emailInput = form.querySelector('[name="email"]');
  const dateInput = form.querySelector('[name="travel_date"]');
  const travellersInput = form.querySelector('[name="travellers"]');
  const serviceInput = form.querySelector('[name="service"], [name="service_required"]');
  const messageInput = form.querySelector('[name="message"]');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const date = dateInput ? dateInput.value : '';
  const travellers = travellersInput ? travellersInput.value : '';
  const service = serviceInput ? serviceInput.value : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name) {
    showToast('Please enter your full name', 'error');
    if (nameInput) nameInput.focus();
    return false;
  }

  if (!phone) {
    showToast('Please enter your mobile / phone number', 'error');
    if (phoneInput) phoneInput.focus();
    return false;
  }

  // Construct pre-filled WhatsApp message for instant delivery to travel desk
  let waMsg = `*New Puri Tour Enquiry*\n`;
  waMsg += `👤 *Name:* ${name}\n`;
  waMsg += `📞 *Phone:* ${phone}\n`;
  if (email) waMsg += `📧 *Email:* ${email}\n`;
  if (date) waMsg += `📅 *Travel Date:* ${date}\n`;
  if (travellers) waMsg += `👥 *Travellers:* ${travellers}\n`;
  if (service) waMsg += `🛕 *Service:* ${service}\n`;
  if (message) waMsg += `💬 *Note:* ${message}\n`;

  const waUrl = `https://wa.me/917873369103?text=${encodeURIComponent(waMsg)}`;

  showToast('✅ Thank You! Your enquiry has been submitted successfully. Connecting to WhatsApp...', 'success');

  form.reset();

  if (isModal) {
    const modal = document.getElementById('planTripModal');
    if (modal) modal.classList.remove('active');
  }

  // Redirect to WhatsApp in a new tab
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 600);

  return true;
}

// Helper to Create & Inject Modal HTML into Document Body
function ensureTripModalExists() {
  if (document.getElementById('planTripModal')) return;

  const modalHTML = `
    <div id="planTripModal" class="modal-overlay">
      <div class="modal-card">
        <button type="button" class="modal-close" id="modalCloseBtn" aria-label="Close Modal"><i class="fas fa-times"></i></button>

        <!-- Header & Branding -->
        <div class="modal-header text-center">
          <div class="modal-brand-tag">
            <i class="fas fa-gopuram"></i> Hota Tour & Travels
          </div>
          <h3 class="modal-title">Plan Your Puri Trip</h3>
          <p class="modal-subtitle">Get personalized guidance & travel quote in 30 minutes</p>
        </div>

        <!-- Trust Badge -->
        <div class="modal-trust-badge">
          <i class="fas fa-award text-gold"></i> 20+ Years of Experience &nbsp;|&nbsp; <i class="fas fa-users text-gold"></i> 1 Lakh+ Happy Visitors
        </div>

        <!-- Form -->
        <form id="modalEnquiryForm" action="#" method="POST" style="margin-top: 1.25rem;">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" name="name" class="form-control" placeholder="Enter full name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input type="tel" name="phone" class="form-control" placeholder="+91 9876543210" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" name="email" class="form-control" placeholder="name@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Travel Date</label>
              <input type="date" name="travel_date" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Number of Travellers</label>
              <select name="travellers" class="form-control">
                <option value="1 Person">1 Person (Solo)</option>
                <option value="2 Persons" selected>2 Persons (Couple)</option>
                <option value="3-5 Persons">3 - 5 Persons (Family)</option>
                <option value="6-10 Persons">6 - 10 Persons (Group)</option>
                <option value="10+ Persons">10+ Persons (Large Group)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tour / Service Required</label>
              <select name="service" class="form-control">
                <option value="Jagannath Temple Darshan Assistance">Jagannath Temple Darshan Assistance</option>
                <option value="Customized Tour Packages">Customized Tour Packages</option>
                <option value="Hotel Booking">Hotel Booking</option>
                <option value="Cab & Taxi Booking">Cab & Taxi Booking</option>
                <option value="Professional Tour Guides">Professional Tour Guides</option>
                <option value="Mahaprasad Arrangements">Mahaprasad Arrangements</option>
                <option value="Airport Transfers">Airport Transfers</option>
                <option value="Railway Station Transfers">Railway Station Transfers</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Message / Special Requests</label>
            <textarea name="message" class="form-control" rows="2" placeholder="Tell us about hotel preferences, senior citizen care, etc."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem; justify-content: center;">
            <i class="fas fa-paper-plane"></i> Get My Tour Quote
          </button>
        </form>
      </div>
    </div>
  `;

  if (document.body) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    attachModalHandlers();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      attachModalHandlers();
    });
  }
}

function attachModalHandlers() {
  const modal = document.getElementById('planTripModal');
  if (!modal) return;

  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('modalEnquiryForm');

  const closeModal = () => {
    modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  document.onkeydown = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  };

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      processFormSubmission(form, true);
    };
  }
}

// Global Function to Open Plan Your Puri Trip Modal
window.openPlanTripModal = function(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  
  ensureTripModalExists();
  
  const modal = document.getElementById('planTripModal');
  if (modal) {
    modal.classList.add('active');
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }
};

// Auto inject modal HTML immediately
ensureTripModalExists();

// Global Form Event Interceptor (Captures any form submission on page)
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (!form || form.tagName !== 'FORM') return;

  e.preventDefault();
  e.stopPropagation();

  const isModal = form.id === 'modalEnquiryForm';
  processFormSubmission(form, isModal);
}, true);

// Capture phase click interceptor to catch any CTA button click
document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (!target) return;

  // Don't intercept if clicking submit button inside a form
  if (target.getAttribute('type') === 'submit' || target.classList.contains('btn-submit')) {
    return;
  }

  const isPrimaryBtn = target.classList.contains('btn-primary') || target.classList.contains('btn-plan-trip');
  const href = target.getAttribute('href') || '';
  const text = target.innerText ? target.innerText.toLowerCase() : '';

  if (isPrimaryBtn || text.includes('plan your puri') || href.includes('contact.html')) {
    if (target.classList.contains('nav-link')) return;

    e.preventDefault();
    e.stopPropagation();
    openPlanTripModal(e);
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  ensureTripModalExists();

  // 1. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburgerToggle');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
});

// Toast Notification System
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6';
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

  toast.style.cssText = `
    background: ${bgColor};
    color: #FFFFFF;
    padding: 0.95rem 1.75rem;
    border-radius: 50px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.98rem;
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: auto;
  `;

  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}
