package model;

/**
 * DESIGN PATTERN: Observer — Interface (Piyush's Module)
 * ─────────────────────────────────────────────────────────────
 * Observer pattern: when a Claim's status changes, all registered
 * observers are automatically notified.
 * This decouples status update logic from notification logic.
 * New observers (email, SMS, logs) can be added without touching
 * the ClaimController.
 */
public interface ClaimStatusObserver {
    void onStatusChanged(int claimId, String newStatus);
}
