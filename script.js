document.addEventListener('DOMContentLoaded', function () {
    // Fetch the JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load JSON');
            }
            return response.json();
        })
        .then(data => {
            // Get the gallery container
            const gallery = document.getElementById('gallery');

            // Render images dynamically
            data.forEach(item => {
                const imgElement = document.createElement('img');
                imgElement.src = item.file; // Ensure this matches the paths in data.json
                imgElement.alt = `Nail art with tags: ${item.tags.join(', ')}`;
                imgElement.classList.add('image'); // Add class for styling
                imgElement.setAttribute('data-tags', item.tags.join(' ')); // Add tags as a space-separated string
                gallery.appendChild(imgElement);
            });

            // Tag filtering logic
            const tags = document.querySelectorAll('.tag');
            const showAllButton = document.getElementById('showAll');
            const images = document.querySelectorAll('.image');

            function filterImages(tag) {
                images.forEach(image => {
                    const imageTags = image.getAttribute('data-tags').split(' ');
                    if (imageTags.includes(tag) || tag === 'all') {
                        image.style.display = 'block';
                    } else {
                        image.style.display = 'none';
                    }
                });
            }

            tags.forEach(tagButton => {
                tagButton.addEventListener('click', function () {
                    const tag = tagButton.getAttribute('data-tag');
                    filterImages(tag);
                });
            });

            showAllButton.addEventListener('click', function () {
                filterImages('all');
            });

            filterImages('all'); // Show all images by default
        })
        .catch(error => console.error('Error:', error));
});
