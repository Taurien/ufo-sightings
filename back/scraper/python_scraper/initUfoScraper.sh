#!/bin/zsh
LOGFILE=/home/taurien_l/Desktop/Lab/UFOS/back/scraper/python_scraper/ufo_scraper.log

{
  echo "=== Script started at $(date) ==="

  # # Navigate to the project directory
  # cd /home/taurien_l/Desktop/Lab/UFOS || { echo "Failed to cd"; exit 1; }

  # # Use the virtual environment Python directly
  # PYTHON_VENV="/home/taurien_l/Desktop/Lab/UFOS/.venv/bin/python"

  # # Navigate to directory where the scripts are located
  # cd /home/taurien_l/Desktop/Lab/UFOS/back || { echo "Failed to cd to back"; exit 1; }
  

  # # Execute the proxy script (optional, continue even if it fails)
  # $PYTHON_VENV utils/proxy.py &
  # PROXY_PID=$!
  
  # # Wait a moment to see if proxy starts successfully
  # sleep 1
  
  # # Check if proxy is still running, if not, continue anyway
  # if ! kill -0 $PROXY_PID 2>/dev/null; then
  #   echo "Proxy failed to start or exited immediately (may already be running)"
  # else
  #   echo "Proxy started successfully with PID $PROXY_PID"
  # fi

  # # Execute the fetcher script
  # $PYTHON_VENV scraper/python_scraper/fetchRecords.py

  echo "=== Script finished at $(date) ==="
} >> $LOGFILE 2>&1
