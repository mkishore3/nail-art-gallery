document.addEventListener('DOMContentLoaded', function() {
    // Get all tag buttons
    const tags = document.querySelectorAll('.tag');
    const showAllButton = document.getElementById('showAll');
    const images = document.querySelectorAll('.image');

    // Function to filter images based on the selected tag
    function filterImages(tag) {
        images.forEach(image => {
            // Get the data-tags attribute and split it into an array
            const imageTags = image.getAttribute('data-tags').split(' ');

            // If the image has the selected tag, show it; otherwise, hide it
            if (imageTags.includes(tag) || tag === 'all') {
                image.style.display = 'block'; // Show the image
            } else {
                image.style.display = 'none'; // Hide the image
            }
        });
    }

    // Event listeners for each tag button
    tags.forEach(tagButton => {
        tagButton.addEventListener('click', function() {
            const tag = tagButton.getAttribute('data-tag');
            filterImages(tag); // Filter images based on the selected tag
        });
    });

    // Show all images when the "Show All" button is clicked
    showAllButton.addEventListener('click', function() {
        filterImages('all');
    });

    // Initialize by showing all images when the page loads
    filterImages('all');
});
