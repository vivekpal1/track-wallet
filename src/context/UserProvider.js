import { useReducer } from "react";
import UserContext from "./UserContext";

const availableActions = {
  DISPLAY: "display",
  HIDE: "hide",
  ADD: "add",
  REMOVE: "remove",
  SELECT_WALLET: "selectWallet",
  SELECT_CHAIN: "selectChain",
  SELECT_CURRENCY: "selectCurrency",
  SET_CURRENCY_VALUE: "setCurrencyValue",
};

const availableChains = {
  ETHEREUM: "ethereum",
  POLYGON: "polygon",
  AVALANCHE: "avalanche",
  ALL_AVAILABLE: "all",
};

const availableCurrencies = {
  USD: "USD",
};

const availableCurrenciesSymbol = {
  USD: "$",
};

// handles local storage for wallet addresses on app launch
const walletStorageHandler = () => {
  /* in a try catch as firefox thorws an error when localStorage variable doenst exist */
  try {
    //try to retrieve localStorage variable
    const walletAddresses = JSON.parse(localStorage.getItem("walletAddresses"));

    if (!walletAddresses) {
      localStorage.setItem("walletAddresses", JSON.stringify([]));
      return [];
    }

    //exists in local storage & has no saved addresses
    if (walletAddresses && walletAddresses.length === 0) {
      return [];
    }

    //exists in locals torage & has saved addresses
    if (walletAddresses && walletAddresses.length > 0) {
      //return all addresses in array
      return [...walletAddresses];
    }

    //error caught -> localStorage doenst exist in firefox(during testing)
  } catch (e) {
    //create empty walletAddresses localStorage object
    localStorage.setItem("walletAddresses", JSON.stringify([]));
    return [];
  }
};

const initalSelectedWalletHandler = () => {
  const walletAddresses = JSON.parse(localStorage.getItem("walletAddresses"));

  try {
    const selectedWallet = JSON.parse(localStorage.getItem("selectedWallet"));

    if (!selectedWallet) {
      if (!walletAddresses) {
        localStorage.setItem("selectedWallet", JSON.stringify(""));
        return null;
      }

      localStorage.setItem(
        "selectedWallet",
        JSON.stringify(walletAddresses[0])
      );
      return walletAddresses[0];
    }

    if (selectedWallet && selectedWallet !== "") {
      return selectedWallet;
    } else {
      return walletAddresses[0];
    }
  } catch (e) {
    localStorage.setItem("selectedWallet", JSON.stringify(""));
    return null;
  }
};

const initialSelectedChainHandler = () => {
  try {
    const selectedChain = JSON.parse(localStorage.getItem("selectedChain"));

    if (!selectedChain) {
      localStorage.setItem(
        "selectedChain",
        JSON.stringify(availableChains.ETHEREUM)
      );
      return availableChains.ETHEREUM;
    }
    return selectedChain;
  } catch (e) {
    localStorage.setItem(
      "selectedChain",
      JSON.stringify(availableChains.ETHEREUM)
    );
    return availableChains.ETHEREUM;
  }
};

const initialUserState = {
  //fetch wallets from local storage
  wallets: walletStorageHandler(),
  isModalShowing: false,
  selectedWallet: initalSelectedWalletHandler(),
  selectedChain: initialSelectedChainHandler(),
  selectedCurrency: availableCurrencies.USA,
  selectedCurrencyValue: 1,
  selectedCurrencySymbol: availableCurrenciesSymbol.USD,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case availableActions.DISPLAY: {
      return {
        ...state,
        isModalShowing: true,
      };
    }

    case availableActions.HIDE: {
      return {
        ...state,
        isModalShowing: false,
      };
    }

    case availableActions.ADD: {
      const currentWallets = state.wallets;
      const newWalletAddress = action.walletAddress;

      // //if blank input field
      if (newWalletAddress.length === 0) {
        return {
          ...state,
        };
      }

      const lowerCaseWalletAddresses = currentWallets.map((address) =>
        address.toLowerCase()
      );

      if (
        lowerCaseWalletAddresses.includes(action.walletAddress.toLowerCase())
      ) {
        console.log("wallet already added");
        //switch to the already added wallet
        return {
          ...state,
          selectedWallet: newWalletAddress,
        };
      }

      currentWallets.push(newWalletAddress);
      localStorage.setItem("walletAddresses", JSON.stringify(currentWallets));
      localStorage.setItem("selectedWallet", JSON.stringify(newWalletAddress));

      return {
        ...state,
        wallets: currentWallets,
        selectedWallet: newWalletAddress,
      };
    }

    case availableActions.REMOVE: {
      const walletAddresses = state.wallets;
      const updatedWallets = walletAddresses.filter(
        (wallet) => wallet != action.walletAddress
      );

      localStorage.setItem("walletAddresses", JSON.stringify(updatedWallets));

      //check if clicked wallet is currently active wallet

      if (action.walletAddress === state.selectedWallet) {
        if (updatedWallets.length === 0) {
          localStorage.setItem("selectedWallet", JSON.stringify(""));

          return {
            ...state,
            wallets: updatedWallets,
            selectedWallet: "",
          };
        }
        const firstWallet = () => {
          //deleted wallet == the first wallet
          if (action.walletAddress === state.wallets[0]) {
            localStorage.setItem(
              "selectedWallet",
              JSON.stringify(state.wallets[1])
            );
            return state.wallets[1];
          }
          localStorage.setItem(
            "selectedWallet",
            JSON.stringify(state.wallets[0])
          );
          return state.wallets[0];
        };
        return {
          ...state,
          wallets: updatedWallets,
          selectedWallet: firstWallet(),
        };
      }

      return {
        ...state,
        wallets: updatedWallets,
      };
    }

    case availableActions.SELECT_WALLET: {
      const updatedSelectedWallet = action.walletAddress;
      localStorage.setItem(
        "selectedWallet",
        JSON.stringify(updatedSelectedWallet)
      );

      return {
        ...state,
        selectedWallet: updatedSelectedWallet,
      };
    }

    case availableActions.SELECT_CHAIN: {
      const updatedChain = action.chainName;
      localStorage.setItem("selectedChain", JSON.stringify(updatedChain));
      return {
        ...state,
        selectedChain: updatedChain,
      };
    }

    case availableActions.SELECT_CURRENCY:
      const updatedCurrency = action.currencyName;
      const updatedCurrencyValue = action.currencyValue;
      const updatedCurrencySymbol = availableCurrenciesSymbol[updatedCurrency];
      return {
        ...state,
        selectedCurrency: updatedCurrency,
        selectedCurrencyValue: updatedCurrencyValue,
        selectedCurrencySymbol: updatedCurrencySymbol,
      };

    default:
      return {
        ...state,
      };
  }
};

const UserProvider = (props) => {
  const [userState, dispatchUserAction] = useReducer(
    userReducer,
    initialUserState
  );

  const showModalHandler = () => {
    dispatchUserAction({ type: availableActions.DISPLAY });
  };

  const hideModalHandler = () => {
    dispatchUserAction({ type: availableActions.HIDE });
  };

  const addWalletHandler = (walletAddress) => {
    dispatchUserAction({
      type: availableActions.ADD,
      walletAddress: walletAddress,
    });
  };

  const removeWalletHandler = (walletAddress) => {
    dispatchUserAction({
      type: availableActions.REMOVE,
      walletAddress: walletAddress,
    });
  };

  const selectedWalletHandler = (walletAddress) => {
    dispatchUserAction({
      type: availableActions.SELECT_WALLET,
      walletAddress: walletAddress,
    });
  };

  //chain dropdown in menu
  const selectChainHandler = (chainName) => {
    dispatchUserAction({
      type: availableActions.SELECT_CHAIN,
      chainName: chainName,
    });
  };

  const selectCurrencyHandler = (currencyName, currencyValue) => {
    dispatchUserAction({
      type: availableActions.SELECT_CURRENCY,
      currencyName: currencyName,
      currencyValue: currencyValue,
    });
  };

  const userContext = {
    wallets: userState.wallets,
    isModalShowing: userState.isModalShowing,
    selectedWallet: userState.selectedWallet,
    selectedChain: userState.selectedChain,
    selectedCurrency: userState.selectedCurrency,
    selectedCurrencyValue: userState.selectedCurrencyValue,
    selectedCurrencySymbol: userState.selectedCurrencySymbol,
    showModal: showModalHandler,
    hideModal: hideModalHandler,
    addWallet: addWalletHandler,
    removeWallet: removeWalletHandler,
    selectWallet: selectedWalletHandler,
    selectChain: selectChainHandler,
    selectCurrency: selectCurrencyHandler,
  };

  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
