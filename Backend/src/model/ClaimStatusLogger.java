package model;

/**
 * DESIGN PATTERN: Observer — Concrete Observer (Piyush's Module)
 * Logs every claim status change to the console.
 * In a real system this could send emails or push notifications.
 */
public class ClaimStatusLogger implements ClaimStatusObserver {
    @Override
    public void onStatusChanged(int claimId, String newStatus) {
        System.out.println("[CLAIM UPDATE] Claim #" + claimId
            + " status changed to: " + newStatus
            + " at " + new java.util.Date());
    }
}
