
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'doctor', 'receptionist') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);


CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    license_number VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE receptionists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    shift_timing VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

CREATE TABLE patient_remarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT NOT NULL,
    remarks TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    timing VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

CREATE TABLE time_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slot_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default time slots
INSERT INTO time_slots (slot_time) VALUES 
('09:00:00'), ('09:30:00'), ('10:00:00'), ('10:30:00'), 
('11:00:00'), ('11:30:00'), ('14:00:00'), ('14:30:00'), 
('15:00:00'), ('15:30:00'), ('16:00:00'), ('16:30:00');


INSERT INTO users (username, password, user_type) VALUES ('admin', 'vishal', 'admin');


INSERT INTO users (username, password, user_type) VALUES ('dr_shruti', 'vishal123', 'doctor');
INSERT INTO users (username, password, user_type) VALUES ('dr_vishal', 'vishal123', 'doctor');

INSERT INTO doctors (user_id, name, specialization, phone, email, license_number) VALUES 
(2, 'Dr. Shruti Patil', 'Cardiologist', '9898877777', 'shruti@clinic.com', 'LIC001'),
(3, 'Dr. Vishal Patil', 'General Physician', '9899999999', 'vishal@clinic.com', 'LIC002');


INSERT INTO users (username, password, user_type) VALUES ('akansha', '1234', 'receptionist');
INSERT INTO receptionists (user_id, name, phone, email, shift_timing) VALUES 
(4, 'akansha', '9899999999', 'akansha@clinic.com', 'morning');

select * from users;
drop database pollyclinic1;

CREATE DATABASE pollyclinic1;
use pollyclinic1;