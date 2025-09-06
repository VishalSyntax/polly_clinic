import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/checkPatientStatus")
public class CheckPatientStatusServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String patientId = request.getParameter("patientId");
        
        if (patientId == null || patientId.trim().isEmpty()) {
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("error", "Patient ID is required");
            out.print(new Gson().toJson(errorResponse));
            return;
        }
        
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT a.status, d.name as doctor_name " +
                        "FROM appointments a " +
                        "JOIN doctors d ON a.doctor_id = d.id " +
                        "WHERE a.patient_id = ? " +
                        "ORDER BY a.appointment_date DESC, a.appointment_time DESC " +
                        "LIMIT 1";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, patientId);
            ResultSet rs = stmt.executeQuery();
            
            JsonObject statusResponse = new JsonObject();
            
            if (rs.next()) {
                // Found last appointment
                String status = rs.getString("status");
                String doctorName = rs.getString("doctor_name");
                statusResponse.addProperty("lastAppointmentStatus", status);
                statusResponse.addProperty("doctorName", doctorName);
                statusResponse.addProperty("hasScheduledAppointment", "scheduled".equals(status));
            } else {
                // No appointments found
                statusResponse.addProperty("hasScheduledAppointment", false);
                statusResponse.addProperty("lastAppointmentStatus", "none");
            }
            
            out.print(new Gson().toJson(statusResponse));
            
            rs.close();
            stmt.close();
            conn.close();
            
        } catch (Exception e) {
            e.printStackTrace();
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("error", "Database error: " + e.getMessage());
            out.print(new Gson().toJson(errorResponse));
        }
    }
}