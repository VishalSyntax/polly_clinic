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

public class AddDoctorServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String specialization = request.getParameter("specialization");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        String license = request.getParameter("license");
        
        JsonObject jsonResponse = new JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            conn.setAutoCommit(false);
            
            // Insert user
            String userSql = "INSERT INTO users (username, password, user_type) VALUES (?, ?, 'doctor')";
            PreparedStatement userStmt = conn.prepareStatement(userSql, PreparedStatement.RETURN_GENERATED_KEYS);
            userStmt.setString(1, username);
            userStmt.setString(2, password);
            userStmt.executeUpdate();
            
            ResultSet rs = userStmt.getGeneratedKeys();
            int userId = 0;
            if (rs.next()) {
                userId = rs.getInt(1);
            }
            
            // Insert doctor
            String doctorSql = "INSERT INTO doctors (user_id, name, specialization, phone, email, license_number) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement doctorStmt = conn.prepareStatement(doctorSql);
            doctorStmt.setInt(1, userId);
            doctorStmt.setString(2, name);
            doctorStmt.setString(3, specialization);
            doctorStmt.setString(4, phone);
            doctorStmt.setString(5, email);
            doctorStmt.setString(6, license);
            doctorStmt.executeUpdate();
            
            conn.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Doctor added successfully");
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error adding doctor: " + e.getMessage());
        }
        
        out.print(jsonResponse.toString());
    }
}