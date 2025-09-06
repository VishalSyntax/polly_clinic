import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/checkPatientStatus")
public class CheckPatientStatusServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/polly_clinic";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "root";

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
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            
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
                String status = rs.getString("status");
                String doctorName = rs.getString("doctor_name");
                
                if ("scheduled".equals(status)) {
                    statusResponse.addProperty("hasScheduledAppointment", true);
                    statusResponse.addProperty("doctorName", doctorName);
                } else {
                    statusResponse.addProperty("hasScheduledAppointment", false);
                }
            } else {
                // No appointments found - new patient
                statusResponse.addProperty("hasScheduledAppointment", false);
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