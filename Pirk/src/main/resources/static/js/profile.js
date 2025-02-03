// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-profile-button');
    const cancelButton = document.getElementById('cancel-edit-button');
    const profileForm = document.getElementById('profile-form');
    const editProfileSection = document.querySelector('.edit-profile-form');
    const profileInfoSection = document.querySelector('.profile-info');

    const usernameDisplay = document.getElementById('username');
    const emailDisplay = document.getElementById('email');
    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');

    // Show the edit form when "Edit Profile" is clicked
    editButton.addEventListener('click', () => {
        profileInfoSection.style.display = 'none';
        editProfileSection.style.display = 'block';

        // Populate input fields with current profile values
        usernameInput.value = usernameDisplay.textContent;
        emailInput.value = emailDisplay.textContent;
    });

    // Hide the edit form when "Cancel" is clicked
    cancelButton.addEventListener('click', () => {
        editProfileSection.style.display = 'none';
        profileInfoSection.style.display = 'block';
    });

    // Save the updated profile information
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        // Update the displayed profile information
        usernameDisplay.textContent = usernameInput.value;
        emailDisplay.textContent = emailInput.value;

        // Hide the edit form and show the profile info
        editProfileSection.style.display = 'none';
        profileInfoSection.style.display = 'block';

        alert('Profile updated successfully!');
    });
});
