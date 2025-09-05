-- Remove UNIQUE constraint from email field in patients table
ALTER TABLE patients DROP INDEX email;

-- Verify the change
DESCRIBE patients;