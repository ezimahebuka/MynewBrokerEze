import { useNavigate } from "react-router-dom";
import "./Deposit.css";
import { useState, useCallback } from "react";
import Modal from "../../Components/Modal/Modal";

const Deposit = () => {
  const nav = useNavigate();
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  // Define payment methods
  const paymentMethods = [
    {
      id: "wallet",
      name: "Crypto Wallet",
      route: "WALLET",
      isExpandable: true,
      networks: [
        { id: "btc", name: "Bitcoin (BTC)", route: "BTC" },
        { id: "eth", name: "Ethereum (ETH)", route: "ETH" },
        { id: "usdt-erc20", name: "USDT (ERC20)", route: "USDT-ERC20" },
        { id: "usdt-bep20", name: "USDT (BEP20)", route: "USDT-BEP20" },
        { id: "usdt-trc20", name: "USDT (TRC20)", route: "USDT-TRC20" },
        { id: "bnb", name: "Binance Coin (BNB)", route: "BNB" },
        // { id: "sol", name: "Solana (SOL)", route: "SOL" },
        // { id: "xrp", name: "Ripple (XRP)", route: "XRP" },
        // { id: "trx", name: "Tron (TRX)", route: "TRX" },
      ],
    },
    { id: "cashapp", name: "Cash App", route: "CASHAPP" },
    { id: "paypal", name: "PayPal", route: "PAYPAL" },
    { id: "bank", name: "Bank Transfer", route: "BANK" },
  ];

  const [expandedMethod, setExpandedMethod] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const handleAmount = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);

    if (newAmount.trim() === "" || newAmount === "0" || newAmount === "0.00") {
      setAmountError("Amount is required");
      setButtonDisabled(true);
    } else if (parseFloat(newAmount) <= 0) {
      setAmountError("Amount must be greater than 0");
      setButtonDisabled(true);
    } else {
      setAmountError("");
      // Enable button only if payment method is also selected
      if (selectedPaymentMethod) {
        setButtonDisabled(false);
      }
    }
  };

  const toggleExpand = useCallback((methodRoute) => {
    setExpandedMethod((prev) => (prev === methodRoute ? null : methodRoute));
  }, []);

  const unavailableMethods = ["CASHAPPf", "PAYPALf", "BANKf"];

  const handlePaymentMethodChange = useCallback(
    (methodRoute) => {
      if (unavailableMethods.includes(methodRoute)) {
        setModalConfig({
          type: "error",
          title: "Payment Method Unavailable",
          message:
            "This payment method is currently unavailable. Please contact live support or reach us at support@company.com for assistance.",
        });
        setShowModal(true);
        return;
      }
      setSelectedPaymentMethod(methodRoute);
      // Enable button only if amount is also valid
      if (amount && parseFloat(amount) > 0) {
        setButtonDisabled(false);
      }
    },
    [amount],
  );

  const handleNetworkSelect = useCallback(
    (networkRoute) => {
      setSelectedPaymentMethod(networkRoute);
      // Enable button only if amount is also valid
      if (amount && parseFloat(amount) > 0) {
        setButtonDisabled(false);
      }
    },
    [amount],
  );

  const submitPayment = () => {
    if (!amount || amount === "0.00" || parseFloat(amount) <= 0) {
      setModalConfig({
        type: "error",
        title: "Invalid Amount",
        message: "Please enter a valid amount greater than 0.",
      });
      setShowModal(true);
      return;
    }

    if (!selectedPaymentMethod) {
      setModalConfig({
        type: "error",
        title: "Payment Method Required",
        message: "Please select a payment method to continue.",
      });
      setShowModal(true);
      return;
    }

    localStorage.setItem("amount", JSON.stringify(amount));
    nav(`payment/${selectedPaymentMethod}`);
  };

  return (
    <>
      <div className="DepositBody">
        <h1>Fund your account balance</h1>
        <div className="DepositContent">
          <div className="DepositContentLeft">
            <div className="DepositContentLeftTop">
              <h3>Enter Amount</h3>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleAmount}
                min="0"
                step="0.01"
              />
              {amountError && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    color: "var(--accent-danger)",
                    fontSize: "0.85rem",
                  }}
                >
                  {amountError}
                </p>
              )}
            </div>
            <div className="DepositContentLeftDown">
              <h3>Choose Payment Method from the list below</h3>
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  {method.isExpandable ? (
                    <>
                      <div
                        className={`DepositContentLeftDownInput expandable ${expandedMethod === method.route ? "expanded" : ""}`}
                        onClick={() => toggleExpand(method.route)}
                      >
                        <span style={{ flex: 1 }}>{method.name}</span>
                        <span className="expand-icon">
                          {expandedMethod === method.route ? "▼" : "▶"}
                        </span>
                      </div>

                      {/* Show networks if this is the wallet option and it's expanded */}
                      {expandedMethod === method.route && (
                        <div className="DepositNetworkOptions">
                          {method.networks.map((network) => (
                            <label
                              className="DepositNetworkOption"
                              key={network.id}
                            >
                              <span>{network.name}</span>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={network.route}
                                checked={
                                  selectedPaymentMethod === network.route
                                }
                                onChange={() =>
                                  handleNetworkSelect(network.route)
                                }
                              />
                            </label>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="DepositContentLeftDownInput">
                      <span style={{ flex: 1 }}>{method.name}</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.route}
                        checked={selectedPaymentMethod === method.route}
                        onChange={() => handlePaymentMethodChange(method.route)}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button disabled={isButtonDisabled} onClick={submitPayment}>
                Proceed to payment
              </button>
            </div>
          </div>
          <div className="DepositContentRight">
            <div className="DepositContentRightA">
              <h4>Total Deposit</h4>
              <h4 className="DepositContentRightABreak">
                ${amount || "0.00"} <span>Amount</span>
              </h4>
            </div>
            <div className="DepositContentRightB">
              <p>View deposit history</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
        />
      </div>
    </>
  );
};

export default Deposit;
