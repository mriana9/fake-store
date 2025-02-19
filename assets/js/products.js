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

//Show Breadcrumbs Title
const getCategoryName = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  //console.log(window.location);
  const categoryName = decodeURIComponent(urlParams.get("category"));
  //console.log(categoryName);

  return categoryName;
};

const displayCategoryName = async () => {
  const categoryName = await getCategoryName();
  //console.log(categoryName);
  document.querySelector(".breadcrumb-items .breadcrumb-category").textContent =
    categoryName;
};

displayCategoryName();

// Display Categories as Card
const fetchCategoryData = async (category) => {
  const { data } = await axios.get(`${apiUrl}/category/${category}`);

  const cards = data
    .map(
      (product) => `
            <div class="card">
                <div class="card-image">
                    <button class="add-to-wishlist"><i class='bx bx-heart'></i></button>
                    <img src="${product.image}" alt="${product.title}">
                    <button class="add-to-cart">add to cart <i class='bx bx-cart'></i></button>
                </div>
                <div class="card-body">
                    <a href="#">
                    ${product.title.slice(0, 50)}${
        product.title.length > 50 ? "..." : ""
      }
                    </a>
                    <p>${product.price}</p>
                </div>
            </div>
          `
    )
    .join("");
};

const getCategoryDetails = async () => {
  const categoryName = await getCategoryName();
  const { data } = await axios.get(
    `${apiUrl}/category/${encodeURIComponent(categoryName)}`
  );
  return data;
};

const displayProducts = async () => {
  const productsContainer = document.querySelector(".products");

  // Show Skeleton Loaders before fetching data
  const skeletons = Array(6) // Adjust number of skeletons
    .fill(
      `
      <div class="product-card loader"></div>
    `
    )
    .join("");

  productsContainer.innerHTML = skeletons;

  try {
    const products = await getCategoryDetails();

    // Generate Product Cards
    const result = products
      .map(
        (product) => `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}"/>
            <div>
                <h2>${product.title}</h2>
                <p class="price">Price: ${product.price}</p>
                <p><a href="./product-details.html?id=${product.id}">details <i class='bx bxs-right-arrow-alt'></i></a></p>
            </div>
          </div>`
      )
      .join("");

    // Replace Skeleton Loaders with Actual Data
    productsContainer.innerHTML = result;
  } catch (error) {
    console.error("Error fetching product data:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
};

displayProducts();
