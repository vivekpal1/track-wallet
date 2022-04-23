import classes from "./Token.module.css";
import ArrowUpIcon from "../../../../../icons/token/arrowupgreen.svg";
import ArrowDownIcon from "../../../../../icons/token/arrowdownred.svg";
import PieChartIcon from "../../../../../icons/token/piechart.svg";
import AllChainsIcon from "../../../../../icons/chains/all-chains.svg";
import EthereumIcon from "../../../../../icons/chains/ethereum.svg";
import AvalancheIcon from "../../../../../icons/chains/avalanche.svg";
import PolygonIcon from "../../../../../icons/chains/polygon.svg";
import SpamTokenIcon from "../../../../../icons/token/spam.svg";
import UnknownTokenIcon from "../../../../../icons/token/questionmark.svg";
import UserContext from "../../../../../context/UserContext";
import { useContext } from "react";

const Token = (props) => {
  const userCtx = useContext(UserContext);

  const calcPercentageOfTotal = (portfolioValue, tokenValue) => {
    if (tokenValue == null || tokenValue == 0 || tokenValue == undefined) {
      return 0;
    }
    return (tokenValue / portfolioValue) * 100;
  }

  const formattedName = props.name.substring(0, 20);
  const formattedValue =
    userCtx.selectedCurrencySymbol +
    props.value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const formattedBalance = (+props.balance)
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .substring(0, 10);
  const formattedSymbol = props.symbol.substring(0, 10);
  const formattedDistributionAmount =
    calcPercentageOfTotal(props.portfolioValue, props.value).toFixed(2) + "%";
  const formattedPrice =
    userCtx.selectedCurrencySymbol +
    props.price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedProfitLoss =
    userCtx.selectedCurrencySymbol +
    (props.profitLoss).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedDayChange = props.dayChange.toFixed(1) + "%";

  const AVAILABLE_CHAINS = {
    ETHEREUM: "ethereum",
    POLYGON: "polygon",
    AVALANCHE: "avalanche",
    ALL_AVAILABLE: "all",
  };

  let tokenImage = "";
  if (props.image === "NATIVE_TOKEN") {
    switch (props.chain) {
      case AVAILABLE_CHAINS.ETHEREUM:
        tokenImage = EthereumIcon;
        break;
      case AVAILABLE_CHAINS.POLYGON:
        tokenImage = PolygonIcon;
        break;
      case AVAILABLE_CHAINS.AVALANCHE:
        tokenImage = AvalancheIcon;
        break;
      default:
        tokenImage = UnknownTokenIcon;
        break;
    }
  }

  if (props.image === "unknown") {
    tokenImage = UnknownTokenIcon;
  } else if (props.image === "spam") {
    tokenImage = SpamTokenIcon;
  } else if (tokenImage.length === 0) {
    tokenImage = props.image;
  }

  let chainIcon;
  switch (props.chain) {
    case AVAILABLE_CHAINS.ETHEREUM:
      chainIcon = EthereumIcon;
      break;
    case AVAILABLE_CHAINS.AVALANCHE:
      chainIcon = AvalancheIcon;
      break;
    case AVAILABLE_CHAINS.POLYGON:
      chainIcon = PolygonIcon;
      break;
    case AVAILABLE_CHAINS.ALL_AVAILABLE:
      chainIcon = AllChainsIcon;
      break;
    default:
      tokenImage = UnknownTokenIcon;
      break;
  }

  let arrowIcon;
  //profit
  if (props.dayChange >= 0) {
    arrowIcon = ArrowUpIcon;
  }
  //loss
  if (props.dayChange < 0) {
    arrowIcon = ArrowDownIcon;
  }

  if (props.dayChange === 0) {
    arrowIcon = UnknownTokenIcon;
  }

  return (
    <li className={classes.token}>
      <img className={classes["token-image"]} src={tokenImage} alt="token" />
      <div className={classes["name-percentage"]}>
        <p className={classes["name"]}>{formattedName}</p>
        <div className={classes["piechart-percentage"]}>
          <img
            className={classes["piechart"]}
            src={PieChartIcon}
            alt="piechart"
          />
          <p className={classes["portfolio-distribution-amount"]}>
            {formattedDistributionAmount}
          </p>
        </div>
      </div>
      <p className={classes["value"]}>{formattedValue}</p>
      <div className={classes["balance-container"]}>
        <p className={classes["balance"]}>{formattedBalance}</p>
        <p className={classes["symbol"]}>{formattedSymbol}</p>
      </div>
      <p className={classes["price"]}>{formattedPrice}</p>
      <div className={classes["profit-loss-percentage-change"]}>
        <p className={classes["profit-loss-amount"]}>{formattedProfitLoss}</p>
        <div className={classes["percentage-change-container"]}>
          <p className={classes["percentage-amount"]}>{formattedDayChange}</p>
          <img
            className={classes["arrow-image"]}
            src={arrowIcon}
            alt="profit-loss-arrow"
          />
        </div>
      </div>
      <img className={classes["chain"]} src={chainIcon} alt="chain" />
    </li>
  );
};

export default Token;
