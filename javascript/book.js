function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
function searchBooks() {
  const input = document.getElementById("searchBar").value.toLowerCase();
  const books = document.querySelectorAll(".filterDiv");

  books.forEach((book) => {
      const title = book.querySelector("p").textContent.toLowerCase();
      if (title.includes(input)) {
          book.style.display = "block";
      } else {
          book.style.display = "none";
      }
  });
}


function addToCart(button) {
  let bookElement = button.closest(".book");
  let bookName = bookElement.getAttribute("data-name");
  let bookPrice = parseInt(bookElement.getAttribute("data-price"));
  let bookImage = bookElement.getAttribute("data-image");
  let bookCategory = bookElement.getAttribute("data-category") || "Không xác định";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingItem = cart.find(item => item.name === bookName);
  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({
          name: bookName,
          price: bookPrice,
          image: bookImage,
          category: bookCategory,
          quantity: 1
      });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Sản phẩm đã được thêm vào giỏ hàng!");
  displayCart();
}
