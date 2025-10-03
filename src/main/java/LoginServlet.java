import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonObject;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String selectedUserType = request.getParameter("userType");

        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT id, user_type FROM users WHERE username = ? AND password = ? AND is_active = TRUE";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                int userId = rs.getInt("id");
                String role = rs.getString("user_type");
                
                // Validate that selected user type matches actual user type
                if (selectedUserType != null && !role.equals(selectedUserType)) {
                    response.sendRedirect("index.jsp?error=Please+select+the+correct+user+type+for+your+account");
                    return;
                }

                HttpSession session = request.getSession();
                session.setAttribute("userId", userId);
                session.setAttribute("username", username);
                session.setAttribute("role", role);
                session.setAttribute("loginTime", java.time.LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a")));

                String forwardJsp = "";
                String name = "";

                if ("doctor".equals(role)) {
                    String doctorSql = "SELECT id, name FROM doctors WHERE user_id = ?";
                    PreparedStatement doctorStmt = conn.prepareStatement(doctorSql);
                    doctorStmt.setInt(1, userId);
                    ResultSet doctorRs = doctorStmt.executeQuery();
                    if (doctorRs.next()) {
                        session.setAttribute("doctorId", doctorRs.getInt("id"));
                        name = doctorRs.getString("name");
                    }
                    forwardJsp = "doctor-appointments.jsp";
                } else if ("receptionist".equals(role)) {
                    String recSql = "SELECT id, name FROM receptionists WHERE user_id = ?";
                    PreparedStatement recStmt = conn.prepareStatement(recSql);
                    recStmt.setInt(1, userId);
                    ResultSet recRs = recStmt.executeQuery();
                    if (recRs.next()) {
                        session.setAttribute("receptionistId", recRs.getInt("id"));
                        name = recRs.getString("name");
                    }
                    forwardJsp = "receptionist-dashboard.jsp";
                } else if ("admin".equals(role)) {
                    name = "Admin";
                    forwardJsp = "admin-dashboard.jsp";
                } else {
                    response.sendRedirect("index.jsp?error=Invalid+role");
                    return;
                }

                session.setAttribute("fullName", name);

                RequestDispatcher dispatcher = request.getRequestDispatcher(forwardJsp);
                dispatcher.forward(request, response);

            } else {
                response.sendRedirect("index.jsp?error=Invalid+credentials");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("index.jsp?error=Database+error");
        }
    }
}