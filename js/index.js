// Track the current step
let currentStep = 1;
const totalSteps = 4;

// Helper functions
const toggleClass = (element, className, add) => {
  if (add) element.classList.add(className);
  else element.classList.remove(className);
};

const getStepElement = (step, type, layout) => {
  const suffix = layout === 'mobile' ? 'Mobile' : 'Desktop';
  return document.getElementById(`step${step}${type}${suffix}`);
};

// Step navigation
function showStep(step) {
  currentStep = step;

  // Update langkah untuk mobile dan desktop
  for (let i = 1; i <= totalSteps; i++) {
    // Perbarui lingkaran langkah
    toggleClass(getStepElement(i, 'Circle', 'mobile'), 'active-step-circle', i === step);
    toggleClass(getStepElement(i, 'Circle', 'desktop'), 'active-step-circle', i === step);

    // Perbarui konten untuk setiap langkah (mobile dan desktop menggunakan konten yang sama)
    toggleClass(document.getElementById(`step${i}Content`), 'hidden', i !== step);
  }

  // Update tombol berdasarkan langkah saat ini
  const backButtonDesktop = document.querySelector('.go-back-button');
  const nextButtonDesktop = document.querySelector('.next-step-button');
  const backButtonMobile = document.querySelector('.go-back-button-mobile');
  const nextButtonMobile = document.querySelector('.next-step-button-mobile');

  // Tombol Back
  if (step === 1) {
    backButtonDesktop?.classList.add('hidden');
    backButtonMobile?.classList.add('hidden');
  } else {
    backButtonDesktop?.classList.remove('hidden');
    backButtonMobile?.classList.remove('hidden');
  }

  // Tombol Next
  if (step === totalSteps) {
    nextButtonDesktop.textContent = 'Confirm';
    nextButtonMobile.textContent = 'Confirm';
  } else {
    nextButtonDesktop.textContent = 'Next Step';
    nextButtonMobile.textContent = 'Next Step';
  }

  // Tampilkan "Thank You" jika langkah lebih dari totalSteps
  if (step > totalSteps) {
    document.getElementById('thankYou')?.classList.remove('hidden');
    backButtonDesktop?.classList.add('hidden');
    nextButtonDesktop?.classList.add('hidden');
    backButtonMobile?.classList.add('hidden');
    nextButtonMobile?.classList.add('hidden');
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

  // Validasi Name
  if (!inputs.name.value.trim()) {
    setError(inputs.name, "This Field is required");
    isValid = false;
  } else {
    clearError(inputs.name);
  }

  // Validasi Email
  if (!inputs.email.value.trim()) {
    setError(inputs.email, "This Field is required");
    isValid = false;
  } else if (!isValidEmail(inputs.email.value.trim())) {
    setError(inputs.email, "Please enter a valid email");
    isValid = false;
  } else {
    clearError(inputs.email);
  }

  // Validasi Phone
  if (!inputs.phone.value.trim()) {
    setError(inputs.phone, "This Field is required");
    isValid = false;
  } else if (!/^\+?\d+$/.test(inputs.phone.value.trim())) {
    setError(inputs.phone, "Only Digits");
    isValid = false;
  } else {
    clearError(inputs.phone);
  }

  return isValid;
}

function setError(input, message) {
  const parent = input.parentElement; // Mengambil elemen parent
  let errorLabel = parent.querySelector('.error-message');

  // Tambahkan pesan error jika belum ada
  if (!errorLabel) {
    errorLabel = document.createElement('p');
    errorLabel.className = 'error-message text-red-500 text-sm';
    parent.appendChild(errorLabel);
  }
  errorLabel.innerText = message;

  // Tambahkan kelas `shake` untuk animasi
  input.classList.add('shake', 'border-red-500');

  // Hapus animasi shake setelah selesai
  input.addEventListener('animationend', () => {
    input.classList.remove('shake');
  }, { once: true });
}

function clearError(input) {
  const parent = input.parentElement;
  const errorLabel = parent.querySelector('.error-message');

  // Hapus pesan error jika ada
  if (errorLabel) {
    parent.removeChild(errorLabel);
  }

  // Hapus kelas error dari input
  input.classList.remove('border-red-500');
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

  const discountTexts = {
    arcade: document.querySelector('#step2Content .arcade-discount'),
    advanced: document.querySelector('#step2Content .advanced-discount'),
    pro: document.querySelector('#step2Content .pro-discount')
  };

  const yearlyPrices = { arcade: '$90/yr', advanced: '$120/yr', pro: '$150/yr' };
  const monthlyPrices = { arcade: '$9/mo', advanced: '$12/mo', pro: '$15/mo' };

  const updatedPrices = isYearly ? yearlyPrices : monthlyPrices;

  prices.arcade.textContent = updatedPrices.arcade;
  prices.advanced.textContent = updatedPrices.advanced;
  prices.pro.textContent = updatedPrices.pro;

  // Show the "2 month free" text if yearly plan is selected
  if (isYearly) {
    discountTexts.arcade.classList.remove('hidden');
    discountTexts.advanced.classList.remove('hidden');
    discountTexts.pro.classList.remove('hidden');
  } else {
    discountTexts.arcade.classList.add('hidden');
    discountTexts.advanced.classList.add('hidden');
    discountTexts.pro.classList.add('hidden');
  }
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
    monthlyText.classList.add('text-blue-600');
    monthlyText.classList.remove('text-gray-400');
    yearlyText.classList.add('text-gray-400');
    yearlyText.classList.remove('text-blue-600');

    // Update harga untuk "Monthly" jika toggle tidak dicentang
    updatePlanPrices(false);
    updateStep3Prices(false);
    updateStep4Summary(); // Pastikan harga di Step 4 juga diupdate
  }

  // Update Plan Prices on toggle change
  if (billingToggle) {
    let isYearlySelected = false;
    billingToggle.addEventListener('change', (e) => {
      const isYearly = e.target.checked;
      isMonthly = !isYearly; // Perbarui nilai isMonthly

      updatePlanPrices(isYearly);
      updateStep3Prices(isYearly);
      updateStep4Summary();

      // Jika ada plan yang dipilih, perbarui detailnya
      const selectedElement = document.querySelector('.plan-option.selected-plan');
      if (selectedElement) {
        const planName = selectedElement.dataset.planName;
        const price = isYearly
          ? parseInt(selectedElement.dataset.yearlyPrice)
          : parseInt(selectedElement.dataset.monthlyPrice);

        selectPlan(planName, price, isYearly ? "Yearly" : "Monthly");
        updateStep4Summary(); // Perbarui step 4 summary
      }

      // Ubah warna teks sesuai posisi toggle
      if (isYearly) {
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
  updateStep4Summary(); // Pastikan harga di Step 4 diperbarui saat halaman dimuat
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

// Menyimpan dan mengatur plan yang dipilih
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

    // Perbarui Step 4 Summary
    updateStep4Summary();
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

// Update Step 4 Summary Content
function updateStep4Summary() {
  const isYearly = !isMonthly; // Gunakan nilai isMonthly yang terupdate
  const planName = selectedPlan.name;
  const planPrice = selectedPlan.price;
  const planBilling = isYearly ? "Yearly" : "Monthly";

  // Update info plan di Step 4
  const planNameElement = document.querySelector('.plan-name');
  const planPriceElement = document.querySelector('.plan-price');
  const planTotal = document.querySelector('.total');
  planNameElement.textContent = `${planName} (${planBilling})`;
  planPriceElement.textContent = `$${planPrice}/${planBilling === "Monthly" ? "mo" : "yr"}`;
  planTotal.textContent = `Total (${planBilling})`;

  // Update summary add-ons di Step 4
  const addonsSummary = document.querySelector('.addons-summary');
  addonsSummary.innerHTML = ''; // Clear previous add-ons
  let totalAddonsPrice = 0;

  // Looping untuk menampilkan add-ons yang dipilih
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

  // Menghitung total harga (plan + add-ons)
  const totalPriceElement = document.querySelector('.total-price');
  const totalPrice = planPrice + totalAddonsPrice;
  totalPriceElement.textContent = `+$${totalPrice}/${planBilling === "Monthly" ? "mo" : "yr"}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const changePlanButton = document.getElementById('changePlanButton');
  if (changePlanButton) {
    changePlanButton.addEventListener('click', () => {
      showStep(2); // Navigasi ke langkah 2
    });
  }
});

function showPopup(message) {
  // Update pesan di dalam popup
  document.getElementById('popupMessage').innerText = message;

  const popupAlert = document.getElementById('popupAlert');
  const popup = document.querySelector('#popupAlert .bg-white');

  // Animasi masuk untuk overlay dan popup
  popupAlert.classList.remove('hidden', 'scale-out');
  popupAlert.classList.add('scale-in');
  popup.classList.remove('scale-out');
  popup.classList.add('scale-in');
}

function closePopup() {
  const popupAlert = document.getElementById('popupAlert');
  const popup = document.querySelector('#popupAlert .bg-white');

  // Animasi keluar untuk overlay dan popup
  popupAlert.classList.remove('scale-in');
  popupAlert.classList.add('scale-out');
  popup.classList.remove('scale-in');
  popup.classList.add('scale-out');

  // Sembunyikan overlay setelah animasi selesai
  popupAlert.addEventListener('animationend', function handleAnimationEnd() {
    popupAlert.classList.add('hidden');
    popupAlert.removeEventListener('animationend', handleAnimationEnd);
  });
}