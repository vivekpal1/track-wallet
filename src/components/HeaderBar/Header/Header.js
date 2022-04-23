import classes from "./Header.module.css";
import HeaderItem from "./HeaderItem";
import WalletIcon from "../WalletIcon/WalletIcon";
import CaretIcon from "../../../icons/headerbar/caret.svg";
import NetworkIcon from "../../../icons/headerbar/network.svg";
import CurrencyIcon from "../../../icons/currencies/currency.svg";
import WalletDropdownMenu from "../WalletDropdown/WalletDropdownMenu";
import UserContext from "../../../context/UserContext";
import ChainDropdownMenu from "../ChainDropdown/ChainDropdownMenu";
import CurrencyDropdownMenu from "../CurrencyDropDown/CurrencyDropdownMenu";
import { useContext } from "react";

const Header = (props) => {
  const userCtx = useContext(UserContext);

  const selectedWallet = userCtx.selectedWallet;

  return (
    <nav className={classes.header}>
      <div className={classes["wallet-div"]}>
        <WalletIcon />
        <HeaderItem icon={CaretIcon}>
          <WalletDropdownMenu />
        </HeaderItem>
        <h2>Wallets</h2>
      </div>
      <h2 className={classes["wallet-address"]}>{selectedWallet}</h2>
      <div className={classes["end-dropdowns"]}>
        <h3>Networks</h3>
        <HeaderItem icon={NetworkIcon}>
          <ChainDropdownMenu />
        </HeaderItem>
        <h3>Currencies</h3>
        <HeaderItem icon={CurrencyIcon}>
          <CurrencyDropdownMenu currencyData={props.currencyData} />
        </HeaderItem>
      </div>
    </nav>
  );
};

export default Header;
