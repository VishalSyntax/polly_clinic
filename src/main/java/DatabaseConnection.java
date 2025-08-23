import java.sql.*;

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/clinic_db";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "0809";
    
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}

class UserDAO {
    public boolean authenticateUser(String username, String password, String userType) {
        String sql = "SELECT * FROM users WHERE username = ? AND password = ? AND user_type = ? AND is_active = TRUE";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, userType);
            
            ResultSet rs = stmt.executeQuery();
            return rs.next();
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean addDoctor(String username, String password, String name, String specialization, 
                           String phone, String email, String license) {
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);
            
            String userSql = "INSERT INTO users (username, password, user_type) VALUES (?, ?, 'doctor')";
            PreparedStatement userStmt = conn.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
            userStmt.setString(1, username);
            userStmt.setString(2, password);
            userStmt.executeUpdate();
            
            ResultSet rs = userStmt.getGeneratedKeys();
            int userId = 0;
            if (rs.next()) {
                userId = rs.getInt(1);
            }
            
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
            return true;
            
        } catch (SQLException e) {
            try {
                if (conn != null) conn.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    public boolean addReceptionist(String username, String password, String name, 
                                 String phone, String email, String shift) {
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);
            
            String userSql = "INSERT INTO users (username, password, user_type) VALUES (?, ?, 'receptionist')";
            PreparedStatement userStmt = conn.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
            userStmt.setString(1, username);
            userStmt.setString(2, password);
            userStmt.executeUpdate();
            
            ResultSet rs = userStmt.getGeneratedKeys();
            int userId = 0;
            if (rs.next()) {
                userId = rs.getInt(1);
            }
            
            String recepSql = "INSERT INTO receptionists (user_id, name, phone, email, shift_timing) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement recepStmt = conn.prepareStatement(recepSql);
            recepStmt.setInt(1, userId);
            recepStmt.setString(2, name);
            recepStmt.setString(3, phone);
            recepStmt.setString(4, email);
            recepStmt.setString(5, shift);
            recepStmt.executeUpdate();
            
            conn.commit();
            return true;
            
        } catch (SQLException e) {
            try {
                if (conn != null) conn.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}