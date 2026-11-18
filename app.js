const seedCars = [
  {
    id: "civic-2021",
    year: 2021,
    make: "Honda",
    model: "Civic Sport",
    price: 22400,
    mileage: 28500,
    location: "Portland, OR",
    transmission: "Automatic",
    description: "One careful owner, full service history, and a surprisingly fun drive. Clean title, fresh tires, and ready for its next adventure.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    badge: "Great find",
  },
  {
    id: "mustang-2019",
    year: 2019,
    make: "Ford",
    model: "Mustang EcoBoost",
    price: 26900,
    mileage: 34100,
    location: "Austin, TX",
    transmission: "Automatic",
    description: "All the Mustang character with an everyday-friendly ride. Always garaged, well maintained, and ready for a new driver.",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80",
    badge: "Owner listed",
  },
  {
    id: "volvo-2022",
    year: 2022,
    make: "Volvo",
    model: "XC40 T5",
    price: 34750,
    mileage: 19200,
    location: "Denver, CO",
    transmission: "Automatic",
    description: "A comfortable, capable little adventure partner. Beautiful interior, a panoramic roof, and all scheduled maintenance up to date.",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80",
    badge: "Low miles",
  },
  {
    id: "bmw-2020",
    year: 2020,
    make: "BMW",
    model: "3 Series 330i",
    price: 31900,
    mileage: 41600,
    location: "Brooklyn, NY",
    transmission: "Automatic",
    description: "A lovely balance of comfort and spirited driving. Kept in excellent condition with service records available to serious buyers.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    badge: "Owner listed",
  },
  {
    id: "toyota-2018",
    year: 2018,
    make: "Toyota",
    model: "4Runner SR5",
    price: 29800,
    mileage: 63800,
    location: "Bend, OR",
    transmission: "Automatic",
    description: "Built for weekend escapes and weekday errands alike. Thoughtfully cared for, no off-road abuse, with a clean vehicle history.",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    badge: "Adventure ready",
  },
  {
    id: "porsche-2021",
    year: 2021,
    make: "Porsche",
    model: "718 Cayman",
    price: 68900,
    mileage: 14700,
    location: "San Diego, CA",
    transmission: "Automatic",
    description: "A special car for someone who loves the drive. Beautifully optioned, meticulously maintained, and always kept in a climate-controlled garage.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    badge: "Something special",
  },
  {
    id: "mazda-2023",
    year: 2023,
    make: "Mazda",
    model: "CX-5 Premium",
    price: 28750,
    mileage: 12800,
    location: "Nashville, TN",
    transmission: "Automatic",
    description: "Barely broken in and a joy to own. Premium interior, great safety features, and remaining factory warranty.",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80",
    badge: "Like new",
  },
  {
    id: "vw-2017",
    year: 2017,
    make: "Volkswagen",
    model: "Golf GTI",
    price: 16900,
    mileage: 52900,
    location: "Chicago, IL",
    transmission: "Manual",
    description: "A practical hatchback with a playful side. Tastefully unmodified, with records for all routine maintenance and a fresh inspection.",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80",
    badge: "Fun to drive",
  },
];

const STORAGE_KEYS = {
  user: "openroad-demo-user",
  listings: "openroad-demo-listings",
  favorites: "openroad-demo-favorites",
  inquiries: "openroad-demo-inquiries",
};
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 500 * 1024;
let selectedPhotos = [];
let activeCar = null;
let toastTimer;

const carGrid = document.querySelector("#car-grid");
const emptyState = document.querySelector("#empty-state");
const makeFilter = document.querySelector("#make-filter");
const modelFilter = document.querySelector("#model-filter");
const yearFilter = document.querySelector("#year-filter");
const priceFilter = document.querySelector("#price-filter");
const sortFilter = document.querySelector("#sort-filter");
const accountDialog = document.querySelector("#account-dialog");
const listingDialog = document.querySelector("#listing-dialog");
const carDialog = document.querySelector("#car-dialog");
const inquiryDialog = document.querySelector("#inquiry-dialog");

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from browser storage.`, error);
    showToast("Browser storage is unavailable. Try enabling local storage.");
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key} to browser storage.`, error);
    showToast("Couldn't save this in your browser. Try a smaller photo or clear some storage.");
    return false;
  }
}

function getUserCars() {
  const saved = readStorage(STORAGE_KEYS.listings, []);
  return Array.isArray(saved) ? saved : [];
}

function getAllCars() {
  return [...getUserCars(), ...seedCars];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage) {
  return `${new Intl.NumberFormat("en-US").format(mileage)} mi`;
}

function getCarImage(car) {
  if (typeof car.image === "string" && car.image) return car.image;
  if (Array.isArray(car.images)) {
    const image = car.images.find((item) => typeof item === "string" && item);
    if (image) return image;
  }
  return seedCars[0].image;
}

function setAccountLabel() {
  const user = readStorage(STORAGE_KEYS.user, null);
  const accountLabel = document.querySelector("#account-label");
  accountLabel.textContent = user && user.name ? user.name.split(/\s+/)[0] : "Sign in";
}

function populateFilters() {
  const cars = getAllCars();
  const currentMake = makeFilter.value;
  const currentModel = modelFilter.value;
  const currentYear = yearFilter.value;
  const makes = [...new Set(cars.map((car) => car.make))].sort();
  const models = [...new Set(cars
    .filter((car) => !currentMake || car.make === currentMake)
    .map((car) => car.model))].sort();
  const years = [...new Set(cars.map((car) => Number(car.year)))]
    .filter(Number.isFinite)
    .sort((a, b) => b - a);

  makeFilter.innerHTML = '<option value="">All makes</option>' +
    makes.map((make) => `<option value="${escapeHtml(make)}">${escapeHtml(make)}</option>`).join("");
  modelFilter.innerHTML = '<option value="">All models</option>' +
    models.map((model) => `<option value="${escapeHtml(model)}">${escapeHtml(model)}</option>`).join("");
  yearFilter.innerHTML = '<option value="">Any year</option>' +
    years.map((year) => `<option value="${year}">${year}</option>`).join("");

  makeFilter.value = makes.includes(currentMake) ? currentMake : "";
  modelFilter.value = models.includes(currentModel) ? currentModel : "";
  yearFilter.value = years.includes(Number(currentYear)) ? currentYear : "";
}

function renderFilters() {
  const filters = [
    { element: makeFilter, label: "Make" },
    { element: modelFilter, label: "Model" },
    { element: yearFilter, label: "Year" },
    { element: priceFilter, label: "Under" },
  ];
  document.querySelector("#active-filters").innerHTML = filters
    .filter(({ element }) => element.value)
    .map(({ element, label }) => {
      const text = label === "Under" ? formatPrice(Number(element.value)) : element.value;
      return `<span class="filter-chip">${escapeHtml(label)}: ${escapeHtml(text)}<button type="button" aria-label="Remove ${escapeHtml(label)} filter" data-clear-filter="${element.id}">×</button></span>`;
    }).join("");
}

function currentCars() {
  const make = makeFilter.value;
  const model = modelFilter.value;
  const year = yearFilter.value;
  const maxPrice = Number(priceFilter.value) || Infinity;
  const filtered = getAllCars().filter((car) =>
    (!make || car.make === make) &&
    (!model || car.model === model) &&
    (!year || Number(car.year) === Number(year)) &&
    Number(car.price) <= maxPrice
  );
  const sort = sortFilter.value;
  const sorters = {
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
    "year-new": (a, b) => b.year - a.year,
    "mileage-low": (a, b) => a.mileage - b.mileage,
  };
  return sorters[sort] ? filtered.sort(sorters[sort]) : filtered;
}

function renderCars() {
  const cars = currentCars();
  const favorites = readStorage(STORAGE_KEYS.favorites, []);
  document.querySelector("#result-count").textContent = `${cars.length} ${cars.length === 1 ? "car" : "cars"} to explore`;
  carGrid.hidden = cars.length === 0;
  emptyState.hidden = cars.length !== 0;
  carGrid.innerHTML = cars.map((car) => {
    const image = getCarImage(car);
    const favorite = Array.isArray(favorites) && favorites.includes(car.id);
    const isOwnerListing = car.ownerListing === true;
    return `<article class="car-card">
      <div class="car-photo-wrap">
        <img class="car-photo" src="${escapeHtml(image)}" alt="${escapeHtml(`${car.year} ${car.make} ${car.model}`)}" loading="lazy" />
        <span class="car-badge">${escapeHtml(car.badge || (isOwnerListing ? "Owner listed" : "Owner listed"))}</span>
        <button class="favorite-button${favorite ? " is-favorite" : ""}" type="button" data-favorite="${escapeHtml(car.id)}" aria-label="${favorite ? "Remove from" : "Add to"} saved cars" aria-pressed="${favorite ? "true" : "false"}">♡</button>
      </div>
      <div class="car-card-content">
        <div class="car-location"><span>${escapeHtml(car.location || "Owner listed")}</span><span>${isOwnerListing ? "New listing" : "Verified listing"}</span></div>
        <h3 class="car-title">${escapeHtml(`${car.year} ${car.make} ${car.model}`)}</h3>
        <div class="car-specs"><span>${formatMileage(Number(car.mileage) || 0)}</span><i class="spec-dot"></i><span>${escapeHtml(car.transmission || "Automatic")}</span></div>
        <div class="car-card-bottom"><span class="car-price">${formatPrice(Number(car.price) || 0)}</span><button class="detail-link" type="button" data-car-detail="${escapeHtml(car.id)}">Take a look <span aria-hidden="true">→</span></button></div>
      </div>
    </article>`;
  }).join("");
  renderFilters();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function openListing() {
  const user = readStorage(STORAGE_KEYS.user, null);
  if (!user || !user.email) {
    showToast("Create a free demo account before listing your car.");
    accountDialog.showModal();
    return;
  }
  listingDialog.showModal();
}

function showCarDetails(carId) {
  const car = getAllCars().find((item) => item.id === carId);
  if (!car) return;
  activeCar = car;
  const image = getCarImage(car);
  const detailImage = document.querySelector("#detail-image");
  detailImage.src = image;
  detailImage.alt = `${car.year} ${car.make} ${car.model}`;
  document.querySelector("#detail-meta").textContent = `${car.year} · ${car.make} · ${car.location || "Owner listed"}`;
  document.querySelector("#car-dialog-title").textContent = `${car.year} ${car.make} ${car.model}`;
  document.querySelector("#detail-price").textContent = formatPrice(Number(car.price) || 0);
  document.querySelector("#detail-description").textContent = car.description || "Reach out to the owner to learn more about this car.";
  document.querySelector("#detail-specs").innerHTML = [
    formatMileage(Number(car.mileage) || 0),
    car.transmission || "Automatic",
    car.ownerListing ? "Owner listed" : "Sample listing",
  ].map((spec) => `<span>${escapeHtml(spec)}</span>`).join("");
  carDialog.showModal();
}

function updatePhotoPreviews() {
  const previews = document.querySelector("#photo-previews");
  previews.innerHTML = selectedPhotos.map((photo, index) =>
    `<span class="preview-wrap"><img src="${photo.data}" alt="Selected car photo ${index + 1}" /><button class="preview-remove" type="button" data-remove-photo="${index}" aria-label="Remove photo ${index + 1}">×</button></span>`
  ).join("");
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderCars();
  document.querySelector("#inventory").scrollIntoView({ behavior: "smooth" });
});

makeFilter.addEventListener("change", () => {
  populateFilters();
  renderCars();
});
modelFilter.addEventListener("change", renderCars);
yearFilter.addEventListener("change", renderCars);
priceFilter.addEventListener("change", renderCars);
sortFilter.addEventListener("change", renderCars);

document.querySelector("#active-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-clear-filter]");
  if (!button) return;
  document.querySelector(`#${button.dataset.clearFilter}`).value = "";
  populateFilters();
  renderCars();
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  makeFilter.value = "";
  modelFilter.value = "";
  yearFilter.value = "";
  priceFilter.value = "";
  populateFilters();
  renderCars();
});

document.querySelector("#show-all").addEventListener("click", () => {
  makeFilter.value = "";
  modelFilter.value = "";
  yearFilter.value = "";
  priceFilter.value = "";
  sortFilter.value = "featured";
  populateFilters();
  renderCars();
});

document.querySelector("#car-grid").addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const favorites = readStorage(STORAGE_KEYS.favorites, []);
    const updated = Array.isArray(favorites) ? favorites : [];
    const carId = favoriteButton.dataset.favorite;
    const next = updated.includes(carId)
      ? updated.filter((id) => id !== carId)
      : [...updated, carId];
    if (saveStorage(STORAGE_KEYS.favorites, next)) {
      renderCars();
      showToast(next.includes(carId) ? "Saved to your favorites." : "Removed from your favorites.");
    }
    return;
  }
  const detailButton = event.target.closest("[data-car-detail]");
  if (detailButton) showCarDetails(detailButton.dataset.carDetail);
});

document.querySelectorAll("#sell-nav, #sell-header, #mobile-sell, #sell-banner").forEach((button) => {
  button.addEventListener("click", openListing);
});

document.querySelector("#account-button").addEventListener("click", () => accountDialog.showModal());

document.querySelector("#account-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const user = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim().toLowerCase(),
  };
  const error = document.querySelector("#account-error");
  error.textContent = "";
  if (!user.name || !user.email) {
    error.textContent = "Please enter your name and a valid email address.";
    return;
  }
  if (!saveStorage(STORAGE_KEYS.user, user)) {
    error.textContent = "Your browser couldn't save the account. Check storage settings and try again.";
    return;
  }
  setAccountLabel();
  accountDialog.close();
  form.reset();
  showToast(`Welcome to OpenRoad, ${user.name.split(/\s+/)[0]}!`);
});

document.querySelector("#listing-photos").addEventListener("change", async (event) => {
  const files = [...event.target.files];
  const error = document.querySelector("#listing-error");
  error.textContent = "";
  if (files.length + selectedPhotos.length > MAX_PHOTOS) {
    error.textContent = `Choose up to ${MAX_PHOTOS} photos total.`;
    event.target.value = "";
    return;
  }
  const unsupported = files.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type));
  if (unsupported) {
    error.textContent = "Use JPG, PNG, or WebP photos.";
    event.target.value = "";
    return;
  }
  const tooLarge = files.find((file) => file.size > MAX_PHOTO_BYTES);
  if (tooLarge) {
    error.textContent = "Each photo must be 500 KB or smaller.";
    event.target.value = "";
    return;
  }
  try {
    const loaded = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, data: reader.result });
      reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
      reader.readAsDataURL(file);
    })));
    selectedPhotos = [...selectedPhotos, ...loaded];
    updatePhotoPreviews();
  } catch (readError) {
    console.error("Unable to read the selected listing photo.", readError);
    error.textContent = "A photo couldn't be read. Please choose another file.";
  }
  event.target.value = "";
});

document.querySelector("#photo-previews").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-photo]");
  if (!button) return;
  selectedPhotos.splice(Number(button.dataset.removePhoto), 1);
  updatePhotoPreviews();
});

document.querySelector("#listing-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.querySelector("#listing-error");
  error.textContent = "";
  const formData = new FormData(form);
  const year = Number(formData.get("year"));
  const price = Number(formData.get("price"));
  const mileage = Number(formData.get("mileage"));
  const currentYear = new Date().getFullYear() + 1;
  if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
    error.textContent = `Enter a year between 1900 and ${currentYear}.`;
    return;
  }
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(mileage) || mileage < 0) {
    error.textContent = "Enter a valid asking price and mileage.";
    return;
  }
  const user = readStorage(STORAGE_KEYS.user, null);
  if (!user || !user.email) {
    error.textContent = "Create a demo account before publishing a listing.";
    listingDialog.close();
    accountDialog.showModal();
    return;
  }
  const listing = {
    id: `user-${Date.now()}`,
    year,
    make: String(formData.get("make")).trim(),
    model: String(formData.get("model")).trim(),
    price,
    mileage,
    location: String(formData.get("location")).trim(),
    transmission: "Owner details",
    description: String(formData.get("description")).trim(),
    images: selectedPhotos.map((photo) => photo.data),
    image: selectedPhotos[0] ? selectedPhotos[0].data : "",
    badge: "Just listed",
    ownerListing: true,
    seller: { name: user.name, email: user.email },
  };
  if (!listing.make || !listing.model || !listing.location) {
    error.textContent = "Please fill in the car's make, model, and location.";
    return;
  }
  const listings = getUserCars();
  listings.unshift(listing);
  if (!saveStorage(STORAGE_KEYS.listings, listings)) {
    error.textContent = "Your listing couldn't be saved. Try removing a photo or using smaller images.";
    return;
  }
  form.reset();
  selectedPhotos = [];
  updatePhotoPreviews();
  listingDialog.close();
  populateFilters();
  renderCars();
  showToast("Your car is listed! It’s now in the marketplace.");
  document.querySelector("#inventory").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#contact-seller").addEventListener("click", () => {
  if (!activeCar) return;
  document.querySelector("#inquiry-car-name").textContent = `${activeCar.year} ${activeCar.make} ${activeCar.model} · ${formatPrice(Number(activeCar.price) || 0)}`;
  const user = readStorage(STORAGE_KEYS.user, null);
  if (user) {
    document.querySelector("#inquiry-name").value = user.name || "";
    document.querySelector("#inquiry-email").value = user.email || "";
  }
  carDialog.close();
  inquiryDialog.showModal();
});

document.querySelector("#inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!activeCar) return;
  const form = event.currentTarget;
  const inquiries = readStorage(STORAGE_KEYS.inquiries, []);
  const nextInquiries = Array.isArray(inquiries) ? inquiries : [];
  nextInquiries.push({
    carId: activeCar.id,
    carName: `${activeCar.year} ${activeCar.make} ${activeCar.model}`,
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim().toLowerCase(),
    message: form.elements.message.value.trim(),
    createdAt: new Date().toISOString(),
  });
  if (!saveStorage(STORAGE_KEYS.inquiries, nextInquiries)) {
    document.querySelector("#inquiry-error").textContent = "Your inquiry couldn't be saved in this browser. Check storage settings and try again.";
    return;
  }
  inquiryDialog.close();
  showToast("Demo inquiry saved in this browser. No message was sent.");
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close());
});

[accountDialog, listingDialog, carDialog, inquiryDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

populateFilters();
renderCars();
setAccountLabel();
