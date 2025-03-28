-- Create users table
CREATE TABLE users
(
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    title VARCHAR(255),
    company VARCHAR(255),
    linkedin VARCHAR(255),
    created_at TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

    -- Create indexes for better query performance
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_company ON users(company);

    -- Create function is shared with other tables

    -- Create trigger to automatically update updated_at timestamp
    CREATE TRIGGER update_users_updated_at
    BEFORE
    UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column
    ();

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user information'; 