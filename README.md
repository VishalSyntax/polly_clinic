# Polly Clinic Management System

## Project Overview
A comprehensive clinic management system built with Java Servlets, MySQL, and web technologies for managing appointments, patients, doctors, and staff.

## Technology Stack
- **Backend**: Java Servlets (Jakarta EE 5.0)
- **Database**: MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap
- **Server**: Apache Tomcat (or compatible servlet container)
- **Build**: Traditional Java web application structure

## Project Structure
```
polly_clinic/
├── src/main/
│   ├── java/                    # Java servlet classes
│   └── webapp/                  # Web application files
│       ├── WEB-INF/
│       │   ├── web.xml         # Servlet configuration
│       │   ├── classes/        # Compiled Java classes
│       │   └── lib/            # JAR dependencies
│       ├── css/                # Stylesheets
│       ├── js/                 # JavaScript files
│       ├── img/                # Images and assets
│       └── *.html              # HTML pages
├── database/
│   ├── current.sql             # Main database schema
│   ├── schema.sql              # Base schema
│   └── test_data.sql           # Sample data
├── lib/                        # External JAR files
└── *.html                      # Root HTML files
```

## Database Schema

### Core Tables
1. **users** - Authentication (admin, doctor, receptionist)
2. **doctors** - Doctor profiles and specializations
3. **receptionists** - Staff member profiles
4. **patients** - Patient information and contact details
5. **appointments** - Appointment scheduling and status
6. **patient_remarks** - Doctor notes and observations
7. **prescriptions** - Medicine prescriptions per appointment
8. **cancellation_remarks** - Appointment cancellation tracking
9. **time_slots** - Available appointment time slots

### Key Relationships
- `users` → `doctors/receptionists` (1:1 via user_id)
- `patients` → `appointments` (1:many via patient_id)
- `appointments` → `prescriptions/remarks` (1:many)

## User Roles & Permissions

### Admin
- Manage doctors and receptionists
- View system statistics
- Configure time slots
- Access all reports
- **Entry Point**: `admin-dashboard.html`

### Doctor
- View assigned appointments
- Add patient remarks
- Create prescriptions
- Mark appointments as completed
- **Entry Point**: `doctor-appointments.html`

### Receptionist
- Book new appointments
- Search and manage patients
- View appointment schedules
- Handle cancellations
- **Entry Point**: `receptionist-dashboard.html`

## Key Servlets & Endpoints

### Authentication
- `/login` - User authentication with role validation

### Appointment Management
- `/bookAppointment` - Create new appointments
- `/getAppointments` - Retrieve appointment lists
- `/cancelAppointment` - Cancel appointments
- `/modifyAppointment` - Update appointment details
- `/checkAvailability` - Check doctor/time availability

### Patient Management
- `/searchPatients` - Search existing patients
- `/checkPatientExists` - Validate patient existence
- `/getPatientHistory` - Retrieve patient history

### Doctor Operations
- `/saveRemark` - Add patient remarks
- `/submitPrescription` - Create prescriptions
- `/getTodayAppointments` - Get daily schedule

### Admin Functions
- `/addDoctor` - Register new doctors
- `/addReceptionist` - Register staff members
- `/toggleUserStatus` - Activate/deactivate users
- `/getAdminStats` - System statistics

## Setup Instructions

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE pollyclinic;

-- Import schema
mysql -u root -p pollyclinic < database/current.sql
```

### 2. Configuration
Update database connection in `DatabaseConnection.java`:
```java
private static final String URL = "jdbc:mysql://localhost:3306/pollyclinic";
private static final String USERNAME = "root";
private static final String PASSWORD = "your_password";
```

### 3. Dependencies
Required JAR files (in `/lib` and `/WEB-INF/lib`):
- `mysql-connector-j-8.0.33.jar`
- `gson-2.8.9.jar`
- `jakarta.servlet-api-5.0.0.jar`

### 4. Deployment
1. Compile Java classes to `/WEB-INF/classes/`
2. Deploy to Tomcat webapps directory
3. Access via `http://localhost:8080/polly_clinic/`

## Default Login Credentials
- **Admin**: username=`admin`, password=`vishal`
- **Doctor**: username=`dr_shruti`, password=`vishal123`
- **Doctor**: username=`dr_vishal`, password=`vishal123`
- **Receptionist**: username=`akansha`, password=`1234`

## Application Workflow

### Patient Registration & Appointment Booking
1. Receptionist searches for existing patient
2. If new patient → Register in system
3. Select doctor and available time slot
4. Book appointment with status 'scheduled'

### Doctor Consultation
1. Doctor views today's appointments
2. Conduct consultation
3. Add patient remarks
4. Create prescription if needed
5. Mark appointment as 'completed'

### Appointment Management
- **Scheduling**: Check availability → Book slot
- **Modification**: Update date/time/doctor
- **Cancellation**: Add cancellation remarks
- **Completion**: Add remarks + prescription

## File Naming Conventions
- **Servlets**: `[Action][Entity]Servlet.java` (e.g., `BookAppointmentServlet.java`)
- **HTML Pages**: `[role]-[function].html` (e.g., `doctor-appointments.html`)
- **CSS Files**: `[page/component].css` (e.g., `admin-dashboard.css`)
- **JS Files**: `[page/component].js` (e.g., `appointment-booking.js`)

## Common Modification Patterns

### Adding New Servlet
1. Create Java class extending `HttpServlet`
2. Add `@WebServlet` annotation or configure in `web.xml`
3. Implement `doGet`/`doPost` methods
4. Use `DatabaseConnection.getConnection()` for DB access
5. Return JSON responses using Gson

### Adding New Page
1. Create HTML file with appropriate role prefix
2. Include common CSS files (`common.css`, `common-sidebar.css`)
3. Add sidebar navigation
4. Create corresponding JavaScript file
5. Update navigation links in related pages

### Database Modifications
1. Update `database/current.sql` with schema changes
2. Modify affected servlet classes
3. Update corresponding JavaScript AJAX calls
4. Test with sample data

## Security Considerations
- Plain text passwords (consider hashing)
- SQL injection prevention via PreparedStatements
- Session management for user authentication
- Role-based access control validation

## Integration Points
- WhatsApp notifications (see `GREEN_API_INTEGRATION_GUIDE.md`)
- Email notifications capability
- Extensible for SMS integration

This documentation provides the foundation for understanding and modifying the Polly Clinic system efficiently.