# UFO Sightings Data Scraper & Interactive Map 🛸

A comprehensive UFO sightings data collection and visualization platform that scrapes reports from NUFORC, processes them through automated pipelines, and presents them via an interactive web interface with Google Maps integration.

## 🌟 Features

- **Automated Data Collection**: Continuous scraping of UFO reports from NUFORC using Python scrapers
- **Proxy Management**: Built-in proxy server for robust web scraping
- **Database Integration**: MySQL database with SQLAlchemy ORM for efficient data storage
- **Interactive Web Interface**: Next.js-powered web application with Google Maps visualization
- **Advanced Filtering**: Search by country, state, year, shape, and more
- **Automated Deployment**: Cron job automation for continuous data updates
- **Error Recovery**: Intelligent retry mechanisms for failed record fetches

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- MySQL Server
- Node.js 16+ (for web interface)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ufo-sightings
   ```

2. **Set up Python environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure database credentials**
   Edit the database credentials in `stage3/fetchRecords.py`:

   ```python
   hostname = "your-mysql-host:3306"
   username = "your-username"
   password = "your-password"
   database = "nuforc"
   ```

4. **Set up automated scraping (optional)**
   Add to your crontab for automatic execution:
   ```bash
   @reboot sleep 300 && /path/to/your/project/initUfoScraper.sh
   ```

### Usage

#### Manual Execution

```bash
# Start the proxy server (in background)
python3 ./stage3/proxy.py &

# Run the UFO data fetcher
python3 ./stage3/fetchRecords.py
```

#### Automated Execution

```bash
# Make the script executable
chmod +x initUfoScraper.sh

# Run the initialization script
./initUfoScraper.sh
```

## 📁 Project Structure

## 🛠 Core Components

### Data Scraping Engine (`stage3/`)

- **`fetchRecords.py`**: Main orchestrator that manages the continuous data fetching process
  - Connects to MySQL database using SQLAlchemy
  - Implements error recovery for failed records
  - Manages database transactions and session handling
- **`fetchUfo.py`**: Individual UFO report scraper
  - Uses Selenium WebDriver for dynamic content scraping
  - Implements user agent rotation and proxy support
  - Processes HTML content with BeautifulSoup
- **`proxy.py`**: Lightweight HTTP proxy server
  - Facilitates web scraping through proxy rotation
  - Handles connection forwarding and data shuttling
  - Runs on localhost:8888 by default

### Database Schema

The application uses a MySQL database with the following main table structure:

```sql
UFOS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    occurred VARCHAR(255),
    reported VARCHAR(255),
    details JSON,
    description TEXT,
    posted VARCHAR(255),
    fetched DATETIME,
    RAW TEXT
)
```

### Web Interface Integration

The project includes a sophisticated Next.js web application with:

## 🔧 Configuration

### Database Configuration

Update the database connection settings in `stage3/fetchRecords.py`:

```python
hostname = "localhost:3306"  # Your MySQL host
username = "root"            # Your MySQL username
password = "your_password"   # Your MySQL password
database = "nuforc"          # Your database name
```

### Proxy Configuration

The proxy server runs on `127.0.0.1:8888` by default. Modify `stage3/proxy.py` to change:

```python
local_host = "127.0.0.1"
local_port = 8888
```

### Automation Setup

For continuous data collection, add to your system's crontab:

```bash
# Edit crontab
crontab -e

# Add this line for startup execution
@reboot sleep 300 && /full/path/to/initUfoScraper.sh
```

## 📊 Dependencies

### Python Packages

- **Web Scraping**: `selenium`, `beautifulsoup4`, `requests`
- **Database**: `SQLAlchemy`, `mysql-connector-python`
- **Data Processing**: `pandas`, `numpy`, `openpyxl`
- **Utilities**: `python-dotenv`, `geopy`, `pytz`

### System Requirements

- Chrome/Chromium browser (for Selenium WebDriver)
- MySQL Server 5.7+
- Stable internet connection for web scraping

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify MySQL server is running
   - Check database credentials and permissions
   - Ensure database `nuforc` exists

2. **Selenium WebDriver Issues**

   - Install Chrome/Chromium browser
   - Update WebDriver using `webdriver-manager`
   - Check for conflicting browser processes

3. **Proxy Connection Problems**

   - Verify proxy server is running (`python3 stage3/proxy.py`)
   - Check if port 8888 is available
   - Review firewall settings

4. **Log Analysis**
   Check application logs for detailed error information:
   ```bash
   tail -f ufo_scraper.log
   tail -f ufo_cron.log
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is created for educational and research purposes. Please respect the terms of use of the original data sources.

## ⚠️ Disclaimer

- This project was built **for fun, learning, and experimentation**
- The UFO sighting dataset does **not** belong to me
- Reports were originally compiled by the [National UFO Reporting Center (NUFORC)](https://nuforc.org/)
- The dataset was later made **publicly accessible by a third party** on [Kaggle](https://www.kaggle.com/datasets/NUFORC/ufo-sightings)
- Use responsibly and respect the source website's robots.txt and terms of service

## 🔗 Related Projects

- **N8N Workflows**: Automated data processing pipelines
- **SQL Analysis Tools**: Database analysis and reporting utilities

---

# **Made with 👽 for UFO enthusiasts and data science practitioners**
