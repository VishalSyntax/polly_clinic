import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/getUserInfo")
public class GetUserInfoServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("username") != null) {
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("fullName", (String) session.getAttribute("fullName"));
            userInfo.put("currentDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM, yyyy")));
            userInfo.put("loginTime", (String) session.getAttribute("loginTime"));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(new Gson().toJson(userInfo));
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}