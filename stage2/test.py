import requests
from bs4 import BeautifulSoup


try:
    # Make a GET request to the HTML endpoint
    response = requests.get(f"https://nuforc.org/sighting/?id=3512")
    response.raise_for_status()

    # Parse the HTML content
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the main content area
    content_area = soup.find("div", class_="content-area")

    if content_area:
        # Extract the data using CSS selectors
        title = (
            content_area.find("h1").get_text(strip=True)
            if content_area.find("h1")
            else None
        )

        # Extract text from bold tags and their siblings
        # This approach is more robust than matching raw text
        def find_next_sibling_text(tag, text):
            sibling = tag.find(lambda t: t.name == "b" and text in t.get_text())
            return (
                sibling.next_sibling.strip()
                if sibling and sibling.next_sibling
                else None
            )

        occurred = find_next_sibling_text(content_area, "Occurred:")
        reported = find_next_sibling_text(content_area, "Reported:")
        duration = find_next_sibling_text(content_area, "Duration:")
        location = find_next_sibling_text(content_area, "Location:")
        shape = find_next_sibling_text(content_area, "Shape:")

        # Special case for description, finding text between two tags
        description_tag_start = content_area.find("b", string="Shape:")
        description = None
        if description_tag_start:
            # Find the next br tag and get the text until the next br tag
            next_br = description_tag_start.find_next_sibling("br")
            if next_br and next_br.next_sibling:
                description = next_br.next_sibling.get_text(strip=True)

        # Extract posted date from italic tag
        posted_tag = content_area.find("i")
        posted = (
            posted_tag.get_text(strip=True).replace("Posted ", "")
            if posted_tag
            else None
        )

        # Print the extracted data
        print("Title:", title)
        print("Occurred:", occurred)
        print("Reported:", reported)
        print("Duration:", duration)
        print("Location:", location)
        print("Shape:", shape)
        print("Description:", description)
        print("Posted:", posted)

    else:
        print(f"Could not find the .content-area for ID {ufoId}")

except requests.exceptions.HTTPError as errh:
    print(f"Http Error: {errh}")
except requests.exceptions.RequestException as err:
    print(f"Oops: Something Else: {err}")
