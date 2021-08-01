function getCartItems() {
  db.collection("cart-items").onSnapshot((snapshot) => {
    let cartItem = [];
    snapshot.docs.forEach((doc) => {
      cartItem.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateCartItems(cartItem);
    getTotalCost(cartItem);
  });
}

// Get The Total cost
function getTotalCost(items) {
  let totalCost = 0;
  items.forEach((item) => {
    totalCost += item.price * item.quantity;
  });
  document.querySelector(".total-cost-number").innerText =
    numeral(totalCost).format("$0,0.00");
}

// Decrease cartItem functionality
function decreaseCount(itemID) {
  // Grab data from database
  let cartItem = db.collection("cart-items").doc(itemID);
  cartItem.get().then(function (doc) {
    if (doc.exists) {
      if (doc.data().quantity > 1) {
        cartItem.update({
          quantity: doc.data().quantity - 1,
        });
      }
    }
  });
}

// Incerease cartItem functionality
function increaseCount(itemID) {
  // Grab data from database
  let cartItem = db.collection("cart-items").doc(itemID);
  cartItem.get().then(function (doc) {
    if (doc.exists) {
      if (doc.data().quantity > 0) {
        cartItem.update({
          quantity: doc.data().quantity + 1,
        });
      }
    }
  });
}

// Delete item functionality
function deleteItem(itemID) {
  db.collection("cart-items").doc(itemID).delete();
}

function generateCartItems(cartItem) {
  let itemsHTML = "";
  cartItem.forEach((item) => {
    itemsHTML += `
        <div class="cart-item flex items-center pb-4 border-b border-gray-200">
        <div class="cart-items-image w-40 h-24 bg-white p-4 rounded-lg">
            <img class="w-full h-full object-contain"
                src="${item.image}">
        </div>
        <div class="cart-item-details flex-grow">
            <div class="cart-item-title font-bold text-sm text-gray-600">
                ${item.name}
            </div>
            <div class="cart-item-brand text-sm text-gray-400">
               ${item.make}
            </div>
        </div>
        <div class="cart-item-counter w-48 flex items-center">
            <div data-id="${item.id}"
                class="cart-item-decrease cursor-pointer text-gray-400 bg-gray-100 rounded h-6 w-6 flex justify-center items-center hover:bg-gray-300 mr-2">
                <i class="fas fa-chevron-left fa-xs"></i>
            </div>
            <h4 class="text-gray-400">x${item.quantity}</h4>
            <div data-id="${item.id}"
                class="cart-item-increase cursor-pointer text-gray-400 bg-gray-100 rounded h-6 w-6 flex justify-center items-center hover:bg-gray-300 ml-2">
                <i class="fas fa-chevron-right fa-xs"></i>
            </div>
        </div>
        <div class="cart-item-total-cost w-48 font-bold text-gray-400">
            ${numeral(item.price * item.quantity).format("$0,0.00")}
        </div>
        <div data-id="${
          item.id
        }"  class="cart-item-delete w-10 font-bold text-gray-300 cursor-pointer hover:text-gray-500">
            <i class="fas fa-times"></i>
        </div>
    </div>
        `;
  });
  document.querySelector(".cart-items").innerHTML = itemsHTML;
  createEventListeners();
}

function createEventListeners() {
  let decreaseButtons = document.querySelectorAll(".cart-item-decrease");
  let increaseButtons = document.querySelectorAll(".cart-item-increase");
  let deleteButtons = document.querySelectorAll(".cart-item-delete");

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      decreaseCount(button.dataset.id);
    });
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      increaseCount(button.dataset.id);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      deleteItem(button.dataset.id);
    });
  });
}

getCartItems();
