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

public class GetTodayAppointmentsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String doctorId = request.getParameter("doctorId");
        JsonArray appointmentsArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT a.id, a.appointment_date, a.appointment_time, a.patient_id, " +
                        "p.name as patient_name, p.contact_number " +
                        "FROM appointments a " +
                        "JOIN patients p ON a.patient_id = p.patient_id " +
                        "JOIN users u ON a.doctor_id = u.id " +
                        "WHERE a.doctor_id = ? AND a.appointment_date = CURDATE() AND a.status = 'scheduled' " +
                        "ORDER BY a.appointment_time";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, Integer.parseInt(doctorId));
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject appointment = new JsonObject();
                appointment.addProperty("id", rs.getInt("id"));
                appointment.addProperty("date", rs.getString("appointment_date"));
                appointment.addProperty("time", rs.getString("appointment_time"));
                appointment.addProperty("patientId", rs.getString("patient_id"));
                appointment.addProperty("patientName", rs.getString("patient_name"));
                appointment.addProperty("contactNumber", rs.getString("contact_number"));
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