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

const getProductId = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = decodeURIComponent(urlParams.get("id"));
  //console.log(productId);
  return productId;
};

//getProductId();

const getProductDetails = async () => {
  const productId = await getProductId();
  const { data } = await axios.get(`${apiUrl}/${productId}`);
  console.log(data);
  return data;
};

//getProductDetails();

const displayProductDetails = async () => {
  const product = await getProductDetails();
  const fullStars = Math.floor(product.rating.rate);
  const halfStar = product.rating.rate % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const starIcons = `
    ${'<i class="bx bxs-star"></i>'.repeat(fullStars)} 
    ${halfStar ? '<i class="bx bxs-star-half"></i>' : ""} 
    ${'<i class="bx bx-star"></i>'.repeat(emptyStars)}
  `;

  const result = `
        <div class="product-details-card">
          <img src="${product.image}" alt="${product.title}"/>
          <div>
              <h2>${product.title}</h2>
              <p class="price">Price: $${product.price}</p>
              <p class="description">${product.description}</p>
              <div class="category">Category: <span>${product.category}</span></div>
              <div class="rating">
                  <p class="stars">${starIcons}</p>
                  <p class="reviews" >Based on : <span>${product.rating.count}</span> reviews</p>
              </div>
          </div>
        </div>
    `;

  document.querySelector(".products-details .container").innerHTML = result;
};

displayProductDetails();
