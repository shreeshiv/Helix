-- Create organizations table
CREATE TABLE organizations
(
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    description VARCHAR(1000),
    website VARCHAR(255),
    locations JSONB,
    -- Stored as JSON array
    company_size VARCHAR(255),
    created_at TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

    -- Create indexes for better query performance
    CREATE INDEX idx_organizations_name ON organizations(name);
    CREATE INDEX idx_organizations_industry ON organizations(industry);

    -- Create trigger to automatically update updated_at timestamp
    CREATE TRIGGER update_organizations_updated_at
    BEFORE
    UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column
    ();

-- Add comments for documentation
COMMENT ON TABLE organizations IS 'Stores organization information'; 