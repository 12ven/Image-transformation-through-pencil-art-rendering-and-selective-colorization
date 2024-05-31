import cv2
from PIL import Image, ImageFilter
import sys

def convert_to_pencil_art(input_path, output_path):
    # Read the image using OpenCV
    img = cv2.imread(input_path)

    # Convert the image to grayscale
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply GaussianBlur to the grayscale image
    blurred_img = cv2.GaussianBlur(gray_img, (21, 21), 0)

    # Invert the blurred image to create a pencil sketch effect
    inverted_img = cv2.bitwise_not(blurred_img)

    # Convert the inverted image to a PIL Image
    pil_img = Image.fromarray(inverted_img)

    # Apply a pencil-like filter using the ImageFilter module
    pencil_art = pil_img.filter(ImageFilter.CONTOUR)

    # Save the resulting image
    pencil_art.save(output_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pencil_art_converer.py input_image_path output_image_path")
        sys.exit(1)

    input_image_path = sys.argv[1]
    output_file_path = sys.argv[2]
    

    convert_to_pencil_art(input_image_path, output_file_path)