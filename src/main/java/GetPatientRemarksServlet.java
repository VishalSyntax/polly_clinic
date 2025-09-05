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

public class GetPatientRemarksServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String patientId = request.getParameter("patientId");
        JsonArray remarksArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT pr.remarks, pr.created_at, d.name as doctor_name " +
                        "FROM patient_remarks pr " +
                        "JOIN doctors d ON pr.doctor_id = d.user_id " +
                        "WHERE pr.patient_id = ? " +
                        "ORDER BY pr.created_at DESC";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, patientId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject remark = new JsonObject();
                remark.addProperty("remarks", rs.getString("remarks"));
                remark.addProperty("date", rs.getString("created_at"));
                remark.addProperty("doctorName", rs.getString("doctor_name"));
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