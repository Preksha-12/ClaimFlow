package controller;

import dao.ClaimDAO;
import model.Claim;
import model.ClaimStatusObserver;
import model.ClaimStatusLogger;

import java.util.ArrayList;
import java.util.List;

/**
 * GRASP: Controller (Piyush's Module)
 * ─────────────────────────────────────────────────────────────
 * ClaimController acts as the system controller for all
 * claim-related operations. It handles system events from the
 * HTTP layer (submitClaim, updateStatus) and coordinates with
 * ClaimDAO without containing business logic itself.
 * ─────────────────────────────────────────────────────────────
 * DESIGN PATTERN: Observer — Subject (Piyush's Module)
 * ─────────────────────────────────────────────────────────────
 * ClaimController is the Subject in the Observer pattern.
 * When a claim's status changes, all registered observers
 * (e.g. ClaimStatusLogger) are automatically notified.
 */
public class ClaimController {

    // Observer list — registered listeners for status changes
    private static List<ClaimStatusObserver> observers = new ArrayList<>();

    static {
        // Register default observer: status logger
        observers.add(new ClaimStatusLogger());
    }

    public static void addObserver(ClaimStatusObserver observer) {
        observers.add(observer);
    }

    /** Submit a new claim */
    public static boolean submitClaim(int policyId, double amount,
                                       String claimType, int userId) {
        Claim claim = new Claim(policyId, amount, "Submitted", claimType, userId);
        return ClaimDAO.submitClaim(claim);
    }

    /**
     * Update claim status and notify all observers.
     * Observer pattern: all listeners are triggered on status change.
     */
    public static boolean updateStatus(int claimId, String newStatus) {
        boolean result = ClaimDAO.updateClaimStatus(claimId, newStatus);
        if (result) {
            // Notify all observers (Observer Pattern)
            for (ClaimStatusObserver observer : observers) {
                observer.onStatusChanged(claimId, newStatus);
            }
        }
        return result;
    }
}
