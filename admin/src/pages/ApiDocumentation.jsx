import PremiumMessage from "../components/PremiumMessage";

const ApiDocumentation = () => {
  const apiFeatures = [
    "Complete REST API documentation",
    "Interactive API testing interface",
    "Real-time API monitoring",
    "Authentication endpoints",
    "Webhook integrations",
    "Developer support and resources",
  ];

  return (
    <PremiumMessage
      title="API Documentation & Integration"
      description="Access comprehensive API documentation, testing tools, and integration resources for developers."
      features={apiFeatures}
    />
  );
};

export default ApiDocumentation;
