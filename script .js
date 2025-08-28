// --- Authentication ---
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");
const modalTitle = document.getElementById("modalTitle");
let isSignUp = false;

toggleAuth.querySelector("span").addEventListener("click", () => {
  isSignUp = !isSignUp;
  modalTitle.innerText = isSignUp ? "Sign Up" : "Sign In";
  authBtn.innerText = isSignUp ? "Sign Up" : "Sign In";
  document.querySelectorAll("#name,#address,#gender,#phone").forEach(el => {
    el.classList.toggle("hidden", !isSignUp);
  });
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isSignUp) {
    const user = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      gender: document.getElementById("gender").value,
      phone: document.getElementById("phone").value,
      email, password
    };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created! Please Sign In.");
    isSignUp = false;
    toggleAuth.querySelector("span").click();
  } else {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.email === email && savedUser.password === password) {
      authModal.style.display = "none";
      showPage("home");
    } else {
      alert("Invalid credentials!");
    }
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  authModal.style.display = "flex";
});

// --- Navigation ---
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

document.getElementById("shopNowBtn").addEventListener("click", () => showPage("shop"));

// --- Cart ---
let cart = [];
document.querySelectorAll(".addCartBtn").forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const product = ["Bag","Laptop","Camera","Headphone","Smartphone","Smartwatch"][idx];
    cart.push(product);
    alert(product + " added to cart!");
  });
});

document.getElementById("checkoutBtn").addEventListener("click", () => showPage("checkout"));

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = item + " ";
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => { cart.splice(i,1); updateCart(); };
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
}
setInterval(updateCart, 500);

// --- Checkout ---
document.querySelectorAll("input[name=payment]").forEach(radio => {
  radio.addEventListener("change", () => {
    const details = document.getElementById("paymentDetails");
    details.innerHTML = "";
    if (radio.value === "upi") {
      details.innerHTML = "<input type='text' placeholder='Enter UPI ID'><br><img src='upi.jpg' width='150'>";
    } else if (radio.value === "bank") {
      details.innerHTML = "<input type='text' placeholder='Account Number'><input type='text' placeholder='IFSC Code'>";
    }
  });
});

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  if (cart.length === 0) { alert("Cart is empty!"); return; }
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({ items: [...cart], date: new Date().toLocaleString() });
  localStorage.setItem("history", JSON.stringify(history));
  cart = [];
  updateCart();
  alert("Order placed successfully!");
  showPage("history");
  loadHistory();
});

// --- Order History ---
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const list = document.getElementById("orderHistory");
  list.innerHTML = "";
  history.forEach(order => {
    const li = document.createElement("li");
    li.textContent = order.date + " - " + order.items.join(", ");
    list.appendChild(li);
  });
}
setInterval(loadHistory, 2000);