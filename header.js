function getCartItems() {
  db.collection("cart-items").onSnapshot((onSnapshot) => {
    let totalCount = 0;
    onSnapshot.forEach((doc) => {
      totalCount += doc.data().quantity;
    });

    setCartCounter(totalCount);
  });
}

function setCartCounter(totalCount) {
  // cart-item-number
  document.querySelector(".cart-item-number").innerText = totalCount;
}

getCartItems();
