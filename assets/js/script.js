const apiUrl = "https://fakestoreapi.com/products";

// Fetch Categories
const getCategories = async () => {
  const { data } = await axios.get(`${apiUrl}/categories`);
  //console.log(data);
  return data;
};

//getCategories();

// Display Categories as Dropdown Item
const displayCategoriesDropdownItem = async () => {
  const categories = await getCategories();

  const result = categories
    .map(
      (category) => `
      <li>
          <a href="./products.html?category=${encodeURIComponent(category)}">
            ${category}
          </a>
      </li> `
    )
    .join("");
  document.querySelector("nav .navbar-item.dropdown .dropdown-menu").innerHTML =
    result;
};

displayCategoriesDropdownItem();

// Display Categories as Tabs
const displayCategoriesTabs = async () => {
  const categories = await getCategories();

  const result = categories
    .map(
      (category) => `
    <li>
          <button onclick="fetchCategoryData(&quot;${category}&quot;)">${category}</button>
    </li> `
    )
    .join("");
  document.querySelector(".best-selling-tabs .tabs-btns").innerHTML = result;
};

displayCategoriesTabs();

// Display Categories as Card
const fetchCategoryData = async (category) => {
  const tabsCards = document.querySelector(".best-selling-tabs .tabs-cards");
  const modal = document.querySelector(".modal");
  const modalContent = document.querySelector(".modal-content");

  let currentIndex = 0;
  let products = [];

  // Show Skeleton Loaders before fetching data
  const skeletons = Array(6).fill(`<div class="card loader"></div>`).join("");
  tabsCards.innerHTML = skeletons;

  try {
    const { data } = await axios.get(`${apiUrl}/category/${category}`);
    products = data; // Store all products

    // Generate Product Cards
    const cards = data
      .map(
        (product, index) => `
		  <div class="card">
			<div class="card-image">
			  <button class="add-to-wishlist"><i class='bx bx-heart'></i></button>
			  <img src="${product.image}" alt="${
          product.title
        }" class="product-img" data-index="${index}">
			  <button class="add-to-cart">add to cart <i class='bx bx-cart'></i></button>
			</div>
			<div class="card-body">
			  <p><a href="./product-details.html?id=${product.id}">
				${product.title.slice(0, 50)}${product.title.length > 50 ? "..." : ""}
			  </a></p>
			  <p>${product.price} $</p>
			</div>
		  </div>
		`
      )
      .join("");

    // Replace Skeleton Loaders with Actual Data
    tabsCards.innerHTML = cards;

    // Add Click Event to Each Image
    document.querySelectorAll(".product-img").forEach((img) => {
      img.addEventListener("click", (e) => {
        currentIndex = parseInt(e.target.dataset.index);
        openModal();
      });
    });

    // Open Modal Function
    const openModal = () => {
      const product = products[currentIndex];

      modalContent.innerHTML = `
		  <div class="modal-card">
			<button class="close-modal">&times;</button>
			<button class="prev">&lt;</button>
			<img src="${product.image}" alt="${product.title}">
			<button class="next">&gt;</button>
		  </div>
		`;

      // Show Modal
      modal.classList.add("show-modal");

      // Close Modal Event
      document.querySelector(".close-modal").addEventListener("click", () => {
        modal.classList.remove("show-modal");
      });

      // Close Modal on Outside Click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show-modal");
        }
      });

      // Next & Previous Image
      document.querySelector(".next").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % products.length; // Loop back to first image
        openModal();
      });

      document.querySelector(".prev").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + products.length) % products.length; // Loop back to last image
        openModal();
      });
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    tabsCards.innerHTML = "<p>Failed to load products.</p>";
  }
};

//Show Electronics Tabs as Default
fetchCategoryData("electronics");
