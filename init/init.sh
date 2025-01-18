#!/bin/bash
# Wait for PostgreSQL to start up before executing commands
until pg_isready -h localhost -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

# Execute the SQL commands to modify the role
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<EOF
ALTER ROLE bricolage SET default_transaction_isolation TO 'read committed';
ALTER ROLE bricolage SET default_database = 'bricolage';
EOF

echo "PostgreSQL role alterations applied successfully!"
