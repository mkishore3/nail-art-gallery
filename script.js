document.addEventListener('DOMContentLoaded', function () {
    const tags = document.querySelectorAll('.tag');
    const showAllButton = document.getElementById('showAll');
    const gallery = document.getElementById('gallery');

    // Function to render images from JSON data
    function renderImages(data) {
        gallery.innerHTML = ''; // Clear the gallery

        data.forEach(item => {
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image');
            imageDiv.setAttribute('data-tags', item.tags.join(' '));

            const imgElement = document.createElement('img');
            imgElement.src = item.file;
            imgElement.alt = `Nail art with tags: ${item.tags.join(', ')}`;

            imageDiv.appendChild(imgElement);
            gallery.appendChild(imageDiv);
        });
    }

    // Function to filter images based on the selected tag
    function filterImages(tag) {
        const images = document.querySelectorAll('.image');
        images.forEach(image => {
            const imageTags = image.getAttribute('data-tags').split(' ');

            if (imageTags.includes(tag) || tag === 'all') {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        });
    }

    // Event listeners for each tag button
    tags.forEach(tagButton => {
        tagButton.addEventListener('click', function () {
            const tag = tagButton.getAttribute('data-tag');
            filterImages(tag);
        });
    });

    // Show all images when the "Show All" button is clicked
    showAllButton.addEventListener('click', function () {
        filterImages('all');
    });

    // Fetch JSON data and initialize the gallery
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderImages(data);
            filterImages('all'); // Show all images initially
        })
        .catch(error => console.error('Error loading JSON data:', error));
});
