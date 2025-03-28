-- Remove seed data
DELETE FROM sequences 
WHERE id IN ('seq_001', 'seq_002', 'seq_003', 'seq_004'); 