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

public class GetAllReceptionistsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        JsonArray receptionistsArray = new JsonArray();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT r.id, u.username, r.name, r.phone, r.email, r.shift_timing, u.is_active " +
                        "FROM receptionists r JOIN users u ON r.user_id = u.id";
            
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                JsonObject receptionist = new JsonObject();
                receptionist.addProperty("id", rs.getInt("id"));
                receptionist.addProperty("username", rs.getString("username"));
                receptionist.addProperty("name", rs.getString("name"));
                receptionist.addProperty("phone", rs.getString("phone"));
                receptionist.addProperty("email", rs.getString("email"));
                receptionist.addProperty("shift", rs.getString("shift_timing"));
                receptionist.addProperty("isActive", rs.getBoolean("is_active"));
                receptionistsArray.add(receptionist);
            }
        } catch (Exception e) {
            JsonObject error = new JsonObject();
            error.addProperty("error", e.getMessage());
            out.print(error.toString());
            return;
        }
        
        out.print(receptionistsArray.toString());
    }
}