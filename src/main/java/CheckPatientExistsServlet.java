import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;

public class CheckPatientExistsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String contact = request.getParameter("contact");
        
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT COUNT(*) as count FROM patients WHERE contact_number = ?";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, contact);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                boolean exists = rs.getInt("count") > 0;
                jsonResponse.addProperty("exists", exists);
            } else {
                jsonResponse.addProperty("exists", false);
            }
        } catch (Exception e) {
            jsonResponse.addProperty("exists", false);
            jsonResponse.addProperty("error", e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}