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
  const { data } = await axios.get(`${apiUrl}/category/${category}`);
  //const products = await response.json();

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

  document.querySelector(".best-selling-tabs .tabs-cards").innerHTML = cards;
};

//Show Electronics Tabs as Default
fetchCategoryData("electronics");
