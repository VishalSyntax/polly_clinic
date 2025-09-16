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
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@WebServlet("/cancelAppointmentWithRemark")
public class CancelAppointmentWithRemarkServlet extends HttpServlet {
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
            
            int appointmentId = requestData.get("appointmentId").getAsInt();
            String patientId = requestData.get("patientId").getAsString();
            String cancelReason = requestData.get("cancelReason").getAsString();
            String cancelledBy = requestData.get("cancelledBy").getAsString();
            
            // Update appointment status to cancelled
            String updateSql = "UPDATE appointments SET status = 'cancelled' WHERE id = ?";
            PreparedStatement updateStmt = conn.prepareStatement(updateSql);
            updateStmt.setInt(1, appointmentId);
            updateStmt.executeUpdate();
            
            // Insert cancellation remark
            String remarkSql = "INSERT INTO cancellation_remarks (patient_id, appointment_id, cancellation_reason, cancelled_by) VALUES (?, ?, ?, ?)";
            PreparedStatement remarkStmt = conn.prepareStatement(remarkSql);
            remarkStmt.setString(1, patientId);
            remarkStmt.setInt(2, appointmentId);
            remarkStmt.setString(3, cancelReason);
            remarkStmt.setString(4, cancelledBy);
            remarkStmt.executeUpdate();
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Appointment cancelled successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error cancelling appointment: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}