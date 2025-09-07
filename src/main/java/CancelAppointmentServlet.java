import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class CancelAppointmentServlet extends HttpServlet {
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
            int appointmentId = requestData.get("appointmentId").getAsInt();
            
            // First check if appointment exists and get basic details
            String checkSql = "SELECT appointment_date, appointment_time, patient_id, doctor_id FROM appointments WHERE id = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, appointmentId);
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                // Update appointment status first
                String updateSql = "UPDATE appointments SET status = 'cancelled' WHERE id = ?";
                PreparedStatement updateStmt = conn.prepareStatement(updateSql);
                updateStmt.setInt(1, appointmentId);
                int rowsUpdated = updateStmt.executeUpdate();
                
                // Create simple appointment details
                JsonObject appointmentDetails = new JsonObject();
                appointmentDetails.addProperty("patientName", "Patient");
                appointmentDetails.addProperty("date", rs.getString("appointment_date"));
                appointmentDetails.addProperty("time", rs.getString("appointment_time"));
                appointmentDetails.addProperty("doctorName", "Doctor");
                
                jsonResponse.addProperty("success", true);
                jsonResponse.add("appointmentDetails", appointmentDetails);
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Appointment not found (ID: " + appointmentId + ")");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error cancelling appointment: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}