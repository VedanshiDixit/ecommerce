const postOrder = async (url, data) => {
  console.log("Entered in to fetch");
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return result;
};
const razorpay = (order) => {
  var options = {
    key: order.rzp_key,
    amount: order.amount,
    currency: "INR",
    name: "Shophere",
    description: "Test Transaction",
    order_id: order.id,
    image: "https://pngimg.com/uploads/shopping_cart/shopping_cart_PNG38.png",
    handler: function (response) {
      console.log(response);
      console.log(response);
      response.order = order;
      fetch("/user/order/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          if (resData.status == `success`)
            window.location.href = `/user/orders`;
        })
        .catch(() => console.log("OOps Could not send Data"));
    },
    prefill: {
      name: "<%=loginUser.username%>",
      email: "<%=loginUser.email%>",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#00BCD4",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    fetch("/user/order/paymentfail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        window.location.href = res.redirect;
      });
  });
  console.log("Hit the RZP");
  rzp1.open();
};
document.getElementById("rzp-checkout").addEventListener("click", (e) => {
  e.preventDefault();
  const amount = document.getElementById("finalPrice").innerText * 100;
  let data = {
    amount: amount,
    currency: "INR",
  };

  postOrder("/user/order", data).then((order) => {
    if (order.failure) {
      window.location.href = "/user/cart";
    } else {
      document.getElementById("paymentModalLabel").innerText = order.id;
      const myModal = new mdb.Modal(document.getElementById("paymentModal"), {
        backdrop: `static`,
      });
      myModal.show();
      document.getElementById("rzp-payment").addEventListener("click", (e) => {
        razorpay(order);
      });
    }
  });
});

