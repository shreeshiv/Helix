-- Create sequences table
CREATE TABLE sequences (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    org_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT,
    messages JSONB,  -- Using JSONB for PostgreSQL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_sequences_updated_at ON sequences(updated_at);
CREATE INDEX idx_sequences_user_id ON sequences(user_id);
CREATE INDEX idx_sequences_org_id ON sequences(org_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_sequences_updated_at
    BEFORE UPDATE ON sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE sequences IS 'Stores email sequences and their conversation history';
COMMENT ON COLUMN sequences.id IS 'Unique identifier for the sequence';
COMMENT ON COLUMN sequences.user_id IS 'ID of the user who owns this sequence';
COMMENT ON COLUMN sequences.org_id IS 'ID of the organization this sequence belongs to';
COMMENT ON COLUMN sequences.name IS 'Name of the sequence';
COMMENT ON COLUMN sequences.content IS 'The actual content of the email sequence';
COMMENT ON COLUMN sequences.messages IS 'JSON array containing the conversation history';
COMMENT ON COLUMN sequences.created_at IS 'Timestamp when the sequence was created';
COMMENT ON COLUMN sequences.updated_at IS 'Timestamp when the sequence was last updated'; 