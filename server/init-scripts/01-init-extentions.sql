-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSONB support
CREATE EXTENSION IF NOT EXISTS "hstore";

-- Grant privileges to the postgres user
GRANT ALL PRIVILEGES ON DATABASE migrations TO postgres;
