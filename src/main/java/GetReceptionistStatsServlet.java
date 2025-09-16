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

@WebServlet("/getReceptionistStats")
public class GetReceptionistStatsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        JsonObject stats = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            
            String patientSql = "SELECT COUNT(*) as count FROM patients";
            PreparedStatement patientStmt = conn.prepareStatement(patientSql);
            ResultSet patientRs = patientStmt.executeQuery();
            if (patientRs.next()) {
                stats.addProperty("totalPatients", patientRs.getInt("count"));
            }
            
            
            String todaySql = "SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE()";
            PreparedStatement todayStmt = conn.prepareStatement(todaySql);
            ResultSet todayRs = todayStmt.executeQuery();
            if (todayRs.next()) {
                stats.addProperty("todayAppointments", todayRs.getInt("count"));
            }
            
          
            String completedSql = "SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE() AND status = 'completed'";
            PreparedStatement completedStmt = conn.prepareStatement(completedSql);
            ResultSet completedRs = completedStmt.executeQuery();
            if (completedRs.next()) {
                stats.addProperty("completedToday", completedRs.getInt("count"));
            }
            
            
            String pendingSql = "SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE() AND status = 'scheduled'";
            PreparedStatement pendingStmt = conn.prepareStatement(pendingSql);
            ResultSet pendingRs = pendingStmt.executeQuery();
            if (pendingRs.next()) {
                stats.addProperty("pendingToday", pendingRs.getInt("count"));
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