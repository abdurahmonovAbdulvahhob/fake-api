const wrapper = document.querySelector(".wrapper");
const loading = document.querySelector(".loader");
const navbar = document.querySelector(".navbar");
const btn = document.querySelector(".skip");
const categoryTag = document.querySelector(".category");

const API_URL = "https://dummyjson.com";
let offset = 1;
let perPageCount = 4;
let closeButton = 0;
let total;
let ctg;

wrapper.classList.add("none")
categoryTag.classList.add("none")
navbar.classList.add("none");
btn.classList.add("none");

setTimeout(() => {
  loading.classList.add("none");
  navbar.classList.remove("none");
  categoryTag.classList.remove("none");
  wrapper.classList.remove("none");
  btn.classList.remove("none");
  async function fetchData(api, callback) {
    // loading.style.display = "flex";
    try {
      const response = await fetch(api);
      const data = await response.json();
      total = data.total;
      callback(data, total);
    } catch (err) {
      console.error(err);
    } finally {
      loading.style.display = "none";
    }
  }

  fetchData(`${API_URL}/products?limit=${perPageCount * offset}`, createCard);
  fetchData(`${API_URL}/products/categories`, createCategories);
  fetchData(`${API_URL}/products?limit=${perPageCount}`, (data) => {
    total = data.total;
    createCard(data, total);
  });

  function getByCategory(category) {
    ctg = category;
    offset = 1;
    closeButton = 0;
    btn.style.display = "block";
    const apiUrl =
      category === "all"
        ? `${API_URL}/products?limit=${perPageCount}`
        : `${API_URL}/products/category/${category}?limit=${perPageCount}`;
    fetchData(apiUrl, (data) => {
      total = category === "all" ? data.total : data.products.length;
      createCard(data, total);
    });
  }

  function createCategories(categories) {
    while (categoryTag.firstChild) {
      categoryTag.firstChild.remove();
    }

    const allButton = document.createElement("button");
    allButton.textContent = "All";
    allButton.addEventListener("click", () => getByCategory("all"));
    categoryTag.appendChild(allButton);

    categories.forEach((category) => {
      const categoryBtn = document.createElement("button");
      categoryBtn.textContent = category.slug; // Adjust if `category.slug` is used
      categoryBtn.addEventListener("click", () => getByCategory(category.slug));
      categoryTag.appendChild(categoryBtn);
    });
  }

  function createCard(data) {
    while (wrapper.firstChild) {
      wrapper.firstChild.remove();
    }
    data.products.forEach((products) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
    <div class="img__wrapper">
    <img src="${products.images[0]}" alt="${products.title}">
    </div>
    <h3>${products.title}</h3>
    <strong>Price: $${products.price}</strong>
    <button>Add to Cart</button>`;
      wrapper.appendChild(card);
    });
    window.scrollTo(0, wrapper.scrollHeight);
  }

  btn.addEventListener("click",()=> {
    console.log("a1")
    offset++;
    closeButton += perPageCount;

    const apiUrl =
      ctg === "all" || !ctg
        ? `${API_URL}/products?limit=${perPageCount * offset}`
        : `${API_URL}/products/category/${ctg}?limit=${perPageCount * offset}`;

    fetchData(apiUrl, createCard);

    if (closeButton >= total) {
      btn.style.display = "none";
    }
  })
}, 3000);
