"""
UFO Sighting Report Fetcher

IMPORTANT DISCLAIMER:
- All UFO sighting data belongs exclusively to the National UFO Reporting Center (NUFORC)
- This script is for EDUCATIONAL and PERSONAL USE ONLY
- NO commercial use or income generation intended
- I perform the data collection myself for personal educational purposes only
- This project respects NUFORC's intellectual property rights

WARNING: Web scraping may be subject to website terms of service.
This code is used by me personally for educational learning only.

Created for learning purposes only.
"""

# Proxy configuration - set to None to disable proxy
USE_PROXY = True
proxies = (
    {
        "http": "http://127.0.0.1:8888",
        "https": "http://127.0.0.1:8888",
    }
    if USE_PROXY
    else None
)

user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/96.0.4664.53 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux i686; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
]

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import random
import sys

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

from processRAWfunc import process_raw

current_user_agent = random.choice(user_agents)
headers = {"User-Agent": current_user_agent}


def get_chrome_driver():
    """Create and return a configured Chrome WebDriver instance"""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-web-security")
    options.add_argument("--disable-features=VizDisplayCompositor")
    options.add_argument(
        f"--user-data-dir=/tmp/chrome-user-data-{random.randint(1000, 9999)}"
    )
    options.add_argument(
        "user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    )

    return webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )


url_base = "https://nuforc.org/"


def last_record_id():
    """Get the last record ID with retry logic and better error handling"""
    max_retries = 5
    base_delay = 5  # Base delay in seconds
    driver = None

    for attempt in range(max_retries):
        try:
            print(
                f"Attempting to fetch last record ID (attempt {attempt + 1}/{max_retries})"
            )

            # Increase timeout and add retry logic for the initial request
            timeout = 5 + (attempt * 5)  # Increase timeout with each retry

            # Try with proxy first, then without if it fails
            try:
                response1 = requests.get(
                    f"{url_base}ndx/?id=event",
                    proxies=proxies,
                    headers=headers,
                    timeout=timeout,
                )
            except (
                requests.exceptions.Timeout,
                requests.exceptions.ReadTimeout,
                requests.exceptions.ConnectionError,
            ) as e:
                if proxies:
                    print(f"Proxy request failed, trying without proxy: {e}")
                    response1 = requests.get(
                        f"{url_base}ndx/?id=event",
                        headers=headers,
                        timeout=timeout,
                    )
                else:
                    raise
            response1.raise_for_status()

            soup = BeautifulSoup(response1.text, "html.parser")
            primary = soup.find("div", id="primary")

            if not primary:
                raise Exception("Could not find primary div element")

            table = primary.find("table")
            if not table:
                raise Exception("Could not find table element")

            current_month = table.find_all("tr")[0]
            if not current_month or not current_month.a:
                raise Exception("Could not find current month link")

            current_month_href = current_month.a["href"]

            driver = get_chrome_driver()
            driver.get(f"{url_base}{current_month_href}")

            # Wait for the table #table_1 to have at least 2 rows (adjust selector/timeout)
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "#table_1 tbody tr:nth-child(1)")
                )
            )

            # Optionally wait a little more for async loads:
            time.sleep(3)

            html = driver.page_source
            soup = BeautifulSoup(html, "html.parser")
            tbody = soup.find("table", id="table_1")

            if not tbody:
                raise Exception("Could not find table_1 element")

            tbody = tbody.find("tbody")
            if not tbody:
                raise Exception("Could not find tbody element")

            last_record = tbody.select_one("tr:nth-child(1)")
            if not last_record or not last_record.a:
                raise Exception("Could not find last record link")

            last_record_href = last_record.a["href"]
            last_record_id = int(last_record_href.split("=")[-1])

            print(f"Successfully fetched last record ID: {last_record_id}")
            return last_record_id

        except (requests.exceptions.Timeout, requests.exceptions.ReadTimeout) as e:
            print(f"Timeout error on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise Exception(
                    f"Failed to fetch last record ID after {max_retries} attempts due to timeout"
                )

        except (
            requests.exceptions.ConnectionError,
            requests.exceptions.RequestException,
        ) as e:
            print(f"Network error on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise Exception(
                    f"Failed to fetch last record ID after {max_retries} attempts due to network error"
                )

        except Exception as e:
            print(f"General error on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise Exception(
                    f"Failed to fetch last record ID after {max_retries} attempts: {e}"
                )

        finally:
            if driver:
                driver.quit()
                driver = None

        # Exponential backoff with jitter
        if attempt < max_retries - 1:
            delay = (base_delay * (2**attempt) + random.uniform(1, 3)) / 2
            print(f"Waiting {delay:.2f} seconds before retry...")
            time.sleep(delay)


def fetchUfo(ufo_id, failure_count=0):
    if failure_count >= 10:
        print(f"Exceeded 10 consecutive failures. Killing process...")
        sys.exit(1)

    f_count = failure_count
    max_retries = 3
    base_delay = 2

    for attempt in range(max_retries):
        try:
            # Increase timeout with each retry
            timeout = (15 + (attempt * 10)) / 2
            print(
                f"Fetching UFO {ufo_id} (attempt {attempt + 1}/{max_retries}, timeout: {timeout}s)"
            )

            # Try with proxy first, then without if it fails
            try:
                response = requests.get(
                    f"{url_base}sighting/?id={ufo_id}",
                    proxies=proxies,
                    headers=headers,
                    timeout=timeout,
                )
            except (
                requests.exceptions.Timeout,
                requests.exceptions.ReadTimeout,
                requests.exceptions.ConnectionError,
            ) as e:
                if proxies:
                    print(f"Proxy request failed, trying without proxy: {e}")
                    response = requests.get(
                        f"{url_base}sighting/?id={ufo_id}",
                        headers=headers,
                        timeout=timeout,
                    )
                else:
                    raise
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            content_area = soup.find("div", class_="content-area")

            if content_area:
                processed_data = process_raw(str(content_area))
                data = {
                    **processed_data.__dict__,
                    "fetched": datetime.now(),
                    "RAW": str(content_area),
                }
                f_count = 0  # Reset failure count on success
                print(f"Successfully fetched UFO {ufo_id}")
                return data, f_count

            else:
                data = {
                    "title": f"NUFORC UFO Sighting {ufo_id}",
                    "RAW": "Could not find '.content-area'",
                }
                f_count += 1  # Increment failure count on failure
                return data, f_count

        except (requests.exceptions.Timeout, requests.exceptions.ReadTimeout) as e:
            print(f"Timeout error for UFO {ufo_id} on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                data = {
                    "title": f"NUFORC UFO Sighting {ufo_id}",
                    "RAW": f"Timeout error after {max_retries} attempts: {e}",
                }
                f_count += 1
                return data, f_count

        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error for ID {ufo_id}: {e}")
            data = {
                "title": f"NUFORC UFO Sighting {ufo_id}",
                "RAW": f"HTTP Error occurred: {e}",
            }
            f_count += 1  # Increment failure count on failure
            return data, f_count

        except (
            requests.exceptions.ConnectionError,
            requests.exceptions.RequestException,
        ) as e:
            print(f"Network error for UFO {ufo_id} on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                data = {
                    "title": f"NUFORC UFO Sighting {ufo_id}",
                    "RAW": f"Network error after {max_retries} attempts: {e}",
                }
                f_count += 1
                return data, f_count

        # Wait before retry with exponential backoff
        if attempt < max_retries - 1:
            delay = (base_delay * (2**attempt) + random.uniform(0.5, 1.5)) / 2
            print(f"Waiting {delay:.2f} seconds before retry...")
            time.sleep(delay)

    # This shouldn't be reached, but just in case
    data = {
        "title": f"NUFORC UFO Sighting {ufo_id}",
        "RAW": f"Failed to fetch after {max_retries} attempts",
    }
    f_count += 1
    return data, f_count
