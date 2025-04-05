import csv
import json
import os
import requests
import sys
from urllib.parse import urlparse

def generate_inserts_for_sleep_data(csv_file, output_file):
    """Generate SQL inserts for oura_sleep table from CSV file"""
    # SQL insert statement template
    insert_template = """
    INSERT INTO public.oura_sleep (original_id, day, score, contributors, timestamp)
    VALUES ('{}', '{}', {}, '{}', '{}');
    """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        next(reader)  # Skip header row
        
        for row in reader:
            # Skip empty rows
            if len(row) < 5:
                continue
                
            # Extract data (skipping the first index column)
            _, original_id, contributors, day, score, timestamp = row
            
            # Clean up the contributors JSON string - replace single quotes with double quotes
            contributors = contributors.replace("'", '"')
            
            # Format the SQL insert statement
            sql = insert_template.format(
                original_id,
                day,
                score,
                contributors,
                timestamp
            )
            
            # Write to output file
            f_out.write(sql)
    
    print(f"Sleep data SQL insert statements generated in {output_file}")

def generate_inserts_for_heart_rate(csv_file, output_file):
    """Generate SQL inserts for oura_heart_rate table from CSV file"""
    # First check if we have a type column in our schema
    has_type_column = True  # Default assumption
    
    try:
        # Check if we have a schema file to determine if type column exists
        schema_file = 'database.sql'
        if os.path.exists(schema_file):
            with open(schema_file, 'r') as f:
                schema_content = f.read()
                # Look for type column in heart_rate table definition
                if 'CREATE TABLE oura_heart_rate' in schema_content:
                    heart_rate_schema = schema_content.split('CREATE TABLE oura_heart_rate')[1].split(';')[0]
                    has_type_column = 'type VARCHAR' in heart_rate_schema
                    print(f"Detected type column in schema: {has_type_column}")
    except Exception as e:
        print(f"Error checking schema file: {e}")
        # Proceed with default assumption
    
    # SQL insert statement template - with or without type column
    if has_type_column:
        insert_template = """
        INSERT INTO public.oura_heart_rate (bpm, source, timestamp, type)
        VALUES ({}, '{}', '{}', '{}');
        """
    else:
        insert_template = """
        INSERT INTO public.oura_heart_rate (bpm, source, timestamp)
        VALUES ({}, '{}', '{}');
        """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        header = next(reader)  # Get header row
        print(f"Heart rate CSV headers: {header}")  # Print headers to understand structure
        
        # Find column indices based on headers
        bpm_col = header.index('bpm') if 'bpm' in header else 1  # Default to column 1 if not found
        source_col = header.index('source') if 'source' in header else 2  # Default to column 2
        timestamp_col = header.index('timestamp') if 'timestamp' in header else 3  # Default to column 3
        type_col = header.index('type') if 'type' in header else None
        
        rows_processed = 0
        for row in reader:
            # For debugging, print the actual columns in the first row
            if reader.line_num == 2:  # First data row
                print(f"First heart rate row: {row}")
            
            # Skip empty rows
            if len(row) < 3:
                continue
            
            # Extract data using the identified column indices
            try:
                # Check if the column exists in the row
                bpm = row[bpm_col] if bpm_col < len(row) else 'NULL'
                source = row[source_col] if source_col < len(row) else ''
                timestamp = row[timestamp_col] if timestamp_col < len(row) else ''
                
                # Only get type if we're using it in our schema
                type_value = ''
                if has_type_column and type_col is not None and type_col < len(row):
                    type_value = row[type_col]
                
                # Handle empty values
                bpm = bpm if bpm and bpm != '' else 'NULL'
                source = source if source else ''
                timestamp = timestamp if timestamp else ''
                
                # Format the SQL insert statement based on whether we have type column
                if has_type_column:
                    sql = insert_template.format(bpm, source, timestamp, type_value)
                else:
                    sql = insert_template.format(bpm, source, timestamp)
                
                # Write to output file
                f_out.write(sql)
                rows_processed += 1
                
                # Print progress every 1000 rows
                if rows_processed % 1000 == 0:
                    print(f"Processed {rows_processed} heart rate records...")
                    
            except Exception as e:
                print(f"Error processing row {reader.line_num}: {e}")
                print(f"Row data: {row}")
                # Continue processing other rows
    
    print(f"Heart rate data SQL insert statements generated in {output_file}")
    print(f"Total heart rate records processed: {rows_processed}")

def generate_inserts_for_activity(csv_file, output_file):
    """Generate SQL inserts for oura_activity table from CSV file"""
    # SQL insert statement template
    insert_template = """
    INSERT INTO public.oura_activity (original_id, day, score, active_calories, steps, calories_out)
    VALUES ('{}', '{}', {}, {}, {}, {});
    """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        header = next(reader)  # Get header row
        print(f"Activity CSV headers: {header}")  # Print headers to understand structure
        
        for row in reader:
            # Skip empty rows
            if len(row) < 5:
                continue
                
            # Extract data (skipping the first index column)
            # For debugging, print the actual columns in the first row
            if reader.line_num == 2:  # First data row
                print(f"First row columns: {row}")
            
            # Use the columns we need for our table, regardless of total columns
            index = 0
            original_id = row[1] if len(row) > 1 else ''
            day = row[2] if len(row) > 2 else ''
            score = row[3] if len(row) > 3 else 'NULL'
            
            # There might be different column positions in your CSV,
            # adjust these based on the printed header
            active_calories = 'NULL'
            steps = 'NULL'
            calories_out = 'NULL'
            
            # Find the right columns based on headers
            if 'active_calories' in header:
                active_calories_idx = header.index('active_calories')
                active_calories = row[active_calories_idx] if len(row) > active_calories_idx else 'NULL'
            
            if 'steps' in header:
                steps_idx = header.index('steps')
                steps = row[steps_idx] if len(row) > steps_idx else 'NULL'
                
            if 'calories' in header or 'calories_out' in header:
                calories_idx = header.index('calories' if 'calories' in header else 'calories_out')
                calories_out = row[calories_idx] if len(row) > calories_idx else 'NULL'
            
            # Handle empty values
            score = score if score and score != '' else 'NULL'
            active_calories = active_calories if active_calories and active_calories != '' else 'NULL'
            steps = steps if steps and steps != '' else 'NULL'
            calories_out = calories_out if calories_out and calories_out != '' else 'NULL'
            
            # Format the SQL insert statement
            sql = insert_template.format(
                original_id,
                day,
                score,
                active_calories,
                steps,
                calories_out
            )
            
            # Write to output file
            f_out.write(sql)
    
    print(f"Activity data SQL insert statements generated in {output_file}")

def generate_inserts_for_readiness(csv_file, output_file):
    """Generate SQL inserts for oura_readiness table from CSV file"""
    # SQL insert statement template
    insert_template = """
    INSERT INTO public.oura_readiness (original_id, day, score, contributors)
    VALUES ('{}', '{}', {}, '{}');
    """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        next(reader)  # Skip header row
        
        for row in reader:
            # Skip empty rows
            if len(row) < 5:
                continue
                
            # Extract data (skipping the first index column)
            _, original_id, contributors, day, score = row
            
            # Clean up the contributors JSON string - replace single quotes with double quotes
            contributors = contributors.replace("'", '"')
            
            # Format the SQL insert statement
            sql = insert_template.format(
                original_id,
                day,
                score or 'NULL',
                contributors
            )
            
            # Write to output file
            f_out.write(sql)
    
    print(f"Readiness data SQL insert statements generated in {output_file}")

def generate_inserts_for_sleep_time(csv_file, output_file):
    """Generate SQL inserts for oura_sleep_time table from CSV file"""
    # SQL insert statement template
    insert_template = """
    INSERT INTO public.oura_sleep_time (original_id, day, bedtime_start, bedtime_end, duration)
    VALUES ('{}', '{}', '{}', '{}', {});
    """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        next(reader)  # Skip header row
        
        for row in reader:
            # Skip empty rows
            if len(row) < 6:
                continue
                
            # Extract data (skipping the first index column)
            _, original_id, day, bedtime_start, bedtime_end, duration = row
            
            # Format the SQL insert statement
            sql = insert_template.format(
                original_id,
                day,
                bedtime_start,
                bedtime_end,
                duration or 'NULL'
            )
            
            # Write to output file
            f_out.write(sql)
    
    print(f"Sleep time data SQL insert statements generated in {output_file}")

def download_csv_if_url(source, target_filename=None):
    """
    If source is a URL, download it to target_filename.
    If source is a local file, return the path.
    """
    # Check if the source is a URL
    if source.startswith('http'):
        # Parse the URL to get the filename if no target specified
        if not target_filename:
            path = urlparse(source).path
            target_filename = os.path.basename(path)
            # If the URL ends with a weird token, use a default name
            if not target_filename.endswith('.csv'):
                target_filename = f"downloaded_{len(source) % 1000}.csv"
        
        print(f"Downloading {source} to {target_filename}...")
        try:
            response = requests.get(source)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            with open(target_filename, 'wb') as f:
                f.write(response.content)
            
            print(f"Successfully downloaded to {target_filename}")
            return target_filename
        except Exception as e:
            print(f"Error downloading file: {e}")
            return None
    else:
        # It's a local file path
        return source

def find_index_column(csv_file):
    """
    Determine which column is likely the index column (often unnamed or with values 0,1,2,...)
    Returns the index of the index column, or None if not found.
    """
    try:
        with open(csv_file, 'r') as f:
            reader = csv.reader(f)
            headers = next(reader)
            
            # If there's an empty header, that's likely the index column
            for i, header in enumerate(headers):
                if header.strip() == '':
                    return i
            
            # If not, read the first few rows and look for a column with values 0,1,2,...
            rows = []
            for i, row in enumerate(reader):
                if i < 5:  # Check first 5 rows
                    rows.append(row)
                else:
                    break
            
            # If we have at least 3 rows
            if len(rows) >= 3:
                for col_idx in range(len(rows[0])):
                    # Check if this column contains sequential integers starting from 0
                    values = [row[col_idx] for row in rows if col_idx < len(row)]
                    if all(val.isdigit() for val in values):
                        # Check if they're sequential
                        ints = [int(val) for val in values]
                        expected = list(range(min(ints), min(ints) + len(ints)))
                        if ints == expected:
                            return col_idx
            
            # If we couldn't find an index column, return None
            return None
            
    except Exception as e:
        print(f"Error finding index column: {e}")
        return None

def print_sample_data(csv_file, num_rows=3):
    """Print sample data from a CSV file to help understand its structure."""
    print(f"\nSample data from {csv_file}:")
    try:
        with open(csv_file, 'r') as f:
            reader = csv.reader(f)
            headers = next(reader)
            print(f"Headers: {headers}")
            
            # Try to find the index column
            index_col = find_index_column(csv_file)
            if index_col is not None:
                print(f"Detected index column at position {index_col}")
            
            rows = []
            for i, row in enumerate(reader):
                if i < num_rows:
                    rows.append(row)
                else:
                    break
            
            # Print each row with column indices
            for i, row in enumerate(rows):
                print(f"Row {i+1}:")
                for j, val in enumerate(row):
                    print(f"  [Col {j}]: {val}")
    except Exception as e:
        print(f"Error reading sample data: {e}")

def generate_inserts_for_spo2(csv_file, output_file):
    """Generate SQL inserts for oura_spo2 table from CSV file"""
    # Print sample data to understand structure
    print_sample_data(csv_file)
    
    # SQL insert statement template
    insert_template = """
    INSERT INTO public.oura_spo2 (original_id, day, spo2_percentage, breathing_disturbance_index)
    VALUES ('{}', '{}', {}, {});
    """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        header = next(reader)  # Get header row
        print(f"SPO2 CSV headers: {header}")  # Print headers to understand structure
        
        # Find column positions (with defaults for common patterns)
        # The default values are guesses based on typical CSV exports
        id_col = header.index('id') if 'id' in header else 1
        day_col = header.index('day') if 'day' in header else 2
        spo2_col = 3  # Default position
        
        # Try to find spo2_percentage column
        for possible_name in ['spo2_percentage', 'spo2', 'avg_spo2', 'average_spo2']:
            if possible_name in header:
                spo2_col = header.index(possible_name)
                break
        
        bdi_col = 4  # Default position
        # Try to find breathing disturbance index column
        for possible_name in ['breathing_disturbance_index', 'bdi', 'breathing_index']:
            if possible_name in header:
                bdi_col = header.index(possible_name)
                break
        
        for row in reader:
            # For debugging, print the actual columns in the first row
            if reader.line_num == 2:  # First data row
                print(f"First SPO2 row: {row}")
            
            # Skip empty rows
            if len(row) < 3:
                continue
            
            try:
                # Extract data using column positions
                original_id = row[id_col] if id_col < len(row) else ''
                day = row[day_col] if day_col < len(row) else ''
                
                # Handle spo2_percentage carefully since it's JSON
                spo2_percentage = 'NULL'
                if spo2_col < len(row) and row[spo2_col]:
                    # Format as proper JSON by replacing single quotes with double quotes
                    spo2_json = row[spo2_col].replace("'", '"')
                    
                    # If the JSON is valid, quote it for SQL
                    if spo2_json and spo2_json.lower() != 'null':
                        spo2_percentage = f"'{spo2_json}'"
                
                # Handle breathing_disturbance_index
                breathing_disturbance_index = 'NULL'
                if bdi_col < len(row) and row[bdi_col]:
                    breathing_disturbance_index = row[bdi_col]
                
                # Format the SQL insert statement
                sql = insert_template.format(
                    original_id,
                    day,
                    spo2_percentage,  # Already formatted as 'NULL' or quoted JSON
                    breathing_disturbance_index
                )
                
                # Write to output file
                f_out.write(sql)
                
            except Exception as e:
                print(f"Error processing SPO2 row {reader.line_num}: {e}")
                print(f"Row data: {row}")
    
    print(f"SPO2 data SQL insert statements generated in {output_file}")

def generate_inserts_for_stress(csv_file, output_file):
    """Generate SQL inserts for oura_stress table from CSV file"""
    # SQL insert statement template
    insert_template = """
    INSERT INTO public.oura_stress (original_id, day, stress_high, recovery_high, day_summary)
    VALUES ('{}', '{}', {}, {}, '{}');
    """
    
    # Read CSV and generate SQL statements
    with open(csv_file, 'r') as f_in, open(output_file, 'w') as f_out:
        reader = csv.reader(f_in)
        next(reader)  # Skip header row
        
        for row in reader:
            # Skip empty rows
            if len(row) < 6:
                continue
                
            # Extract data (skipping the first index column)
            _, original_id, day, stress_high, recovery_high, day_summary = row
            
            # Format the SQL insert statement
            sql = insert_template.format(
                original_id,
                day,
                stress_high or 'NULL',
                recovery_high or 'NULL',
                day_summary
            )
            
            # Write to output file
            f_out.write(sql)
    
    print(f"Stress data SQL insert statements generated in {output_file}")

def create_jsonb_update_statements(output_file):
    """Generate SQL statements to convert text fields to JSONB format"""
    updates = """
    -- Convert text fields to JSONB format
    UPDATE public.oura_sleep SET contributors = contributors::jsonb WHERE contributors IS NOT NULL;
    UPDATE public.oura_readiness SET contributors = contributors::jsonb WHERE contributors IS NOT NULL;
    UPDATE public.oura_spo2 SET spo2_percentage = spo2_percentage::jsonb WHERE spo2_percentage IS NOT NULL AND spo2_percentage != 'NULL';
    """
    
    with open(output_file, 'w') as f_out:
        f_out.write(updates)
    
    print(f"JSONB update statements generated in {output_file}")

def main():
    """Process all CSV files and generate SQL insert statements."""
    # Create output directory if it doesn't exist
    os.makedirs('sql_inserts', exist_ok=True)
    
    # Handle command line arguments - allow specifying URLs for CSV files
    if len(sys.argv) > 1:
        # Assume the first argument is the path to a config file or a CSV URL
        arg = sys.argv[1]
        if arg.startswith('http') and 'csv' in arg.lower():
            print(f"Downloading CSV from URL: {arg}")
            downloaded = download_csv_if_url(arg)
            if downloaded:
                print(f"You can now process this file. Please run the script again.")
                sys.exit(0)
    
    # Define CSV files and their processors
    file_processors = [
        ('sleep_data.csv', generate_inserts_for_sleep_data, 'sql_inserts/sleep_inserts.sql'),
        ('heart_rate_data.csv', generate_inserts_for_heart_rate, 'sql_inserts/heart_rate_inserts.sql'),
        ('daily_data.csv', generate_inserts_for_activity, 'sql_inserts/activity_inserts.sql'),
        ('daily_readiness.csv', generate_inserts_for_readiness, 'sql_inserts/readiness_inserts.sql'),
        ('sleep_time_data.csv', generate_inserts_for_sleep_time, 'sql_inserts/sleep_time_inserts.sql'),
        ('blood_oxygen_data.csv', generate_inserts_for_spo2, 'sql_inserts/spo2_inserts.sql'),
        ('stress_data.csv', generate_inserts_for_stress, 'sql_inserts/stress_inserts.sql')
    ]
    
    successful_files = 0
    
    # Process each CSV file
    for csv_file, processor_func, output_file in file_processors:
        print(f"\n{'='*80}\nProcessing {csv_file}...")
        
        # Check if CSV file exists
        if not os.path.exists(csv_file):
            print(f"ERROR: {csv_file} not found in current directory.")
            print(f"Please make sure {csv_file} is in the same directory as this script.")
            print(f"You can also run 'python {sys.argv[0]} URL_TO_CSV' to download from URL.")
            continue
        
        try:
            # Process the CSV file
            processor_func(csv_file, output_file)
            successful_files += 1
        except Exception as e:
            print(f"ERROR processing {csv_file}: {e}")
            import traceback
            traceback.print_exc()
    
    # Create JSONB update statements
    try:
        create_jsonb_update_statements('sql_inserts/jsonb_updates.sql')
        print("\nJSONB update statements created successfully.")
    except Exception as e:
        print(f"ERROR creating JSONB update statements: {e}")
    
    # Print summary
    print("\n" + "="*80)
    print(f"Summary: Successfully processed {successful_files}/{len(file_processors)} CSV files.")
    
    if successful_files > 0:
        print("\nNext steps:")
        print("1. Go to Supabase SQL Editor")
        print("2. Create your tables using the database.sql script")
        print("3. Run each generated SQL file to insert data (in sql_inserts/ directory)")
        print("4. Run the jsonb_updates.sql file to convert text fields to JSONB format")
    
    if successful_files < len(file_processors):
        print("\nSome files were not processed successfully. Please check the errors above.")
        print("If files are missing, you can download them from Supabase Storage:")
        print(f"  python {sys.argv[0]} URL_TO_CSV")

if __name__ == "__main__":
    main()
