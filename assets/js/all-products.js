const apiUrl = "https://fakestoreapi.com/products";

// Fetch Categories
const getCategories = async () => {
  const { data } = await axios.get(`${apiUrl}/categories`);
  //console.log(data);
  return data;
};

//getCategories();

//get products with limit
const getProducts = async (page) => {
  const skip = (page - 1) * 3;
  const { data } = await axios.get(`${apiUrl}?limit=${20}&skip=${skip}`);
  //console.log(data);
  return data;
};

const getAllProducts = async () => {
  const { data } = await axios.get(`${apiUrl}`);
  //console.log(data);
  return data;
};

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

// Display All Products as Card

const fetchAllProductsData = async (page = 1) => {
  const productCards = document.querySelector(
    ".all-products .all-products-cards"
  );

  // Show Skeleton Loaders before fetching data
  const skeletons = Array(3).fill(`<div class="card loader"></div>`).join("");
  productCards.innerHTML = skeletons;

  try {
    const data = await getProducts();
    const itemsPerPage = 3;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Slice data based on page
    const paginatedData = data.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    // Generate Product Cards
    const cards = paginatedData
      .map(
        (product) => `
              <div class="card">
                <div class="card-image">
                  <button class="add-to-wishlist"><i class='bx bx-heart'></i></button>
                  <img src="${product.image}" alt="${product.title}">
                  <button class="add-to-cart">add to cart <i class='bx bx-cart'></i></button>
                </div>
                <div class="card-body">
                  <p><a href="./product-details.html?id=${
                    product.id
                  }">${product.title.slice(0, 50)}${
          product.title.length > 50 ? "..." : ""
        }</a></p>
                  <p>${product.price} $</p>
                </div>
              </div>
            `
      )
      .join("");

    // Replace Skeleton Loaders with Actual Data
    productCards.innerHTML = cards;

    let itemPagination = `<li class="page-item ${
      page === 1 ? "disabled" : ""
    }"><button class="page-link" onclick="fetchAllProductsData(${page - 1})">
        <i class='bx bx-chevron-left'></i>
      </button></li>`;

    for (let i = 1; i <= totalPages; i++) {
      itemPagination += `<li class="page-item ${
        page === i ? "active" : ""
      }"><button onClick="fetchAllProductsData(${i})" class="page-link">${i}</button></li>`;
    }

    itemPagination += `<li class="page-item ${
      page === totalPages ? "disabled" : ""
    }"><button class="page-link" onclick="fetchAllProductsData(${page + 1})">
        <i class='bx bx-chevron-right'></i>
      </button></li>`;

    document.querySelector(".pagination").innerHTML = itemPagination;

    // Highlight the active page
    document
      .querySelectorAll(".pagination .page-item")
      .forEach((item) => item.classList.remove("active"));
    document
      .querySelector(`.pagination .page-item:nth-child(${page + 1})`)
      ?.classList.add("active");
  } catch (error) {
    console.error("Error fetching products:", error);
    productCards.innerHTML = "<p>Failed to load products.</p>";
  }
};

// Initial Load
fetchAllProductsData();
