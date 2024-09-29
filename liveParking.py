from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time
import json

# Set up the WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Open the webpage
url = 'https://operations.fiu.edu/parking/space-availability/index.html'
driver.get(url)

# Wait for the page to load
time.sleep(5)  # Adjust this as necessary

try:
    # Define static parking lot information
    parking_garages = {
        "PG1 (Gold Garage)": {
            "capacity": 500,
            "location": { "lat": 25.754854, "lng": -80.372082 }
        },
        "PG2 (Blue Garage)": {
            "capacity": 600,
            "location": { "lat": 25.753883, "lng": -80.372066 }
        },
        "PG3 (Panther Parking)": {
            "capacity": 700,
            "location": { "lat": 25.758448, "lng": -80.379823 }
        },
        "PG4 (Red Garage)": {
            "capacity": 400,
            "location": { "lat": 25.760168, "lng": -80.373150 }
        },
        "PG5 (Market Station)": {
            "capacity": 350,
            "location": { "lat": 25.760125, "lng": -80.371642 }
        },
        "PG6 (Tech Station)": {
            "capacity": 800,
            "location": { "lat": 25.760144, "lng": -80.374555 }
        }
    }

    # Find all strong tags using the specified XPath for available spaces
    strong_tags = driver.find_elements(By.XPATH, '//*[@id="parking-widget"]/div/div/ul/li/div/div/div[2]/div/div/strong')

    # Check if any strong tags were found
    available_spaces_list = []
    if strong_tags:
        for strong in strong_tags:
            available_spaces_list.append(int(strong.text.strip()))  # Convert to int for consistency
    else:
        print("No strong tags found for available spaces.")

    # Create a dictionary to hold parking garage data
    parking_data = {}
    
    # Iteratively add available spaces to each parking garage entry
    for (garage_name, info), available_spaces in zip(parking_garages.items(), available_spaces_list):
        parking_data[garage_name] = {
            "capacity": info["capacity"],
            "available_spaces": available_spaces,
            "location": info["location"]
        }

    # Write the structured data to a JSON file
    with open('parking_data.json', 'w') as json_file:
        json.dump(parking_data, json_file, indent=4)  # Use indent for pretty-printing

    print("Data written to parking_data.json")

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Close the browser
    driver.quit()
