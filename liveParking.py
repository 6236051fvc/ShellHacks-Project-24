import requests
from bs4 import BeautifulSoup

# Send a GET request to the website
url = 'https://operations.fiu.edu/parking/space-availability/index.html'
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content of the page
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the div with id="parking-widget"
    parking_widget_div = soup.find('div', id='parking-widget')

    if parking_widget_div:
        # Step-by-step navigation through the HTML structure to find the <strong> tag
        print("Parking widget div found.")

        # Attempting to navigate through the structure
        try:
            target_div = parking_widget_div.find('div').find('div')  # /div/div
            if target_div is None:
                print("First nested div not found.")
            else:
                print("First nested div found.")

            ul_tag = target_div.find('ul')  # /ul
            if ul_tag is None:
                print("ul tag not found.")
            else:
                print("ul tag found.")

            li_tag = ul_tag.find_all('li')[1]  # /li[2] (the second li element)
            if li_tag is None:
                print("Second li tag not found.")
            else:
                print("Second li tag found.")

            inner_div = li_tag.find('div').find('div').find('div')  # /div/div/div
            if inner_div is None:
                print("Inner div not found.")
            else:
                print("Inner div found.")

            strong_tag = inner_div.find('div').find('div').find('strong')  # /div/div/strong
            if strong_tag is None:
                print("strong tag not found.")
            else:
                available_spaces = strong_tag.text.strip()
                print("Number of available student spaces:", available_spaces)

        except Exception as e:
            print(f"An error occurred during parsing: {e}")

    else:
        print("Parking widget div not found on the page.")

else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
