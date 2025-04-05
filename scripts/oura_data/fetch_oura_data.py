# -------------------------------------------------------
#  Oura Ring API Data Collection
# -------------------------------------------------------
#   1. Connects to the Oura Ring API
#   2. Fetches different types of data (sleep, activity, readiness)
#   3. Converts the data to CSV format
#   4. (Bonus) Uploads the data to Supabase
# -------------------------------------------------------

# TODO: Import the necessary libraries
# Hint: You'll need modules for:
#   - Making API requests (requests or oura-ring package)
#   - Handling environment variables
#   - Working with dates
#   - CSV operations
#   - (Optional) Data manipulation with pandas


# TODO: Set up environment variables
# Hint: Use python-dotenv to load your OURA_API_KEY from a .env file

from dotenv import load_dotenv
import os
import requests
import pandas as pd
from oura_ring import OuraClient
from datetime import datetime, timedelta

load_dotenv()

OURA_API_KEY = os.getenv("OURA_API_KEY")


# TODO: Create a function to fetch data from the Oura API
# Function: fetch_oura_data
# Parameters:
#   - data_type: Type of data to fetch (sleep, activity, readiness)
#   - start_date: Start date in YYYY-MM-DD format
#   - end_date: End date in YYYY-MM-DD format
# Returns:
#   - List of data for the specified type and date range
#
# Note: You can either use the requests library and construct API calls directly,
# or use the oura-ring package which simplifies the process.
# Documentation: https://pypi.org/project/oura-ring/
def fetch_oura_data(data_type, start_date, end_date):
    # Create Oura client
    client = OuraClient(OURA_API_KEY)
    
    try:
        print(f"  Making API call for {data_type}...")
        if data_type == "sleep":
            return client.get_daily_sleep(start_date=start_date, end_date=end_date)
        elif data_type == "heart_rate":
            try:
                # Try different parameter combinations
                print("  Trying with start_datetime/end_datetime...")
                result = client.get_heart_rate(start_datetime=start_date, end_datetime=end_date)
                print("  Success!")
                return result
            except Exception as e1:
                print(f"  Failed with start_datetime/end_datetime: {e1}")
                try:
                    print("  Trying with no parameters (default behavior)...")
                    result = client.get_heart_rate()
                    print("  Success with no parameters!")
                    return result
                except Exception as e2:
                    print(f"  Failed with no parameters: {e2}")
                    raise ValueError(f"Could not get heart rate data with any parameter combination: {e1}, {e2}")
        elif data_type == "activity":
            return client.get_daily_activity(start_date=start_date, end_date=end_date)
        elif data_type == "readiness":
            return client.get_daily_readiness(start_date=start_date, end_date=end_date)
        elif data_type == "sleep_time":
            return client.get_sleep_time(start_date=start_date, end_date=end_date)
        elif data_type == "spo2":
            return client.get_daily_spo2(start_date=start_date, end_date=end_date)
        elif data_type == "stress":
            return client.get_daily_stress(start_date=start_date, end_date=end_date)
        else:
            print(f"Unknown data type: {data_type}")
            return None
    except Exception as e:
        import traceback
        print(f"Error fetching {data_type} data: {e}")
        print(f"Error details: {traceback.format_exc()}")
        return None


# TODO: Create a function to convert the data to CSV
# Function: convert_to_csv
# Parameters:
#   - data: List of dictionaries containing the Oura data
#   - filename: Name of the CSV file to create
# Returns:
#   - Boolean indicating success or failure
#
# Hint: You can use the csv module's DictWriter or pandas DataFrame.to_csv()
def convert_to_csv(list_data, string_filename):
    if list_data == None:
        print("Error no data")
        return False
    
    df = pd.DataFrame(list_data)
    df.to_csv(string_filename) 
    return True


# TODO: Implement the main function
# This should:
#   1. Calculate the date range (e.g., last 30 days)
#   2. Call the fetch_oura_data function for each data type
#   3. Call the convert_to_csv function for each dataset
#   4. (Bonus) Implement error handling
#   5. (Bonus) Add command-line arguments for date range, data types, etc.

def main():
    try:
        # Calculate date range (last 30 days)
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        print(f"Fetching Oura data from {start_date} to {end_date}...")
        
        # Fetch different types of data with detailed logging
        print("Fetching sleep data...")
        sleep_data = fetch_oura_data("sleep", start_date, end_date)
        print(f"Got sleep data: {len(sleep_data) if sleep_data else 0} records")
        
        print("Fetching heart rate data...")
        heart_rate_data = fetch_oura_data("heart_rate", start_date, end_date)
        print(f"Got heart rate data: {len(heart_rate_data) if heart_rate_data else 0} records")
        
        print("Fetching activity data...")
        daily_data = fetch_oura_data("activity", start_date, end_date)
        print(f"Got activity data: {len(daily_data) if daily_data else 0} records")
        
        print("Fetching readiness data...")
        daily_readiness = fetch_oura_data("readiness", start_date, end_date)
        print(f"Got readiness data: {len(daily_readiness) if daily_readiness else 0} records")
        
        print("Fetching sleep time data...")
        sleep_time_data = fetch_oura_data("sleep_time", start_date, end_date)
        print(f"Got sleep time data: {len(sleep_time_data) if sleep_time_data else 0} records")
        
        print("Fetching blood oxygen data...")
        blood_oxygen_data = fetch_oura_data("spo2", start_date, end_date)
        print(f"Got blood oxygen data: {len(blood_oxygen_data) if blood_oxygen_data else 0} records")
        
        print("Fetching stress data...")
        stress_data = fetch_oura_data("stress", start_date, end_date)
        print(f"Got stress data: {len(stress_data) if stress_data else 0} records")
        
        # Convert each dataset to CSV
        print("Converting data to CSV files...")
        convert_to_csv(sleep_data, "sleep_data.csv")
        convert_to_csv(heart_rate_data, "heart_rate_data.csv")
        convert_to_csv(daily_data, "daily_data.csv")
        convert_to_csv(daily_readiness, "daily_readiness.csv")
        convert_to_csv(sleep_time_data, "sleep_time_data.csv")
        convert_to_csv(blood_oxygen_data, "blood_oxygen_data.csv")
        convert_to_csv(stress_data, "stress_data.csv")
        
        print("All done!")
    except Exception as e:
        import traceback
        print(f"Error in main function: {e}")
        print(f"Error details: {traceback.format_exc()}")

if __name__ == "__main__": main()

