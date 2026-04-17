package dao;

import model.User;
import util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * GRASP: Information Expert (Preksha's Module)
 * ─────────────────────────────────────────────────────────────
 * UserDAO is the Information Expert for all user-related data.
 * It holds complete knowledge of the users table structure and
 * is solely responsible for login authentication and user lookup.
 * No other class needs to know how users are stored or queried.
 */
public class UserDAO {

    public static User login(String email, String password) {
        User user = null;
        try {
            Connection conn = DBConnection.getConnection();
            String query = "SELECT * FROM users WHERE email=? AND password=?";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, email);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                user = new User(
                    rs.getInt("user_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getString("role")
                );
            }
        } catch (Exception e) { e.printStackTrace(); }
        return user;
    }
}
