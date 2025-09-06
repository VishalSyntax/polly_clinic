import jakarta.servlet.ServletException;
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

public class SearchCompletedAppointmentsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String searchTerm = request.getParameter("search");
        String doctorId = request.getParameter("doctorId");
        JsonArray appointmentsArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT a.id, a.appointment_date, a.patient_id, p.name as patient_name, " +
                        "p.contact_number, d.name as doctor_name " +
                        "FROM appointments a " +
                        "JOIN patients p ON a.patient_id = p.patient_id " +
                        "JOIN doctors d ON a.doctor_id = d.user_id " +
                        "WHERE a.status = 'completed' AND (a.patient_id LIKE ? OR p.contact_number LIKE ? OR (p.email IS NOT NULL AND p.email LIKE ?))";
            
            // Add doctor filter if doctorId is provided
            if (doctorId != null && !doctorId.isEmpty()) {
                sql += " AND a.doctor_id = ?";
            }
            
            sql += " ORDER BY a.appointment_date DESC";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            String searchPattern = "%" + searchTerm + "%";
            stmt.setString(1, searchPattern);
            stmt.setString(2, searchPattern);
            stmt.setString(3, searchPattern);
            
            if (doctorId != null && !doctorId.isEmpty()) {
                stmt.setInt(4, Integer.parseInt(doctorId));
            }
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject appointment = new JsonObject();
                appointment.addProperty("id", rs.getInt("id"));
                appointment.addProperty("date", rs.getString("appointment_date"));
                appointment.addProperty("patientId", rs.getString("patient_id"));
                appointment.addProperty("patientName", rs.getString("patient_name"));
                appointment.addProperty("contactNumber", rs.getString("contact_number"));
                appointment.addProperty("doctorName", rs.getString("doctor_name"));
                appointmentsArray.add(appointment);
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(appointmentsArray.toString());
    }
}