import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.google.gson.Gson;

public class GetTodayAppointmentsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);

        // Security check: ensure a doctor is logged in
        if (session == null || !"doctor".equals(session.getAttribute("role"))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Unauthorized access\"}");
            return;
        }

        // Get the logged-in doctor's ID from the session
        Integer doctorId = (Integer) session.getAttribute("doctorId");
        if (doctorId == null) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Doctor ID not found in session\"}");
            return;
        }

        List<Map<String, Object>> appointments = new ArrayList<>();
        String sql = "SELECT a.id, a.patient_id, p.name AS patient_name, p.contact_number, a.appointment_time, a.status " +
                     "FROM appointments a " +
                     "JOIN patients p ON a.patient_id = p.patient_id " +
                     "WHERE a.doctor_id = ? AND a.appointment_date = CURDATE() ORDER BY a.appointment_time";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, doctorId); // Filter by the logged-in doctor's ID
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, Object> appointment = new HashMap<>();
                appointment.put("id", rs.getInt("id"));
                appointment.put("patientId", rs.getString("patient_id"));
                appointment.put("patientName", rs.getString("patient_name"));
                appointment.put("contactNumber", rs.getString("contact_number"));
                appointment.put("time", rs.getString("appointment_time"));
                appointment.put("status", rs.getString("status"));
                appointments.add(appointment);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(appointments));
    }
}