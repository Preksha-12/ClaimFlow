package model;

/**
 * DESIGN PATTERN: Factory Method — used with PolicyFactory (Prathama's Module)
 * Represents an insurance policy assigned to a PolicyHolder.
 */
public class Policy {
    private int    policyId;
    private String policyType;
    private double coverageAmount;
    private double premiumAmount;
    private String startDate;
    private String endDate;
    private String status;
    private int    userId;

    public Policy(String policyType, double coverageAmount, double premiumAmount, int userId) {
        this.policyType     = policyType;
        this.coverageAmount = coverageAmount;
        this.premiumAmount  = premiumAmount;
        this.userId         = userId;
        this.status         = "Active";
    }

    public String getPolicyType()     { return policyType; }
    public double getCoverageAmount() { return coverageAmount; }
    public double getPremiumAmount()  { return premiumAmount; }
    public int    getUserId()         { return userId; }
    public String getStatus()         { return status; }
}
