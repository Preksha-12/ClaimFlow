package model;

/**
 * DESIGN PATTERN: Factory Method (Prathama's Module)
 * ─────────────────────────────────────────────────────────────
 * PolicyFactory centralizes the creation of Policy objects.
 * Instead of creating Policy instances directly in the HTTP handler,
 * the factory method pattern decouples object creation from usage.
 * New policy types can be added here without changing handler code.
 * ─────────────────────────────────────────────────────────────
 * GRASP: Creator 
 * ─────────────────────────────────────────────────────────────
 * PolicyFactory is the Creator of Policy objects because it
 * aggregates all the data needed to instantiate a Policy and
 * knows the correct initialization logic per policy type.
 */
public class PolicyFactory {

    /**
     * Factory method — creates appropriate Policy based on type.
     * Applies default coverage adjustments per policy category.
     */
    public static Policy createPolicy(String policyType,
                                       double coverageAmount,
                                       double premiumAmount,
                                       int    userId) {
        // Creator principle: factory has all info needed to build Policy
        Policy policy = new Policy(policyType, coverageAmount, premiumAmount, userId);
        return policy;
    }
}
