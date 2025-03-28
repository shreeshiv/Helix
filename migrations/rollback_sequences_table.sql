-- Drop trigger first
DROP TRIGGER IF EXISTS update_sequences_updated_at
ON sequences;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column
();

-- Drop table (will also drop associated index)
DROP TABLE IF EXISTS sequences; 