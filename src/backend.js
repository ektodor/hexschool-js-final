import { loading } from "./utils";
import axios from "axios";
import Swal from "sweetalert2";
import * as c3 from "c3/c3.js";

const { VITE_API_URL, VITE_API_PATH, VITE_API_TOKEN } = import.meta.env;
let orders = [];

// header 帶上 token
axios.defaults.headers.common["Authorization"] = VITE_API_TOKEN;

// 取得訂單
const getOrders = () => {
  axios.get(`${VITE_API_URL}/admin/${VITE_API_PATH}/orders`).then((res) => {
    orders = res.data.orders;
    displayOrders(orders);
  });
};

// 刪除單一訂單
const deleteOrder = (id) => {
  console.log(id);
  loading("刪除訂單中~~");
  axios
    .delete(`${VITE_API_URL}/admin/${VITE_API_PATH}/orders/${id}`)
    .then((res) => {
      orders = res.data.orders;
      displayOrders(orders);
      Swal.fire("刪除訂單成功");
    })
    .catch(() => {
      Swal.fire("刪除訂單失敗");
    });
};

// 刪除所有訂單
document.querySelector(".discardAllBtn").addEventListener("click", (e) => {
  e.preventDefault();
  deleteAllOrders();
});
const deleteAllOrders = () => {
  loading("刪除所有訂單中~~");
  axios
    .delete(`${VITE_API_URL}/admin/${VITE_API_PATH}/orders`)
    .then((res) => {
      orders = res.data.orders;
      displayOrders(orders);
      Swal.fire("刪除所有訂單成功");
    })
    .catch(() => {
      Swal.fire("刪除所有訂單失敗");
    });
};

// 展示訂單
const orderTable = document.querySelector(".orderPage-table");
const displayOrders = (userOrders) => {
  let orderStr = `<thead><tr>
  <th>訂單編號</th>
  <th>聯絡人</th>
  <th>聯絡地址</th>
  <th>電子郵件</th>
  <th>訂單品項</th>
  <th>訂單日期</th>
  <th>訂單狀態</th>
  <th>操作</th>
  </tr></thead>`;
  userOrders.map((item) => {
    const date = new Date(item.updatedAt * 1000);
    orderStr += `<tr>
    <td>${item.id}</td>
    <td><p>${item.user.name}</p><p>${item.user.tel}</p></td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td><p>${item.products.map((product) => product.title).join("、")}</p></td>
    <td>${date.getFullYear()}/${date.getMonth()}/${date.getDate()}</td>
    <td class="orderStatus"><a href="#">${
      item.paid ? "已處理" : "未處理"
    }</a></td>
    <td><input data-id="${
      item.id
    }" type="button" class="delSingleOrder-Btn" value="刪除" /></td></tr>`;
  });
  orderTable.innerHTML = orderStr;
  document.querySelectorAll(".delSingleOrder-Btn").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      deleteOrder(e.target.dataset.id);
    });
  });
  displayChart(userOrders);
};

const displayChart = (userOrders) => {
  const chartData = userOrders.reduce((obj, item) => {
    item.products.map((product) => {
      if (product.title in obj) {
        obj[product.title]++;
      } else {
        obj[product.title] = product.quantity;
      }
    });
    return obj;
  }, {});
  const columns = [];
  const colors = {};
  const colorList = ["#DACBFF", "#9D7FEA", "#5434A7"];
  let others = 0;
  const sortChartData = Object.keys(chartData)
    .sort((a, b) => chartData[b] - chartData[a])
    .map((item, index) => {
      if (index < 3) {
        columns.push([item, chartData[item]]);
        colors[item] = colorList[index];
      } else {
        others += chartData[item];
      }
    });
  columns.push(["其他", others]);
  colors["其他"] = "#301E5F";
  // C3.js
  c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns,
      colors,
    },
  });
};

getOrders();
