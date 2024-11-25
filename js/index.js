// Track the current step
let currentStep = 1;
const totalSteps = 4;

// Helper functions
const toggleClass = (element, className, add) => {
  if (add) element.classList.add(className);
  else element.classList.remove(className);
};

const getStepElement = (step, type) => document.getElementById(`step${step}${type}`);

// Step navigation
function showStep(step) {
  // Perbarui langkah saat ini
  currentStep = step;

  // Perbarui konten dan lingkaran langkah
  for (let i = 1; i <= totalSteps; i++) {
    toggleClass(getStepElement(i, 'Content'), 'hidden', i !== step);
    toggleClass(getStepElement(i, 'Circle'), 'active-step-circle', i === step);
  }

  // Perbarui tombol Desktop
  const backButtonDesktop = document.querySelector('.go-back-button');
  const nextButtonDesktop = document.querySelector('.next-step-button');

  // Perbarui tombol Mobile
  const backButtonMobile = document.querySelector('.go-back-button-mobile');
  const nextButtonMobile = document.querySelector('.next-step-button-mobile');

  // Tombol Back
  if (step === 1) {
    backButtonDesktop.classList.add('hidden');
    backButtonMobile.classList.add('hidden');
  } else {
    backButtonDesktop.classList.remove('hidden');
    backButtonMobile.classList.remove('hidden');
  }

  // Tombol Next
  if (step === totalSteps) {
    nextButtonDesktop.textContent = 'Confirm';
    nextButtonMobile.textContent = 'Confirm';
  } else {
    nextButtonDesktop.textContent = 'Next Step';
    nextButtonMobile.textContent = 'Next Step';
  }

  // Tindakan khusus untuk langkah 3 (contoh)
  if (step === 3) {
    const isYearly = document.getElementById('billingToggle')?.checked || false;
    updateStep3Prices(isYearly);
  }

  // Tampilkan "Thank You" saat di langkah terakhir
  if (step > totalSteps) {
    document.getElementById('thankYou').classList.remove('hidden');
    backButtonDesktop.classList.add('hidden');
    nextButtonDesktop.classList.add('hidden');
    backButtonMobile.classList.add('hidden');
    nextButtonMobile.classList.add('hidden');
  }
}


function nextStep() {
  // Validate steps and move to the next step
  if (currentStep === 1 && !validateStep1()) return;
  // Validasi langkah 2: Pastikan pengguna memilih paket
  if (currentStep === 2) {
    if (!selectedPlan.name) {
      showPopup('Please select a plan before proceeding.');
      return;
    }
  }

  // Validasi langkah 3: Pastikan pengguna memilih setidaknya satu add-on
  if (currentStep === 3) {
    if (selectedAddons.length === 0) {
      showPopup('Please select at least one add-on before proceeding.');
      return;
    }
    updateStep4Summary(); // Perbarui ringkasan untuk langkah 4
  }

  // Lanjutkan ke langkah berikutnya
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  } else if (currentStep === totalSteps) {
    // Tampilkan layar "Thank You"
    document.getElementById('step4Content').classList.add('hidden'); // Sembunyikan Step 4
    document.getElementById('thankYou').classList.remove('hidden'); // Tampilkan layar Thank You

    // Sembunyikan tombol Go Back dan Next Step
    document.querySelector('.go-back-button').classList.add('hidden');
    document.querySelector('.next-step-button').classList.add('hidden');
    document.querySelector('.go-back-button-mobile').classList.add('hidden');
    document.querySelector('.next-step-button-mobile').classList.add('hidden');
  }
}

function previousStep() {
  // Move to the previous step
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

// Step 1 Validation
function validateStep1() {
  let isValid = true;

  const inputs = {
    name: document.querySelector('#step1Content input[type="text"]'),
    email: document.querySelector('#step1Content input[type="email"]'),
    phone: document.querySelector('#step1Content input[type="tel"]')
  };

  // Validate inputs
  if (!inputs.name.value.trim()) {
    setError(inputs.name, "This Field is required");
    isValid = false;
  } else clearError(inputs.name);

  if (!inputs.email.value.trim()) {
    setError(inputs.email, "This Field is required");
    isValid = false;
  } else if (!isValidEmail(inputs.email.value.trim())) {
    setError(inputs.email, "Please enter a valid email");
    isValid = false;
  } else clearError(inputs.email);

  if (!inputs.phone.value.trim()) {
    setError(inputs.phone, "This Field is required");
    isValid = false;
  } else if (!/^\+?\d+$/.test(inputs.phone.value.trim())) {
    setError(inputs.phone, "Phone number must contain only digits");
    isValid = false;
  } else clearError(inputs.phone);

  return isValid;
}

function setError(input, message) {
  const parent = input.parentElement;
  input.classList.add('border-red-500');

  let error = parent.querySelector('.error-message');
  if (!error) {
    error = document.createElement('p');
    error.className = 'error-message text-red-500 text-sm mt-1';
    parent.appendChild(error);
  }
  error.innerText = message;
}

function clearError(input) {
  const parent = input.parentElement;
  input.classList.remove('border-red-500');
  const error = parent.querySelector('.error-message');
  if (error) parent.removeChild(error);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Update Plan Prices
function updatePlanPrices(isYearly) {
  const prices = {
    arcade: document.querySelector('#step2Content .arcade-price'),
    advanced: document.querySelector('#step2Content .advanced-price'),
    pro: document.querySelector('#step2Content .pro-price')
  };

  const yearlyPrices = { arcade: '$90/yr', advanced: '$120/yr', pro: '$150/yr' };
  const monthlyPrices = { arcade: '$9/mo', advanced: '$12/mo', pro: '$15/mo' };

  const updatedPrices = isYearly ? yearlyPrices : monthlyPrices;

  prices.arcade.textContent = updatedPrices.arcade;
  prices.advanced.textContent = updatedPrices.advanced;
  prices.pro.textContent = updatedPrices.pro;
}

function updateStep3Prices(isYearly) {
  const prices = document.querySelectorAll('.price');

  prices.forEach(price => {
    const monthlyPrice = parseInt(price.getAttribute('data-monthly'));
    const yearlyPrice = parseInt(price.getAttribute('data-yearly'));

    const displayPrice = isYearly ? yearlyPrice : monthlyPrice;
    price.textContent = `+${displayPrice}${isYearly ? '/yr' : '/mo'}`;
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const billingToggle = document.getElementById('billingToggle');
  const monthlyText = document.getElementById('monthlyText');
  const yearlyText = document.getElementById('yearlyText');

  // Pastikan toggle berada dalam status "Monthly" (tidak dicentang) saat halaman dimuat
  if (billingToggle && !billingToggle.checked) {
    // Set tulisan untuk Monthly dan Yearly sesuai posisi toggle
    monthlyText.classList.add('text-blue-600');
    monthlyText.classList.remove('text-gray-400');
    yearlyText.classList.add('text-gray-400');
    yearlyText.classList.remove('text-blue-600');

    // Update harga untuk "Monthly" jika toggle tidak dicentang
    updatePlanPrices(false);
  }

  // Update Plan Prices on toggle change
  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      isMonthly = !e.target.checked; // Update isMonthly based on toggle
      updatePlanPrices(e.target.checked);
      updateStep3Prices(e.target.checked);

      // Change text color based on toggle state
      if (e.target.checked) {
        monthlyText.classList.add('text-gray-400');
        monthlyText.classList.remove('text-blue-600');
        yearlyText.classList.add('text-blue-600');
        yearlyText.classList.remove('text-gray-400');
      } else {
        monthlyText.classList.add('text-blue-600');
        monthlyText.classList.remove('text-gray-400');
        yearlyText.classList.add('text-gray-400');
        yearlyText.classList.remove('text-blue-600');
      }
    });
  }
  // Perbarui harga awal saat halaman dimuat
  const initialIsYearly = billingToggle?.checked || false;
  updateStep3Prices(initialIsYearly);
});

let selectedPlan = {};
let selectedAddons = []; // Menyimpan add-on yang dipilih
let isMonthly = true;    // Mode penagihan: true untuk bulanan, false untuk tahunan

// Function to store selected plan
function selectPlan(planName, price, billing) {
  selectedPlan.name = planName;
  selectedPlan.price = price;
  selectedPlan.billing = billing;
}

// Function to store selected add-ons
function toggleAddon(name, price, isChecked) {
  const addonIndex = selectedAddons.findIndex(addon => addon.name === name);
  if (isChecked) {
    if (addonIndex === -1) {
      selectedAddons.push({ name, price });
    }
  } else {
    if (addonIndex > -1) {
      selectedAddons.splice(addonIndex, 1); // Hapus add-on
    }
  }
}

const planOptions = document.querySelectorAll('.plan-option');

planOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Hapus kelas 'selected-plan' dari semua elemen
    planOptions.forEach(opt => opt.classList.remove('selected-plan'));

    // Tambahkan kelas 'selected-plan' ke elemen yang diklik
    option.classList.add('selected-plan');

    // Simpan informasi plan yang dipilih
    const planName = option.dataset.planName;
    const isYearly = document.getElementById('billingToggle').checked;
    const price = isYearly
      ? parseInt(option.dataset.yearlyPrice)
      : parseInt(option.dataset.monthlyPrice);
    selectPlan(planName, price, isYearly ? "Yearly" : "Monthly");
  });
});

// Update Step 3 add-on selections
const addonCheckboxes = document.querySelectorAll('input[type="checkbox"]');
addonCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const labelElement = checkbox.closest('label');
    
    // Tambahkan atau hapus kelas 'label-active'
    if (checkbox.checked) {
      labelElement.classList.add('label-active');
    } else {
      labelElement.classList.remove('label-active');
    }

    // Update harga dan daftar add-on (opsional)
    const priceElement = labelElement.querySelector('.price');
    const price = isMonthly
      ? parseInt(priceElement.dataset.monthly, 10)
      : parseInt(priceElement.dataset.yearly, 10);

    const addonName = labelElement.querySelector('h3').textContent.trim();
    toggleAddon(addonName, price, checkbox.checked);
  });
});

// Update Step 4 summary content
function updateStep4Summary() {
  const isYearly = !isMonthly; // Use the updated isMonthly
  const planName = selectedPlan.name;
  const planPrice = selectedPlan.price;
  const planBilling = isYearly ? "Yearly" : "Monthly";

  // Update plan info in Step 4
  const planNameElement = document.querySelector('.plan-name');
  const planPriceElement = document.querySelector('.plan-price');
  const planTotal = document.querySelector('.total');
  planNameElement.textContent = `${planName} (${planBilling})`;
  planPriceElement.textContent = `$${planPrice}/${planBilling === "Monthly" ? "mo" : "yr"}`;
  planTotal.textContent = `Total (${planBilling})`;

  // Update add-ons summary in Step 4
  const addonsSummary = document.querySelector('.addons-summary');
  addonsSummary.innerHTML = ''; // Clear previous add-ons
  let totalAddonsPrice = 0;
  selectedAddons.forEach(addon => {
    const addonElement = document.createElement('div');
    addonElement.classList.add('addon-item');
    addonElement.innerHTML = `
      <div class="flex justify-between items-center">
        <p class="text-Cool-gray">${addon.name}</p>
        <p class="text-Marine-blue font-semibold">+$${addon.price}/${planBilling === "Monthly" ? "mo" : "yr"}</p>
      </div>
    `;
    addonsSummary.appendChild(addonElement);
    totalAddonsPrice += addon.price;
  });

  // Update total price in Step 4
  const totalPriceElement = document.querySelector('.total-price');
  const totalPrice = planPrice + totalAddonsPrice;
  totalPriceElement.textContent = `+$${totalPrice}/${planBilling === "Monthly" ? "mo" : "yr"}`;
}

function showPopup(message) {
  // Update pesan di dalam popup
  document.getElementById('popupMessage').innerText = message;

  // Tampilkan popup
  document.getElementById('popupAlert').classList.remove('hidden');
}

function closePopup() {
  // Sembunyikan popup
  document.getElementById('popupAlert').classList.add('hidden');
}