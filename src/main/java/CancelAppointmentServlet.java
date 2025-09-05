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
            
            // Get appointment details first
            String getDetailsSql = "SELECT a.appointment_date, a.appointment_time, p.name as patient_name, " +
                                  "p.email, d.name as doctor_name " +
                                  "FROM appointments a " +
                                  "JOIN patients p ON a.patient_id = p.patient_id " +
                                  "JOIN doctors d ON a.doctor_id = d.user_id " +
                                  "WHERE a.id = ?";
            
            PreparedStatement getStmt = conn.prepareStatement(getDetailsSql);
            getStmt.setInt(1, appointmentId);
            ResultSet rs = getStmt.executeQuery();
            
            if (rs.next()) {
                JsonObject appointmentDetails = new JsonObject();
                appointmentDetails.addProperty("patientName", rs.getString("patient_name"));
                appointmentDetails.addProperty("date", rs.getString("appointment_date"));
                appointmentDetails.addProperty("time", rs.getString("appointment_time"));
                appointmentDetails.addProperty("doctorName", rs.getString("doctor_name"));
                
                // Update appointment status
                String updateSql = "UPDATE appointments SET status = 'cancelled' WHERE id = ?";
                PreparedStatement updateStmt = conn.prepareStatement(updateSql);
                updateStmt.setInt(1, appointmentId);
                updateStmt.executeUpdate();
                
                jsonResponse.addProperty("success", true);
                jsonResponse.add("appointmentDetails", appointmentDetails);
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Appointment not found");
            }
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error cancelling appointment: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}