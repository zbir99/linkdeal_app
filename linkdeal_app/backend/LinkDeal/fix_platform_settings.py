"""Add missing columns to core_platformsettings table"""
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'LinkDeal.settings'

from django.conf import settings
import psycopg2

db = settings.DATABASES['default']
conn = psycopg2.connect(
    host=db['HOST'],
    port=db['PORT'],
    database=db['NAME'],
    user=db['USER'],
    password=db['PASSWORD']
)
conn.autocommit = True
cur = conn.cursor()

# Check existing columns
cur.execute("""
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'core_platformsettings'
""")
existing_columns = [row[0] for row in cur.fetchall()]
print(f"Existing columns: {existing_columns}")

# Columns to add
columns_to_add = [
    ("bank_name", "VARCHAR(255) DEFAULT ''"),
    ("iban", "VARCHAR(100) DEFAULT ''"),
    ("swift_bic", "VARCHAR(50) DEFAULT ''"),
    ("wallet_balance", "DECIMAL(10,2) DEFAULT 0.00"),
]

for col_name, col_type in columns_to_add:
    if col_name not in existing_columns:
        print(f"Adding column: {col_name}")
        try:
            cur.execute(f'ALTER TABLE core_platformsettings ADD COLUMN "{col_name}" {col_type}')
            print(f"  ✓ Added {col_name}")
        except Exception as e:
            print(f"  ✗ Error adding {col_name}: {e}")
    else:
        print(f"Column {col_name} already exists")

cur.close()
conn.close()
print("\nDone! Platform settings table updated.")
