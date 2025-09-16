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

@WebServlet("/getPatientContact")
public class GetPatientContactServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String patientId = request.getParameter("patientId");
        
        JsonObject jsonResponse = new JsonObject();
        
        if (patientId == null || patientId.trim().isEmpty()) {
            jsonResponse.addProperty("error", "Patient ID is required");
            out.print(jsonResponse.toString());
            return;
        }
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT contact FROM patients WHERE id = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, patientId);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String contact = rs.getString("contact");
                jsonResponse.addProperty("contact", contact);
            } else {
                jsonResponse.addProperty("error", "Patient not found");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("error", "Database error: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}