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
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@WebServlet("/getCancellationRemarks")
public class GetCancellationRemarksServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String patientId = request.getParameter("patientId");
        JsonArray remarksArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT cr.cancellation_reason, cr.cancelled_by, cr.created_at, " +
                        "a.appointment_date, a.appointment_time " +
                        "FROM cancellation_remarks cr " +
                        "JOIN appointments a ON cr.appointment_id = a.id " +
                        "WHERE cr.patient_id = ? " +
                        "ORDER BY cr.created_at DESC";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, patientId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject remark = new JsonObject();
                remark.addProperty("reason", rs.getString("cancellation_reason"));
                remark.addProperty("cancelledBy", rs.getString("cancelled_by"));
                remark.addProperty("cancelledAt", rs.getTimestamp("created_at").toString());
                remark.addProperty("appointmentDate", rs.getString("appointment_date"));
                remark.addProperty("appointmentTime", rs.getString("appointment_time"));
                remarksArray.add(remark);
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(remarksArray.toString());
    }
}