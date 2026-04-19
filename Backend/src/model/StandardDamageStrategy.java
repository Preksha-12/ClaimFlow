package model;

/**
 * DESIGN PATTERN: Strategy — concrete (Pranav's Module)
 * ─────────────────────────────────────────────────────────────
 * Default damage-assessment algorithm used during a standard survey.
 * The estimated loss is capped at the policy's coverage amount and
 * the recommendation is derived from the loss-to-coverage ratio.
 */
public class StandardDamageStrategy implements DamageAssessmentStrategy {

    @Override
    public double assess(SurveyReport report, double coverageAmount) {
        double estimated = report.getEstimatedLoss();
        if (estimated < 0) estimated = 0;
        return Math.min(estimated, coverageAmount);
    }

    @Override
    public String recommend(double assessedLoss, double coverageAmount) {
        if (coverageAmount <= 0) return "Review";
        double ratio = assessedLoss / coverageAmount;
        if (ratio >= 0.80) return "Full Payout Recommended";
        if (ratio >= 0.30) return "Partial Payout Recommended";
        if (ratio >  0.00) return "Minor Payout Recommended";
        return "Reject";
    }
}
