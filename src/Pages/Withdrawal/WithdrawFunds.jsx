import "./WithdrawFunds.css";
import { IoMdMail } from "react-icons/io";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { swiftUserData } from "../../Components/store/FeaturesSlice";
import Modal from "../../Components/Modal/Modal";
import formatAmount from "../../utils/formatAmount";

const WithdrawFunds = () => {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [withdrawCodes, setWithdrawCodes] = useState("");
  const [withdrawCodesError, setWithdrawCodesError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressError, setWalletAddressError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [clickMe, setClickMe] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const userData = useSelector((state) => state.persisitedReducer.user);
  const id = userData?._id || "";
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    axios
      .get(
        `https://mynewbrokerezebackend.onrender.com/api/users/userdata/${id}`,
      )
      .then((res) => {
        const fresh = res.data?.data || res.data;
        dispatch(swiftUserData(fresh));
      })
      .catch(() => {});
  }, [id]);

  // Define withdrawal methods (same as deposit)
  const withdrawalMethods = [
    {
      id: "wallet",
      name: "Crypto Wallet",
      route: "WALLET",
      isExpandable: true,
      networks: [
        { id: "btc", name: "Bitcoin (BTC)", route: "BTC" },
        { id: "eth", name: "Ethereum (ETH)", route: "ETH" },
        { id: "usdt-erc20", name: "USDT (ERC20)", route: "USDT-ERC20" },
        { id: "usdt-trc20", name: "USDT (TRC20)", route: "USDT-TRC20" },
        { id: "usdt-bep20", name: "USDT (BEP20)", route: "USDT-BEP20" },
        { id: "bnb", name: "Binance Coin (BNB)", route: "BNB" },
        { id: "sol", name: "Solana (SOL)", route: "SOL" },
        { id: "xrp", name: "Ripple (XRP)", route: "XRP" },
        { id: "trx", name: "Tron (TRX)", route: "TRX" },
      ],
    },
    { id: "cashapp", name: "Cash App", route: "CASHAPP" },
    { id: "paypal", name: "PayPal", route: "PAYPAL" },
    { id: "bank", name: "Bank Transfer", route: "BANK" },
  ];

  const url = `https://mynewbrokerezebackend.onrender.com/api/users/requestwithdrawcode/${id}`;
  const urlll = `https://mynewbrokerezebackend.onrender.com/api/withdrawals/withdraw/${id}`;

  const handleAmount = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    setAmountError("");
  };

  const handleWithdrawCodes = (e) => {
    const newCode = e.target.value;
    setWithdrawCodes(newCode);

    if (newCode.trim() === "") {
      setWithdrawCodesError("OTP is required");
    } else {
      setWithdrawCodesError("");
    }
  };

  const handleWalletAddress = (e) => {
    const newAddress = e.target.value;
    setWalletAddress(newAddress);

    if (newAddress.trim() === "") {
      setWalletAddressError("Wallet address is required");
    } else {
      setWalletAddressError("");
    }
  };

  const toggleExpand = useCallback((methodRoute) => {
    setExpandedMethod((prev) => (prev === methodRoute ? null : methodRoute));
  }, []);

  const handlePaymentMethodChange = useCallback((methodRoute) => {
    setSelectedPaymentMethod(methodRoute);
  }, []);

  const handleNetworkSelect = useCallback((networkRoute) => {
    setSelectedPaymentMethod(networkRoute);
  }, []);

  const sendWithdrawcode = () => {
    setButtonDisabled(true);
    axios
      .post(url)
      .then((res) => {
        console.log(res);
        setIsOTPRequested(true);
        setModalConfig({
          type: "success",
          title: "OTP Sent Successfully",
          message:
            "An OTP has been sent to your email. Please check your inbox.",
        });
        setShowModal(true);
        setButtonDisabled(false);
      })
      .catch((err) => {
        setButtonDisabled(false);
        console.log(err);
        setModalConfig({
          type: "error",
          title: "Failed to Send OTP",
          message: "Unable to send OTP. Please try again later.",
        });
        setShowModal(true);
      });
  };

  const sendWallet = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(userData?.accountBalance)) {
      setModalConfig({
        type: "error",
        title: "Insufficient Balance",
        message: `Your available balance is $${formatAmount(userData?.accountBalance)}. Please enter a lower amount.`,
      });
      setShowModal(true);
      return;
    }

    if (!withdrawCodes) {
      setWithdrawCodesError("Please enter OTP");
      return;
    }

    if (!selectedPaymentMethod) {
      setModalConfig({
        type: "error",
        title: "Payment Method Required",
        message: "Please select a withdrawal method to continue.",
      });
      setShowModal(true);
      return;
    }

    if (!walletAddress) {
      setWalletAddressError("Please enter your wallet address/details");
      return;
    }

    // Send withdrawal request directly without additional verification modal
    const payload = {
      walletAddress,
      amount,
      coin: selectedPaymentMethod,
      withdrawCode: withdrawCodes,
    };

    setClickMe(true);
    axios
      .post(urlll, payload)
      .then((res) => {
        console.log("this is it", res);
        setClickMe(false);
        setModalConfig({
          type: "success",
          title: "Withdrawal Request Submitted",
          message:
            res.data.message ||
            "Your withdrawal request has been submitted successfully. It will be processed within 24-48 hours.",
        });
        setShowModal(true);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setClickMe(false);
        console.log(err);
        setModalConfig({
          type: "error",
          title: "Withdrawal Failed",
          message:
            err.response?.data?.message ||
            "Withdrawal request failed. Please try again or contact support.",
        });
        setShowModal(true);
      });
  };

  const getPlaceholderText = () => {
    if (!selectedPaymentMethod) return "Select a payment method first";

    if (selectedPaymentMethod === "BANK") {
      return "Enter: Bank Name | Account Number | Routing Number";
    } else if (selectedPaymentMethod === "CASHAPP") {
      return "Enter your Cash App tag (e.g., $YourTag)";
    } else if (selectedPaymentMethod === "PAYPAL") {
      return "Enter your PayPal email address";
    } else {
      return `Enter your ${selectedPaymentMethod} wallet address`;
    }
  };

  return (
    <>
      <div className="WithdrawFundsBody">
        <h1>Withdraw Funds</h1>
        <div className="WithdrawFundsContent">
          <div className="WithdrawFundsLeft">
            {/* Amount Input */}
            <div className="WithdrawFundsBox">
              <h3>Enter Amount to Withdraw</h3>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleAmount}
                min="0"
                step="0.01"
              />
              {amountError && <p className="error-text">{amountError}</p>}
              <p className="info-text">
                Available Balance: ${formatAmount(userData?.accountBalance)}
              </p>
            </div>

            {/* OTP Section */}
            <div className="WithdrawFundsBox">
              <div className="WithdrawOTPHeader">
                <h3>Enter OTP</h3>
                <button
                  onClick={sendWithdrawcode}
                  disabled={isButtonDisabled}
                  className="otp-button"
                >
                  <IoMdMail />
                  {isButtonDisabled ? "Sending..." : "Request OTP"}
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={withdrawCodes}
                onChange={handleWithdrawCodes}
              />
              {withdrawCodesError && (
                <p className="error-text">{withdrawCodesError}</p>
              )}
              <p className="info-text">
                OTP will be sent to your email: {userData?.email}
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="WithdrawFundsBox">
              <h3>Choose Withdrawal Method</h3>
              <div className="WithdrawMethodsList">
                {withdrawalMethods.map((method) => (
                  <div key={method.id}>
                    {method.isExpandable ? (
                      <>
                        <div
                          className={`WithdrawMethodItem expandable ${expandedMethod === method.route ? "expanded" : ""}`}
                          onClick={() => toggleExpand(method.route)}
                        >
                          <span style={{ flex: 1 }}>{method.name}</span>
                          <span className="expand-icon">
                            {expandedMethod === method.route ? "▼" : "▶"}
                          </span>
                        </div>

                        {/* Show networks if this is the wallet option and it's expanded */}
                        {expandedMethod === method.route && (
                          <div className="WithdrawNetworkOptions">
                            {method.networks.map((network) => (
                              <label
                                className="WithdrawNetworkOption"
                                key={network.id}
                              >
                                <span>{network.name}</span>
                                <input
                                  type="radio"
                                  name="withdrawalMethod"
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
                      <div className="WithdrawMethodItem">
                        <span style={{ flex: 1 }}>{method.name}</span>
                        <input
                          type="radio"
                          name="withdrawalMethod"
                          value={method.route}
                          checked={selectedPaymentMethod === method.route}
                          onChange={() =>
                            handlePaymentMethodChange(method.route)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Address Input */}
            {selectedPaymentMethod && (
              <div className="WithdrawFundsBox">
                <h3>
                  Enter{" "}
                  {selectedPaymentMethod === "BANK"
                    ? "Bank"
                    : selectedPaymentMethod === "CASHAPP"
                      ? "Cash App"
                      : selectedPaymentMethod === "PAYPAL"
                        ? "PayPal"
                        : "Wallet"}{" "}
                  Details
                </h3>
                <textarea
                  placeholder={getPlaceholderText()}
                  value={walletAddress}
                  onChange={handleWalletAddress}
                  rows={selectedPaymentMethod === "BANK" ? 4 : 2}
                />
                {walletAddressError && (
                  <p className="error-text">{walletAddressError}</p>
                )}
                <p className="info-text">
                  {selectedPaymentMethod === "BANK"
                    ? "Enter your bank details in the format: Bank Name | Account Number | Routing Number"
                    : `Please enter the correct ${selectedPaymentMethod} address to receive your funds`}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="WithdrawFundsBox">
              <button
                onClick={sendWallet}
                disabled={clickMe}
                className="submit-button"
              >
                {clickMe ? "Processing..." : "Complete Withdrawal Request"}
              </button>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="WithdrawFundsRight">
            <div className="WithdrawSummaryCard">
              <h4>Withdrawal Summary</h4>
              <div className="summary-item">
                <span>Amount:</span>
                <strong>${amount || "0.00"}</strong>
              </div>
              <div className="summary-item">
                <span>Method:</span>
                <strong>{selectedPaymentMethod || "Not selected"}</strong>
              </div>
              <div className="summary-item">
                <span>Available Balance:</span>
                <strong>${formatAmount(userData?.accountBalance)}</strong>
              </div>
            </div>

            <div className="WithdrawInfoCard">
              <h4>Important Information</h4>
              <ul>
                <li>Withdrawals are processed within 24-48 hours</li>
                <li>Minimum withdrawal amount is $10</li>
                <li>Ensure your wallet address is correct</li>
                <li>OTP is required for security verification</li>
                <li>Identity verification (SSN & Driver's License) required</li>
                <li>Contact support if you need assistance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modals */}
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

export default WithdrawFunds;
