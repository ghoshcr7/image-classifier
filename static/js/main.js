document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const imageUpload = document.getElementById('image-upload');
    const previewImage = document.getElementById('preview-image');
    const resultsContainer = document.getElementById('results-container');
    const predictionList = document.getElementById('prediction-list');
    const loader = document.getElementById('loader');

    // Preview image when selected
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                resultsContainer.style.display = 'flex';
                predictionList.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        if (!imageUpload.files[0]) {
            alert('Please select an image first');
            return;
        }
        
        // Show loader
        loader.style.display = 'block';
        predictionList.innerHTML = '';
        
        // Send request to server
        fetch('/classify', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Hide loader
            loader.style.display = 'none';
            
            if (data.success) {
                // Display predictions
                data.predictions.forEach(prediction => {
                    const li = document.createElement('li');
                    
                    const predictionItem = document.createElement('div');
                    predictionItem.className = 'prediction-item';
                    
                    const className = document.createElement('span');
                    className.textContent = prediction.class;
                    
                    const confidence = document.createElement('span');
                    confidence.textContent = prediction.confidence.toFixed(2) + '%';
                    
                    predictionItem.appendChild(className);
                    predictionItem.appendChild(confidence);
                    
                    const confidenceBar = document.createElement('div');
                    confidenceBar.className = 'confidence-bar';
                    confidenceBar.style.width = prediction.confidence + '%';
                    
                    li.appendChild(predictionItem);
                    li.appendChild(confidenceBar);
                    
                    predictionList.appendChild(li);
                });
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            alert('Error: ' + error);
        });
    });
});