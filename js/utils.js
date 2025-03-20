/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

//Display the current year on the footer
document.getElementById('currentYear').textContent = new Date().getFullYear();
//Show the ad modal on page load
document.addEventListener("DOMContentLoaded", function () {
    var adModal = new bootstrap.Modal(document.getElementById('adModal'));
    adModal.show();
});       
