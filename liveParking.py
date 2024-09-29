import requests
from bs4 import BeautifulSoup

# Send a GET request to the website
url = 'https://operations.fiu.edu/parking/space-availability/index.html'
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content of the page
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all <span> tags to locate the one containing "student spaces available"
    span_tags = soup.find_all('span')

    # Variable to hold the number of spaces available
    available_spaces = None

    # Loop through span tags to find the relevant number
    for span in span_tags:
        if "student spaces available" in span.text:
            # Get the parent element and find the <strong> tag
            strong_tag = span.find_previous('strong')
            if strong_tag:
                available_spaces = strong_tag.text.strip()  # Get the number
            break  # Exit the loop after finding the desired span

    # Check if available_spaces was found and print the result
    if available_spaces:
        print("Number of student spaces available:", available_spaces)
    else:
        print("Student space available information not found.")

else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")