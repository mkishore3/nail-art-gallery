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
            const modal = document.getElementById('imageModal');
            const modalImage = modal.querySelector('.modal-image');
            const modalDescription = modal.querySelector('.modal-description');
            const closeModal = modal.querySelector('.close-modal');

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

                // Add click event to open modal
                container.addEventListener('click', () => {
                    modalImage.src = item.file;
                    modalImage.alt = imgElement.alt;
                    modalDescription.textContent = item.description;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                });

                // Append the container to the gallery
                gallery.appendChild(container);
            });

            // Close modal when clicking the close button
            closeModal.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });

            // Close modal when clicking outside the image
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Tag filtering logic
            const tags = document.querySelectorAll('.tag');
            const showAllButton = document.getElementById('showAll');
            const images = document.querySelectorAll('.image-container');

            // Function to update the displayed image count
            function updateImageCount() {
                const visibleImages = Array.from(images).filter(container => 
                    container.style.display !== 'none'
                ).length;
                const totalImages = images.length;
                const countText = document.querySelector('p:has(b)');
                if (countText) {
                    countText.innerHTML = `There are currently <b>${visibleImages} of ${totalImages} images</b> displayed. Check back often to see new nail art!`;
                }
            }

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
                updateImageCount(); // Update count after filtering
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
