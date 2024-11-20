import { loading } from "./utils";
import axios from "axios";
import Swal from "sweetalert2";
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
// 所有商品
let data = [];
// 購物車商品
let cartProducts = [];

const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", (event) => {
  let selectData =
    event.target.value !== "全部"
      ? data.filter((item) => item.category == event.target.value)
      : data;
  showProducts(selectData);
});

// 取得商品
function getProducts() {
  axios
    .get(`${VITE_API_URL}/customer/${VITE_API_PATH}/products`)
    .then((res) => {
      data = res.data.products;
      showProducts(data);
    });
}

// 展示商品
const productWrap = document.querySelector(".productWrap");
const showProducts = (products) => {
  let dataStr = "";
  products.map((item) => {
    dataStr += `<li class="productCard"">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="img" />
      <a data-id="${item.id}" href="#" class="addCardBtn">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT${item.origin_price}</del>
      <p class="nowPrice">NT${item.price}</p>
      </li>`;
  });
  productWrap.innerHTML = dataStr;
  document.querySelectorAll(".addCardBtn").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      addItem(e.target.dataset.id);
    });
  });
};

// 取得購物車商品
const getCartProducts = () => {
  axios.get(`${VITE_API_URL}/customer/${VITE_API_PATH}/carts`).then((res) => {
    cartProducts = res.data;
    showShoppingCart(cartProducts);
  });
};
// 展示購物車商品
const shoppingCart = document.querySelector(".shoppingCart-table");
const showShoppingCart = (cart) => {
  let dataStr = `<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
  </tr>`;
  cart.carts.map((item) => {
    dataStr += `<tr><td>
    <div class="cardItem-title">
    <img src="${item.product.images}" alt="img" />
    <p>${item.product.title}</p>
    </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>NT$${item.product.price * item.quantity}</td>
    <td class="discardBtn">
    <a data-id="${item.id}" href="#" class="material-icons"> clear </a>
    </td></tr>`;
  });
  dataStr += `<tr><td>
  <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td><td></td><td></td>
  <td><p>總金額</p></td>
  <td>NT$${cart.finalTotal}</td>
  </tr>`;
  shoppingCart.innerHTML = dataStr;
  document.querySelectorAll(".discardBtn").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      deleteItem(e.target.dataset.id);
    });
  });
  document.querySelector(".discardAllBtn").addEventListener("click", (e) => {
    e.preventDefault();
    deleteAllItems(e.target.dataset.id);
  });
};
// 新增商品
const addItem = (id) => {
  loading("新增商品中~~");
  const product = cartProducts.carts.filter((item) => item.product.id == id);
  const data = {};
  data.productId = id;
  data.quantity = product.length == 0 ? 1 : product[0].quantity + 1;
  axios
    .post(`${VITE_API_URL}/customer/${VITE_API_PATH}/carts`, {
      data,
    })
    .then((res) => {
      cartProducts = res.data;
      showShoppingCart(cartProducts);
      Swal.fire("新增商品成功");
    })
    .catch(() => {
      Swal.fire("新增商品失敗");
    });
};
// 刪除單一商品
const deleteItem = (id) => {
  loading("刪除商品中~~");
  axios
    .delete(`${VITE_API_URL}/customer/${VITE_API_PATH}/carts/${id}`)
    .then((res) => {
      cartProducts = res.data;
      showShoppingCart(cartProducts);
      Swal.fire("刪除商品成功");
    })
    .catch(() => {
      Swal.fire("刪除商品失敗");
    });
};

// 刪除所有商品
const deleteAllItems = () => {
  loading("刪除所有商品中~~");
  axios
    .delete(`${VITE_API_URL}/customer/${VITE_API_PATH}/carts`)
    .then((res) => {
      cartProducts = res.data;
      showShoppingCart(cartProducts);
      Swal.fire("刪除所有商品成功");
    })
    .catch(() => {
      Swal.fire("刪除所有商品失敗");
    });
};

// 新增訂單
document.querySelector(".orderInfo-btn").addEventListener("click", (e) => {
  e.preventDefault();
  addOrder();
});
const addOrder = () => {
  const form = document.querySelector(".orderInfo-form");
  const formData = new FormData(form);
  const name = formData.get("姓名");
  const tel = formData.get("電話");
  const email = formData.get("Email");
  const address = formData.get("寄送地址");
  const payment = formData.get("交易方式");
  if (!name || !tel || !email || !address || !payment) {
    Swal.fire("不得有空白");
    return;
  }
  if (cartProducts.carts.length == 0) {
    Swal.fire("購物車不得為空");
    return;
  }
  loading("新增訂單中~~");
  axios
    .post(`${VITE_API_URL}/customer/${VITE_API_PATH}/orders`, {
      data: {
        user: {
          name,
          tel,
          email,
          address,
          payment,
        },
      },
    })
    .then(() => {
      form.reset();
      getCartProducts();
      Swal.fire("新增訂單成功");
    })
    .catch(() => {
      Swal.fire("新增訂單失敗");
    });
};

getProducts();
getCartProducts();
