package model;

/**
 * DESIGN PATTERN: Strategy — interface (Pranav's Module)
 * ─────────────────────────────────────────────────────────────
 * Defines the contract for every damage-assessment algorithm.
 * Different strategies (standard, catastrophic, depreciation-based…)
 * can be plugged in without changing the caller code in the handler.
 */
public interface DamageAssessmentStrategy {

    /**
     * Computes the assessed loss amount for a given survey report,
     * bounded by the policy's coverage amount.
     */
    double assess(SurveyReport report, double coverageAmount);

    /**
     * Returns the recommended next action for the ClaimOfficer
     * based on the assessed loss and policy coverage.
     */
    String recommend(double assessedLoss, double coverageAmount);
}
