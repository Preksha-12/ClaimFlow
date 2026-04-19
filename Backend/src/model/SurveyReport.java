package model;

/**
 * GRASP: Low Coupling (Pranav's Module)
 * ─────────────────────────────────────────────────────────────
 * SurveyReport is a pure data carrier for damage-inspection reports.
 * It has NO dependency on ClaimDAO, ClaimController or any service
 * class — it only holds the fields captured during inspection.
 * Keeping this model decoupled means report creation, storage and
 * display can evolve independently of one another.
 */
public class SurveyReport {
    private int    reportId;
    private int    claimId;
    private int    surveyorId;
    private String damageDescription;
    private double estimatedLoss;
    private double assessedLoss;
    private String recommendation;
    private String inspectionDate;

    public SurveyReport(int    claimId,
                        int    surveyorId,
                        String damageDescription,
                        double estimatedLoss,
                        String inspectionDate) {
        this.claimId           = claimId;
        this.surveyorId        = surveyorId;
        this.damageDescription = damageDescription;
        this.estimatedLoss     = estimatedLoss;
        this.inspectionDate    = inspectionDate;
    }

    public int    getReportId()          { return reportId; }
    public int    getClaimId()           { return claimId; }
    public int    getSurveyorId()        { return surveyorId; }
    public String getDamageDescription() { return damageDescription; }
    public double getEstimatedLoss()     { return estimatedLoss; }
    public double getAssessedLoss()      { return assessedLoss; }
    public String getRecommendation()    { return recommendation; }
    public String getInspectionDate()    { return inspectionDate; }

    public void setReportId(int reportId)               { this.reportId = reportId; }
    public void setAssessedLoss(double assessedLoss)    { this.assessedLoss = assessedLoss; }
    public void setRecommendation(String recommendation){ this.recommendation = recommendation; }
}
