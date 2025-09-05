import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;

public class GetAdminStatsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        JsonObject stats = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            // Total patients
            String patientSql = "SELECT COUNT(*) as count FROM patients";
            PreparedStatement patientStmt = conn.prepareStatement(patientSql);
            ResultSet patientRs = patientStmt.executeQuery();
            if (patientRs.next()) {
                stats.addProperty("totalPatients", patientRs.getInt("count"));
            }
            
            // Active doctors
            String doctorSql = "SELECT COUNT(*) as count FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.is_active = TRUE";
            PreparedStatement doctorStmt = conn.prepareStatement(doctorSql);
            ResultSet doctorRs = doctorStmt.executeQuery();
            if (doctorRs.next()) {
                stats.addProperty("activeDoctors", doctorRs.getInt("count"));
            }
            
            // Staff members
            String staffSql = "SELECT COUNT(*) as count FROM receptionists r JOIN users u ON r.user_id = u.id WHERE u.is_active = TRUE";
            PreparedStatement staffStmt = conn.prepareStatement(staffSql);
            ResultSet staffRs = staffStmt.executeQuery();
            if (staffRs.next()) {
                stats.addProperty("staffMembers", staffRs.getInt("count"));
            }
            
            // Today's appointments
            String appointmentSql = "SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE() AND status = 'scheduled'";
            PreparedStatement appointmentStmt = conn.prepareStatement(appointmentSql);
            ResultSet appointmentRs = appointmentStmt.executeQuery();
            if (appointmentRs.next()) {
                stats.addProperty("todayAppointments", appointmentRs.getInt("count"));
            }
            
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(stats.toString());
    }
}