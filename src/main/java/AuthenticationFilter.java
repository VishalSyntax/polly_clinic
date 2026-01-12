import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebFilter("/*")
public class AuthenticationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        HttpSession session = request.getSession(false);

        String requestURI = request.getRequestURI();

        boolean isLoginPage = requestURI.endsWith("index.jsp") || requestURI.endsWith("/login");
        boolean isStaticResource = requestURI.contains("/css/") || requestURI.contains("/js/") || requestURI.contains("/img/");
        boolean isLoggedIn = (session != null && session.getAttribute("username") != null);

        if (isLoggedIn || isLoginPage || isStaticResource) {
            // If the user is logged in or is accessing a public resource, set cache headers and continue.
            if (isLoggedIn && !isStaticResource) {
                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
                response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
                response.setDateHeader("Expires", 0); // Proxies.
            }
            chain.doFilter(req, res);
        } else {
            // If not logged in and trying to access a protected page, redirect to the login page.
            response.sendRedirect(request.getContextPath() + "/index.jsp");
        }
    }
}