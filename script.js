// script.js

// Ensure script runs after page load
document.addEventListener("DOMContentLoaded", function () {

  // ============== LOGIN ==============
  const loginForm = document.querySelector("#login-form");
  const submitButton = document.querySelector("#login-submit");

  if (loginForm) {
    loginForm.addEventListener("input", function () {
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      submitButton.disabled = !(username && password);
    });

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let username = document.querySelector("#username").value;
      let password = document.querySelector("#password").value;

      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          localStorage.setItem("username", data.username);
          alert("Login successful!");
          window.location.href = "accounts.html";
        } else {
          alert("Invalid credentials. Try again.");
        }
      })
      .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
        alert('An error occurred. Please try again later.');
      });
    });
  }
  
  // ============== ACCOUNTS ==============
  if (document.getElementById("account-details")) {
    let username = localStorage.getItem("username");
    if (username) {
      fetch(`http://localhost:5001/accounts/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(accounts => {
        let html = `<h3>Welcome, ${username}!</h3>`;
        accounts.forEach(account => {
          html += `<p><strong>${account.bank}:</strong> $${account.balance.toFixed(2)}</p>`;
        });
        document.getElementById("account-details").innerHTML = html;
      })
      .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
        alert('An error occurred while fetching account details. Please try again later.');
      });
    } else {
      document.getElementById("account-details").innerHTML = "<p>Please <a href='login.html'>login</a> to see your account details.</p>";
    }
  }

  // ============== BILL PAYMENT ==============
  const billForm = document.querySelector("#bill-form");
  if (billForm) {
    billForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let username = localStorage.getItem("username");
      let biller = document.querySelector("#biller").value;
      let amount = document.querySelector("#amount").value;
      let dueDate = document.querySelector("#due-date").value;

      fetch("http://localhost:5001/pay-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, biller, amount, dueDate })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
      })
      .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
        alert('An error occurred while processing the bill payment. Please try again later.');
      });
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    // ...existing code...
  
    // ============== CREDIT SCORE ==============
    function fetchCreditScore() {
      let username = localStorage.getItem("username");
      if (username) {
        fetch(`http://localhost:5001/credit-score/${username}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          let scoresHtml = `<p>Current Credit Score: ${data.currentScore}</p>`;
          if (data.previousScores.length) {
            scoresHtml += `<ul>`;
            data.previousScores.forEach(score => {
              scoresHtml += `<li>${score}</li>`;
            });
            scoresHtml += `</ul>`;
          }
          document.querySelector("#credit-info-container").innerHTML = scoresHtml;
        })
        .catch(err => {
          console.error('There was a problem with the fetch operation:', err);
          alert('An error occurred while fetching the credit score. Please try again later.');
        });
      }
    }
  
    if (document.getElementById("credit-history")) {
      fetchCreditScore(); // Fetch on page load
  
      // Add event listener for refresh button
      const refreshButton = document.querySelector("#refresh-credit");
      if (refreshButton) {
        refreshButton.addEventListener("click", fetchCreditScore);
      }
    }
  
    // ...existing code...
  });

  // ============== UPDATE PASSWORD ==============
  const updateForm = document.querySelector("#update-form");
  if (updateForm) {
    updateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let username = localStorage.getItem("username");
      let newPassword = document.querySelector("#new-password").value;

      fetch("http://localhost:5001/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
      })
      .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
        alert('An error occurred while updating the password. Please try again later.');
      });
    });
  }
});
