// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const aboutTitle = document.getElementById('aboutTitle');
    const welcomeSection = document.getElementById('welcomeSection');
    const missionSection = document.getElementById('missionSection');
    const teamSection = document.getElementById('teamSection');

    // Dynamically update content
    aboutTitle.textContent = 'About Our Shop';
    welcomeSection.querySelector('p').textContent = 'Explore our world of quality products and excellent service!';
    
    // Update the mission section text
    missionSection.querySelector('p').textContent = 'Our mission is to offer a wide variety of products that meet your needs, ensuring satisfaction with every purchase.';

    // Add event listener for an interactive feature in the mission section
    missionSection.querySelector('h2').addEventListener('click', () => {
        alert('Our mission is to serve you with excellence!');
    });

    // Highlight the team section on hover
    teamSection.addEventListener('mouseover', () => {
        teamSection.style.backgroundColor = '#f0f8ff'; // Light blue background
        teamSection.style.cursor = 'pointer'; // Change cursor to pointer
    });
    teamSection.addEventListener('mouseout', () => {
        teamSection.style.backgroundColor = ''; // Reset background
        teamSection.style.cursor = ''; // Reset cursor
    });

    // Add another interactivity feature for the welcome section
    welcomeSection.addEventListener('click', () => {
        alert('Welcome to our shop! Enjoy browsing our products!');
    });
});
