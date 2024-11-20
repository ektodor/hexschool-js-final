import{l as i,a as o,S as d}from"./axios-6ee48281.js";const{VITE_API_URL:s,VITE_API_PATH:n}={VITE_API_URL:"https://livejs-api.hexschool.io/api/livejs/v1",VITE_API_PATH:"ektodorwangapi",VITE_API_TOKEN:"aBJ3fWIvPYMQOxkRRvfL0dRM5qw1",BASE_URL:"/hexschool-js-final/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};let l=[],c=[];const m=document.querySelector(".productSelect");m.addEventListener("change",e=>{let r=e.target.value!=="全部"?l.filter(t=>t.category==e.target.value):l;g(r)});function I(){o.get(`${s}/customer/${n}/products`).then(e=>{l=e.data.products,g(l)})}const S=document.querySelector(".productWrap"),g=e=>{let r="";e.map(t=>{r+=`<li class="productCard"">
      <h4 class="productType">新品</h4>
      <img src="${t.images}" alt="img" />
      <a data-id="${t.id}" href="#" class="addCardBtn">加入購物車</a>
      <h3>${t.title}</h3>
      <del class="originPrice">NT${t.origin_price}</del>
      <p class="nowPrice">NT${t.price}</p>
      </li>`}),S.innerHTML=r,document.querySelectorAll(".addCardBtn").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault(),E(a.target.dataset.id)})})},$=()=>{o.get(`${s}/customer/${n}/carts`).then(e=>{c=e.data,u(c)})},v=document.querySelector(".shoppingCart-table"),u=e=>{let r=`<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
  </tr>`;e.carts.map(t=>{r+=`<tr><td>
    <div class="cardItem-title">
    <img src="${t.product.images}" alt="img" />
    <p>${t.product.title}</p>
    </div>
    </td>
    <td>NT$${t.product.price}</td>
    <td>${t.quantity}</td>
    <td>NT$${t.product.price*t.quantity}</td>
    <td class="discardBtn">
    <a data-id="${t.id}" href="#" class="material-icons"> clear </a>
    </td></tr>`}),r+=`<tr><td>
  <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td><td></td><td></td>
  <td><p>總金額</p></td>
  <td>NT$${e.finalTotal}</td>
  </tr>`,v.innerHTML=r,document.querySelectorAll(".discardBtn").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault(),T(a.target.dataset.id)})}),document.querySelector(".discardAllBtn").addEventListener("click",t=>{t.preventDefault(),y(t.target.dataset.id)})},E=e=>{i("新增商品中~~");const r=c.carts.filter(a=>a.product.id==e),t={};t.productId=e,t.quantity=r.length==0?1:r[0].quantity+1,o.post(`${s}/customer/${n}/carts`,{data:t}).then(a=>{c=a.data,u(c),d.fire("新增商品成功")}).catch(()=>{d.fire("新增商品失敗")})},T=e=>{i("刪除商品中~~"),o.delete(`${s}/customer/${n}/carts/${e}`).then(r=>{c=r.data,u(c),d.fire("刪除商品成功")}).catch(()=>{d.fire("刪除商品失敗")})},y=()=>{i("刪除所有商品中~~"),o.delete(`${s}/customer/${n}/carts`).then(e=>{c=e.data,u(c),d.fire("刪除所有商品成功")}).catch(()=>{d.fire("刪除所有商品失敗")})};document.querySelector(".orderInfo-btn").addEventListener("click",e=>{e.preventDefault(),P()});const P=()=>{const e=document.querySelector(".orderInfo-form"),r=new FormData(e),t=r.get("姓名"),a=r.get("電話"),p=r.get("Email"),h=r.get("寄送地址"),f=r.get("交易方式");if(!t||!a||!p||!h||!f){d.fire("不得有空白");return}if(c.carts.length==0){d.fire("購物車不得為空");return}i("新增訂單中~~"),o.post(`${s}/customer/${n}/orders`,{data:{user:{name:t,tel:a,email:p,address:h,payment:f}}}).then(()=>{e.reset(),$(),d.fire("新增訂單成功")}).catch(()=>{d.fire("新增訂單失敗")})};I();$();
