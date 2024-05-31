document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('image-upload');
    const colorPicker = document.getElementById('color-picker');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let uploadedImage;
    let brushSize = 5;
    let erasing = false;
    let history = []; // Store canvas states for undo

    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                uploadedImage = img;
            }
            img.src = e.target.result;
        }

        reader.readAsDataURL(file);
    });

    canvas.addEventListener('mousemove', function(event) {
        if (uploadedImage) {
            const x = event.offsetX;
            const y = event.offsetY;
            if (event.buttons === 1 || event.buttons === 3) {
                if (erasing) {
                    ctx.putImageData(history.pop(), 0, 0); // Revert to previous state
                } else {
                    const color = colorPicker.value;
                    ctx.fillStyle = color;
                    ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
                }
            }
        }
    });

    canvas.addEventListener('mousedown', function(event) {
        if (uploadedImage) {
            canvas.addEventListener('mousemove', draw);
        }
    });

    canvas.addEventListener('mouseup', function() {
        if (uploadedImage) {
            canvas.removeEventListener('mousemove', draw);
        }
    });

    function draw(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        if (erasing) {
            ctx.putImageData(history.pop(), 0, 0); // Revert to previous state
        } else {
            const color = colorPicker.value;
            ctx.fillStyle = color;
            ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
        }
    }

    document.getElementById('increase-size').addEventListener('click', function() {
        brushSize += 5;
    });

    document.getElementById('decrease-size').addEventListener('click', function() {
        brushSize = Math.max(5, brushSize - 5);
    });

    document.getElementById('eraser').addEventListener('click', function() {
        erasing = !erasing;
    });

    document.getElementById('switch-mode').addEventListener('click', function() {
        erasing = !erasing; // Toggle between brush and eraser modes
        if (erasing) {
            this.innerText = 'Switch to Brush';
        } else {
            this.innerText = 'Switch to Eraser';
        }
    });

    document.getElementById('save').addEventListener('click', function() {
        const dataURL = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Store the canvas state before color application
    canvas.addEventListener('mousedown', function() {
        if (!erasing) {
            history.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Store canvas state for undo
        }
    });
});
