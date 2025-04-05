# API Scripts

This folder contains scripts for fetching data from external APIs and converting them to formats suitable for the Hygieia app.

## Oura Data

The `oura_data` folder contains scripts for:
- Fetching data from the Oura Ring API
- Converting it to CSV format
- (Eventually) Uploading to Supabase

### Usage

To run the Oura data script:

1. Install dependencies: `pip install -r requirements.txt`
2. Create a `.env` file with your `OURA_API_KEY`
3. Run: `python fetch_oura_data.py`
