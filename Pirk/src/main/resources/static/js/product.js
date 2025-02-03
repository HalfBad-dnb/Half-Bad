// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-button');

    // Add event listeners to all "Buy Now" buttons
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the closest product item
            const productItem = button.closest('.product-item');
            const productName = productItem.getAttribute('data-name');
            const productPrice = productItem.getAttribute('data-price');

            // Display a thank-you message with product details
            alert(`Thank you for purchasing ${productName} for $${productPrice}!`);
        });
    });
});
