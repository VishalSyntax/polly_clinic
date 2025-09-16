import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

@WebServlet("/getPatientHistory")
public class GetPatientHistoryServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String patientId = request.getParameter("patientId");
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        List<AppointmentHistory> history = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT a.id, a.appointment_date, a.appointment_time, a.status, " +
                        "d.name as doctor_name, pr.remarks " +
                        "FROM appointments a " +
                        "JOIN doctors d ON a.doctor_id = d.id " +
                        "LEFT JOIN patient_remarks pr ON a.id = pr.appointment_id " +
                        "WHERE a.patient_id = ? " +
                        "ORDER BY a.appointment_date DESC, a.appointment_time DESC";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, patientId);
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                AppointmentHistory appointment = new AppointmentHistory();
                appointment.id = rs.getInt("id");
                appointment.date = rs.getDate("appointment_date").toString();
                appointment.time = rs.getTime("appointment_time").toString();
                appointment.status = rs.getString("status");
                appointment.doctorName = rs.getString("doctor_name");
                appointment.remarks = rs.getString("remarks");
                history.add(appointment);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Gson gson = new Gson();
        out.print(gson.toJson(history));
        out.flush();
    }
    
    class AppointmentHistory {
        int id;
        String date;
        String time;
        String status;
        String doctorName;
        String remarks;
    }
}