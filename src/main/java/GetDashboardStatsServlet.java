import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;

@WebServlet("/getDashboardStats")
public class GetDashboardStatsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        JsonObject stats = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            // Total scheduled appointments
            String scheduledSql = "SELECT COUNT(*) as count FROM appointments WHERE status = 'scheduled'";
            PreparedStatement scheduledStmt = conn.prepareStatement(scheduledSql);
            ResultSet scheduledRs = scheduledStmt.executeQuery();
            if (scheduledRs.next()) {
                stats.addProperty("scheduledCount", scheduledRs.getInt("count"));
            }
            
            // Total cancelled appointments
            String cancelledSql = "SELECT COUNT(*) as count FROM appointments WHERE status = 'cancelled'";
            PreparedStatement cancelledStmt = conn.prepareStatement(cancelledSql);
            ResultSet cancelledRs = cancelledStmt.executeQuery();
            if (cancelledRs.next()) {
                stats.addProperty("cancelledCount", cancelledRs.getInt("count"));
            }
            
            // Completed today
            String completedSql = "SELECT COUNT(*) as count FROM appointments WHERE status = 'completed' AND appointment_date = CURDATE()";
            PreparedStatement completedStmt = conn.prepareStatement(completedSql);
            ResultSet completedRs = completedStmt.executeQuery();
            if (completedRs.next()) {
                stats.addProperty("completedCount", completedRs.getInt("count"));
            }
            
            // Total patients
            String patientsSql = "SELECT COUNT(*) as count FROM patients";
            PreparedStatement patientsStmt = conn.prepareStatement(patientsSql);
            ResultSet patientsRs = patientsStmt.executeQuery();
            if (patientsRs.next()) {
                stats.addProperty("totalPatients", patientsRs.getInt("count"));
            }
            
            // Today's appointments for the main card
            String todaySql = "SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE() AND status = 'scheduled'";
            PreparedStatement todayStmt = conn.prepareStatement(todaySql);
            ResultSet todayRs = todayStmt.executeQuery();
            if (todayRs.next()) {
                stats.addProperty("totalAppointments", todayRs.getInt("count"));
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