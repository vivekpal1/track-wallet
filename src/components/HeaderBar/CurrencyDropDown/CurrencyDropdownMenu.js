import classes from "./CurrencyDropdownMenu.module.css";
import CurrencyDropdownItem from "./CurrencyDropdownItem";
import USA from "../../../icons/currencies/usa.svg";

const CurrencyDropdownMenu = (props) => {
  const data = props.currencyData["data"];

  return (
    <div className={classes.dropdown}>
      <p>Available Currencies</p>
      <CurrencyDropdownItem leftIcon={USA} key={"USD"} name={"USD"} value={1}>
        <h3>$-Dollar</h3>
      </CurrencyDropdownItem>
    </div>
  );
};

export default CurrencyDropdownMenu;
