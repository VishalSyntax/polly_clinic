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

public class GetPrescriptionServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String appointmentId = request.getParameter("appointmentId");
        String doctorId = request.getParameter("doctorId");
        JsonArray prescriptionArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT p.medicine_name, p.quantity, p.timing, p.created_at " +
                        "FROM prescriptions p " +
                        "WHERE p.appointment_id = ?";
            
            // Add doctor filter if doctorId is provided
            if (doctorId != null && !doctorId.isEmpty()) {
                sql += " AND p.doctor_id = ?";
            }
            
            sql += " ORDER BY p.created_at DESC";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, Integer.parseInt(appointmentId));
            if (doctorId != null && !doctorId.isEmpty()) {
                stmt.setInt(2, Integer.parseInt(doctorId));
            }
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject medicine = new JsonObject();
                medicine.addProperty("medicineName", rs.getString("medicine_name"));
                medicine.addProperty("quantity", rs.getString("quantity"));
                medicine.addProperty("timing", rs.getString("timing"));
                medicine.addProperty("prescriptionDate", rs.getString("created_at"));
                prescriptionArray.add(medicine);
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(prescriptionArray.toString());
    }
}