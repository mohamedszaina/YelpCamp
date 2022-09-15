// Get alert element
let myAlert = document.querySelector(".myAlert");
// Create Bootstrap alert instance
let bsAlert = new bootstrap.Alert(myAlert);
// Dismiss time out
setTimeout(() => {
  bsAlert.close();
}, 5000);
