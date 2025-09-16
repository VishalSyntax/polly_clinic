import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@WebServlet("/bookAppointment")
public class BookAppointmentServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        JsonObject requestData = JsonParser.parseString(sb.toString()).getAsJsonObject();
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            conn.setAutoCommit(false);
            
            String patientId;
            
            // Check if this is an existing patient
            if (requestData.has("patientId") && !requestData.get("patientId").getAsString().isEmpty()) {
                // Existing patient - use provided ID
                patientId = requestData.get("patientId").getAsString();
            } else {
                // New patient - generate ID and insert patient
                patientId = "P" + System.currentTimeMillis();
                
                String patientSql = "INSERT INTO patients (patient_id, name, address, contact_number, email) VALUES (?, ?, ?, ?, ?)";
                PreparedStatement patientStmt = conn.prepareStatement(patientSql);
                patientStmt.setString(1, patientId);
                patientStmt.setString(2, requestData.get("patientName").getAsString());
                patientStmt.setString(3, requestData.get("address").getAsString());
                patientStmt.setString(4, requestData.get("contactNumber").getAsString());
                patientStmt.setString(5, requestData.get("email").getAsString());
                patientStmt.executeUpdate();
            }
            
            // Check if patient has existing completed appointment
            String checkSql = "SELECT id FROM appointments WHERE patient_id = ? AND status = 'completed' ORDER BY appointment_date DESC LIMIT 1";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setString(1, patientId);
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                // Update existing completed appointment
                int appointmentId = rs.getInt("id");
                String updateSql = "UPDATE appointments SET doctor_id = ?, appointment_date = ?, appointment_time = ?, status = 'scheduled' WHERE id = ?";
                PreparedStatement updateStmt = conn.prepareStatement(updateSql);
                updateStmt.setInt(1, requestData.get("doctorId").getAsInt());
                updateStmt.setString(2, requestData.get("appointmentDate").getAsString());
                updateStmt.setString(3, requestData.get("appointmentTime").getAsString());
                updateStmt.setInt(4, appointmentId);
                updateStmt.executeUpdate();
            } else {
                // Insert new appointment if no completed appointment exists
                String appointmentSql = "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, 'scheduled')";
                PreparedStatement appointmentStmt = conn.prepareStatement(appointmentSql);
                appointmentStmt.setString(1, patientId);
                appointmentStmt.setInt(2, requestData.get("doctorId").getAsInt());
                appointmentStmt.setString(3, requestData.get("appointmentDate").getAsString());
                appointmentStmt.setString(4, requestData.get("appointmentTime").getAsString());
                appointmentStmt.executeUpdate();
            }
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("patientId", patientId);
            jsonResponse.addProperty("message", "Appointment booked successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error booking appointment: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}