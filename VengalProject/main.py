from flask import Flask, request, render_template
import os
from vengal import convert_to_pencil_art as cpa

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

output_file = "static/uploads/output2.jpg"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/designPage')
def designPage():
    return render_template('design.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return render_template('design.html', textinfo='No file part')

    file = request.files['image']
    if file.filename == '':
        return render_template('design.html', textinfo='No selected file')

    if file:
        filename = file.filename
        file_path =f"static/uploads/{filename}"
        file.save(file_path)
        cpa(file_path, output_file)
        print(file_path)
        return render_template("design.html", 
        textinfo=f"Image uploaded Sucessfully. Path: {output_file}", 
        inputImg=file_path, 
        outputImg=output_file)

@app.route('/paint')
def paintPage():
    return render_template('vengal1.html', outputImg=output_file)

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)
