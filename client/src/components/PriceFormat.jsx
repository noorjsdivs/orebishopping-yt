import { cn } from "./ui/cn";
import PropTypes from "prop-types";

const PriceFormat = ({ amount, className }) => {
  // Handle undefined, null, or NaN values
  const numericAmount =
    typeof amount === "number" && !isNaN(amount) ? amount : 0;

  const formattedAmount = new Number(numericAmount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return <span className={cn(className)}>{formattedAmount}</span>;
};

PriceFormat.propTypes = {
  amount: PropTypes.number,
  className: PropTypes.string,
};

export default PriceFormat;
