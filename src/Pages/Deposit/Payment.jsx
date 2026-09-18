import { FaCopy, FaWallet, FaUniversity } from "react-icons/fa";
import { SiCashapp, SiPaypal, SiBitcoin } from "react-icons/si";
import "./Payment.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateDepositData } from "../../Components/store/FeaturesSlice";
import Modal from "../../Components/Modal/Modal";
import { QRCodeSVG } from "qrcode.react";

const Payment = () => {
  const { paymentname } = useParams();
  const reduxUser = useSelector((state) => state.persisitedReducer.user);
  const id =
    reduxUser?._id || reduxUser?.id || localStorage.getItem("UserId") || "";
  const [pay, setpay] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (!id) {
      console.warn("Payment page: user id not found in Redux or localStorage.");
    }
  }, [id]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const amount = JSON.parse(localStorage.getItem("amount"));

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const nav = useNavigate();
  const dispatch = useDispatch();

  // Payment method configurations - UPDATE YOUR ADDRESSES HERE
  const paymentConfig = {
    BTC: {
      name: "Bitcoin (BTC)",
      icon: <SiBitcoin />,
      address: "bc1qh6z44fxnzkf2prafkrpa9p5z466mps0ysa5xs6",
      network: "Bitcoin Network",
      instructions: [
        "Copy the Bitcoin address below",
        "Open your Bitcoin wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 10-30 minutes)",
      ],
    },
    ETH: {
      name: "Ethereum (ETH)",
      icon: <SiBitcoin />,
      address: "0xC5880448eBc28fC815Ff5dB6A41e738F96B9BD77",
      network: "Ethereum Network (ERC20)",
      instructions: [
        "Copy the Ethereum address below",
        "Open your Ethereum wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 2-5 minutes)",
      ],
    },
    "USDT-BEP20": {
      name: "USDT (BEP20)",
      icon: <SiBitcoin />,
      address: "0xc8721251910E101187b8A1993423898AbAF7da28",
      network: "Binance Smart Chain (BEP20)",
      instructions: [
        "Copy the USDT address below",
        "Open your wallet and select USDT (BEP20)",
        "Only send USDT BEP20 to this address. Other assets will be lost forever",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 2-5 minutes)",
      ],
    },
    "USDT-ERC20": {
      name: "USDT (ERC20)",
      icon: <SiBitcoin />,
      address: "0x34a60936ce5918288ad413de68a7160975d43ff4",
      network: "Ethereum Network (ERC20)",
      instructions: [
        "Copy the USDT address below",
        "Open your wallet and select USDT (ERC20)",
        "Only send USDT ERC20 assist to this address. Other assets will be lost forever",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 2-5 minutes)",
      ],
    },
    "USDT-TRC20": {
      name: "USDT (TRC20)",
      icon: <SiBitcoin />,
      address: "TCyHCyhm8qEJUq1GTbtpT7D8zjcvSTu8xh",
      network: "Tron Network (TRC20)",
      instructions: [
        "Copy the USDT address below",
        "Open your wallet and select USDT (TRC20)",
        "Only send USDT Tether (TRC20) assist to this address. Other assets will be lost forever",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 1-3 minutes)",
      ],
    },
    DOGE: {
      name: "Dogecoin (DOGE)",
      icon: <SiBitcoin />,
      address: "DBWTRiVdbYvdbZyfEDGyeLYssxY6QF78rV",
      network: "Dogecoin Network",
      instructions: [
        "Copy the Dogecoin address below",
        "Open your Dogecoin wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 1-3 minutes)",
      ],
    },
    BNB: {
      name: "Binance Coin (BNB)",
      icon: <SiBitcoin />,
      address: "0xc8721251910E101187b8A1993423898AbAF7da28",
      network: "Binance Smart Chain (BEP20)",
      instructions: [
        "Copy the BNB address below",
        "Open your Binance or BNB wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 1-3 minutes)",
      ],
    },
    SOL: {
      name: "Solana (SOL)",
      icon: <SiBitcoin />,
      address: "AmhntfrMECUuLqT2jCUVLiHHeaM2hQ4RYVB5W6b96KnV",
      network: "Solana Network",
      instructions: [
        "Copy the Solana address below",
        "Open your Solana wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 30 seconds - 2 minutes)",
      ],
    },
    XRP: {
      name: "Ripple (XRP)",
      icon: <SiBitcoin />,
      address: "rPPrVNpbSvAp9io9RFCvkU2PqRNFTa7JTB",
      network: "Ripple Network",
      instructions: [
        "Copy the XRP address below",
        "Open your XRP wallet",
        "Send the exact amount to the address",
        "Include the destination tag if required",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 3-5 seconds)",
      ],
    },
    TRX: {
      name: "Tron (TRX)",
      icon: <SiBitcoin />,
      address: "TYourTronWalletAddress",
      network: "Tron Network (TRC20)",
      instructions: [
        "Copy the Tron address below",
        "Open your Tron wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 1-3 minutes)",
      ],
    },
    LTC: {
      name: "Litecoin (LTC)",
      icon: <SiBitcoin />,
      address: "ltc1q30hh254nh07kf43evekm0njmksr30gzsuste0x",
      network: "Litecoin Network",
      instructions: [
        "Copy the Litecoin address below",
        "Open your Litecoin wallet",
        "Send the exact amount to the address",
        "Upload payment proof after transaction",
        "Wait for confirmation (usually 1-3 minutes)",
      ],
    },
    CASHAPP: {
      name: "Cash App",
      icon: <SiCashapp />,
      address: "$YourCashAppTag",
      network: "Cash App",
      instructions: [
        "Copy the Cash App tag below",
        "Open your Cash App",
        "Send the exact amount to the tag",
        "Upload payment screenshot",
        "Payment will be confirmed within 5-10 minutes",
      ],
    },
    PAYPAL: {
      name: "PayPal",
      icon: <SiPaypal />,
      address: "your-email@example.com",
      network: "PayPal",
      instructions: [
        "Copy the PayPal email below",
        "Open your PayPal account",
        "Send money to the email address",
        "Upload payment confirmation",
        "Payment will be verified within 10-15 minutes",
      ],
    },
    BANK: {
      name: "Bank Transfer",
      icon: <FaUniversity />,
      address:
        "Account: 1234567890 | Bank: Your Bank Name | Routing: 123456789",
      network: "Bank Transfer",
      instructions: [
        "Use the bank details below",
        "Make a transfer from your bank",
        "Include your user ID in the reference",
        "Upload transfer receipt",
        "Bank transfers may take 1-3 business days",
      ],
    },
  };

  const selectedPayment = paymentname?.toUpperCase();
  const currentPayment = paymentConfig[selectedPayment] || paymentConfig.BTC;

  const depositDatas = {
    amount: amount,
    paymentMode: selectedPayment,
    status: "pending",
    dateCreated: new Date().toDateString(),
  };

  const [state, setState] = useState({
    value: currentPayment.address,
    copied: false,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log("File uploaded:", file.name);
    }
  };

  const url = `https://mynew-broker-eze-back-end.vercel.app/api/auth/sendpayment/${id}`;
  const url2 = `https://mynew-broker-eze-back-end.vercel.app/api/deposits/deposit/${id}`;

  const data = {
    amount: amount,
  };

  const data2 = {
    amount: amount,
    coin: selectedPayment,
  };

  const SendPaymentToAdmin = () => {
    axios
      .post(url2, data2)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const payNow = () => {
    if (!uploadedFile) {
      setModalConfig({
        type: "error",
        title: "Payment Proof Required",
        message: "Please upload payment proof before submitting.",
      });
      setShowModal(true);
      return;
    }

    setButtonDisabled(true);
    axios
      .post(url, data)
      .then((res) => {
        SendPaymentToAdmin();
        console.log(res);
        setpay(true);
        setModalConfig({
          type: "success",
          title: "Payment Submitted Successfully!",
          message:
            "Your deposit is being processed. You will be notified once it's confirmed.",
        });
        setShowModal(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          nav("/dashboard");
          dispatch(updateDepositData(depositDatas));
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setButtonDisabled(false);
        setModalConfig({
          type: "error",
          title: "Payment Submission Failed",
          message:
            "Unable to submit payment. Please try again or contact support.",
        });
        setShowModal(true);
      });
  };

  return (
    <>
      <div className="PaymentBody">
        <div className="PaymentContainer">
          <div className="PaymentHeader">
            <h1>Complete Your Payment</h1>
            <p>Follow the instructions below to complete your deposit</p>
          </div>

          <div className="PaymentContent">
            <div className="PaymentMethodInfo">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {currentPayment.icon}
              </div>
              <h3>{currentPayment.name}</h3>
              <p>Selected Payment Method</p>
            </div>

            <div className="PaymentAmountCard">
              <h4>Amount to Deposit</h4>
              <h2>${amount}</h2>
            </div>

            <div className="PaymentWalletSection">
              <h3>Payment Details</h3>
              <div className="PaymentQRCode">
                <QRCodeSVG
                  value={currentPayment.address}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.5rem",
                  }}
                >
                  Scan to get address
                </p>
              </div>
              <div className="PaymentWalletAddress">
                <input type="text" value={state.value} readOnly />
                <CopyToClipboard
                  text={state.value}
                  onCopy={() => {
                    setState({ ...state, copied: true });
                    setTimeout(
                      () => setState({ ...state, copied: false }),
                      2000,
                    );
                  }}
                >
                  <button>
                    <FaCopy /> {state.copied ? "Copied!" : "Copy"}
                  </button>
                </CopyToClipboard>
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.5rem",
                }}
              >
                Network Type:{" "}
                <span style={{ fontWeight: "600" }}>
                  {currentPayment.network}
                </span>
              </p>
            </div>

            <div className="PaymentInstructions">
              <h4>Payment Instructions</h4>
              <ol>
                {currentPayment.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="PaymentUploadSection">
              <h3>Upload Payment Proof</h3>
              <label htmlFor="file-upload" className="PaymentUploadBox">
                <FaWallet style={{ fontSize: "3rem" }} />
                <p>
                  {uploadedFile
                    ? `Selected: ${uploadedFile.name}`
                    : "Click to upload payment proof"}
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Supported formats: JPG, PNG, PDF (Max 5MB)
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <div className="PaymentActions">
              <button
                className="secondary"
                onClick={() => nav("/dashboard")}
                disabled={isButtonDisabled}
              >
                Cancel
              </button>
              <button onClick={payNow} disabled={isButtonDisabled}>
                {isButtonDisabled ? "Submitting..." : "Submit Payment"}
              </button>
            </div>

            <div className="PaymentWarning">
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <p>
                Please ensure you send the exact amount to avoid delays in
                processing. Your deposit will be credited after verification
                (usually within 10-30 minutes).
              </p>
            </div>
          </div>
        </div>

        {pay && (
          <div className="SuccessPaid">
            <div className="PayCon">
              <h3>Payment Submitted Successfully!</h3>
              <p
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Your deposit is being processed. You will be notified once it's
                confirmed.
              </p>
              <button
                onClick={() => {
                  setpay(false);
                  nav("/dashboard");
                  dispatch(updateDepositData(depositDatas));
                }}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            if (modalConfig.type === "success") {
              nav("/dashboard");
              dispatch(updateDepositData(depositDatas));
            }
          }}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
        />
      </div>
    </>
  );
};

export default Payment;
