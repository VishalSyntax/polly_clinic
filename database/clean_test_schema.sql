-- Clean Test Schema - Delete all patient-related records
-- Preserves: admin, doctors, receptionist users
-- Deletes: patients, appointments, prescriptions, patient_remarks, cancellation_remarks

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Delete patient-related records (in order to respect foreign keys)
DELETE FROM cancellation_remarks;
DELETE FROM patient_remarks;
DELETE FROM prescriptions;
DELETE FROM appointments;
DELETE FROM patients;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto-increment counters for clean testing
ALTER TABLE patients AUTO_INCREMENT = 1;
ALTER TABLE appointments AUTO_INCREMENT = 1;
ALTER TABLE prescriptions AUTO_INCREMENT = 1;
ALTER TABLE patient_remarks AUTO_INCREMENT = 1;
ALTER TABLE cancellation_remarks AUTO_INCREMENT = 1;

-- Verification queries (optional - comment out if not needed)
-- SELECT 'Patients remaining:' as info, COUNT(*) as count FROM patients;
-- SELECT 'Appointments remaining:' as info, COUNT(*) as count FROM appointments;
-- SELECT 'Prescriptions remaining:' as info, COUNT(*) as count FROM prescriptions;
-- SELECT 'Patient remarks remaining:' as info, COUNT(*) as count FROM patient_remarks;
-- SELECT 'Cancellation remarks remaining:' as info, COUNT(*) as count FROM cancellation_remarks;
-- SELECT 'Users preserved:' as info, COUNT(*) as count FROM users;
-- SELECT 'Doctors preserved:' as info, COUNT(*) as count FROM doctors;