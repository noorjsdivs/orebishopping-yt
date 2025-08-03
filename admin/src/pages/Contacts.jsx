import PremiumMessage from "../components/PremiumMessage";

const Contacts = () => {
  const contactFeatures = [
    "Advanced contact management system",
    "Automated email response templates",
    "Contact analytics and reporting",
    "Bulk contact operations",
    "Contact segmentation and filtering",
    "Priority support ticket system",
  ];

  return (
    <PremiumMessage
      title="Advanced Contact Management"
      description="Manage customer inquiries, support tickets, and communications with our comprehensive contact management system."
      features={contactFeatures}
    />
  );
};

export default Contacts;
