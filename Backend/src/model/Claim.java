package model;

/**
 * Module: Claim Submission & Tracking (Piyush)
 */
public class Claim {
    private int    claimId;
    private int    policyId;
    private double claimAmount;
    private String status;
    private String claimType;
    private int    userId;

    public Claim(int policyId, double claimAmount, String status, String claimType, int userId) {
        this.policyId    = policyId;
        this.claimAmount = claimAmount;
        this.status      = status;
        this.claimType   = claimType;
        this.userId      = userId;
    }

    public int    getPolicyId()    { return policyId; }
    public double getClaimAmount() { return claimAmount; }
    public String getStatus()      { return status; }
    public String getClaimType()   { return claimType; }
    public int    getUserId()      { return userId; }
    public int    getClaimId()     { return claimId; }
}
