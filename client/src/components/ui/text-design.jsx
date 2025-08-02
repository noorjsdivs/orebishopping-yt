import { cn } from "./cn";

const Title = ({ children, className }) => {
  return (
    <h3 className={cn("text-xl font-bodyFont font-semibold mb-6", className)}>
      {children}
    </h3>
  );
};

export default Title;
