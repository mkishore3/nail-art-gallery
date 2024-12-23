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
                // Create a container for each image and description
                const container = document.createElement('div');
                container.classList.add('image-container');

                // Create the image element
                const imgElement = document.createElement('img');
                imgElement.src = item.file; 
                imgElement.alt = `Nail art with tags: ${item.tags.join(', ')}`;
                imgElement.classList.add('image'); 
                imgElement.setAttribute('data-tags', item.tags.join(' ')); 

                // Create the description element
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = item.description;
                descriptionElement.classList.add('description'); 

                // Append the image and description to the container
                container.appendChild(imgElement);
                container.appendChild(descriptionElement);

                // Append the container to the gallery
                gallery.appendChild(container);
            });

            // Tag filtering logic
            const tags = document.querySelectorAll('.tag');
            const showAllButton = document.getElementById('showAll');
            const images = document.querySelectorAll('.image-container');

            function filterImages(tag) {
                images.forEach(imageContainer => {
                    const imageTags = imageContainer
                        .querySelector('img')
                        .getAttribute('data-tags')
                        .split(' ');
                    if (imageTags.includes(tag) || tag === 'all') {
                        imageContainer.style.display = 'block';
                    } else {
                        imageContainer.style.display = 'none';
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
