package dao;

import model.Claim;
import util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Module: Claim Submission & Tracking (Piyush)
 * Data Access Object for all claim-related DB operations.
 */
public class ClaimDAO {

    public static boolean submitClaim(Claim claim) {
        try {
            Connection conn = DBConnection.getConnection();
            String query = "INSERT INTO claim(policy_id, claim_amount, status, claim_type, claim_date, user_id) VALUES(?,?,?,?,CURDATE(),?)";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1,    claim.getPolicyId());
            stmt.setDouble(2, claim.getClaimAmount());
            stmt.setString(3, claim.getStatus());
            stmt.setString(4, claim.getClaimType());
            stmt.setInt(5,    claim.getUserId());
            stmt.executeUpdate();
            return true;
        } catch(Exception e) { e.printStackTrace(); }
        return false;
    }

    public static boolean updateClaimStatus(int claimId, String newStatus) {
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement("UPDATE claim SET status=? WHERE claim_id=?");
            stmt.setString(1, newStatus);
            stmt.setInt(2,    claimId);
            stmt.executeUpdate();
            return true;
        } catch(Exception e) { e.printStackTrace(); }
        return false;
    }

    public static ResultSet getClaimsByUser(int userId) {
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT * FROM claim WHERE user_id=? ORDER BY claim_date DESC, claim_id DESC");
            stmt.setInt(1, userId);
            return stmt.executeQuery();
        } catch(Exception e) { e.printStackTrace(); }
        return null;
    }

    public static ResultSet getAllClaims() {
        try {
            Connection conn = DBConnection.getConnection();
            return conn.prepareStatement(
                "SELECT * FROM claim ORDER BY claim_date DESC, claim_id DESC").executeQuery();
        } catch(Exception e) { e.printStackTrace(); }
        return null;
    }

    public static double getCoverageAmount(int policyId) {
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement("SELECT coverage_amount FROM policy WHERE policy_id=?");
            stmt.setInt(1, policyId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) return rs.getDouble("coverage_amount");
        } catch(Exception e) { e.printStackTrace(); }
        return -1;
    }
}
