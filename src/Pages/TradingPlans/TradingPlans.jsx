import { FaHandHoldingDollar } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa";
import "./TradingPlans.css";
import { IoWalletOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import {addPlans} from "../../Components/store/FeaturesSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import formatAmount from "../../utils/formatAmount";
// import {toast} from "react-hot-toast";

const TradingPlans = () => {
  const { id } = useParams();
  const userId = id;
  const [showSelect, setShowSelect] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  console.log("namebe", userId);
  const [planPrice, setPlanPrice] = useState(0);
  // const [boxPrice, setBoxPrice] = useState(0);
  const dispatch = useDispatch();

  const nav = useNavigate();
  const userData = useSelector((state) => state.persisitedReducer.user);
  // const allPlans = useSelector((state) => state.persisitedReducer.plans);
  console.log("mal", selectedPackage?._id);

  const handleShowSelect = () => {
    setShowSelect(!showSelect);
  };

  const [disabledBtn, setDisabledBtn] = useState(true);
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);

  // const calculateEndDate = (startDate, duration) => {
  //     const endDate = new Date(startDate);
  //     endDate.setDate(endDate.getDate() + duration);
  //     return endDate;
  // };

  // const formatDate = (date) => {
  //     const options = {
  //         weekday: "short",
  //         month: "short",
  //         day: "numeric",
  //         year: "numeric",
  //         hour: "numeric",
  //         minute: "numeric",
  //         hour12: true,
  //     };
  //     return new Date(date).toLocaleString("en-US", options);
  // };

  // const packageDatas = [
  //     {
  //         name: "Starter plan",
  //         duration: 7,
  //         price: "9,999",
  //         minimumDeposit: "3,000",
  //         maximunDeposit: "9,999",
  //         minimumReturn: "325",
  //         maximumReturn: "325",
  //         packageId:
  //             "STARTER" + Math.floor(1000000000 + Math.random() * 9000000000),
  //         profit: 0,
  //         selected: true,
  //         currentInvAmt: planPrice,
  //         startDate: formatDate(new Date()), // Start date is set to current date
  //         endDate: formatDate(calculateEndDate(new Date(), 7)), // Calculate end date dynamically
  //     },
  //     {
  //         name: "Silver Plan",
  //         duration: 14,
  //         price: "29,999",
  //         minimumDeposit: "10,000",
  //         maximunDeposit: "29,999",
  //         minimumReturn: "325",
  //         maximumReturn: "325",
  //         packageId:
  //             "SILVER" + Math.floor(1000000000 + Math.random() * 9000000000),
  //         profit: 0,
  //         currentInvAmt: planPrice,
  //         selected: true,
  //         startDate: formatDate(new Date()), // Start date is set to current date
  //         endDate: formatDate(calculateEndDate(new Date(), 14)), // Calculate end date dynamically
  //     },
  //     {
  //         name: "Gold Plan",
  //         duration: 28,
  //         price: "1,000,000",
  //         minimumDeposit: "30,000",
  //         maximunDeposit: "99,999",
  //         minimumReturn: "325",
  //         maximumReturn: "325",
  //         packageId:
  //             "GOLD" + Math.floor(1000000000 + Math.random() * 9000000000),
  //         profit: 0,
  //         currentInvAmt: planPrice,
  //         selected: true,
  //         startDate: formatDate(new Date()),
  //         endDate: formatDate(calculateEndDate(new Date(), 28)),
  //     },
  //     {
  //         name: "Platinum Plan",
  //         duration: 168,
  //         price: "99,999",
  //         minimumDeposit: "100,000",
  //         maximunDeposit: "1,000,000",
  //         minimumReturn: "325",
  //         maximumReturn: "325",
  //         packageId:
  //             "PLATINUM" + Math.floor(1000000000 + Math.random() * 9000000000),
  //         profit: 0,
  //         currentInvAmt: planPrice,
  //         selected: true,
  //         startDate: formatDate(new Date()),
  //         endDate: formatDate(calculateEndDate(new Date(), 168)),
  //     },
  // ];
  const [userPlane, setUserPlane] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const getallPlan = async () => {
    try {
      const response = await axios.get(
        "https://mynewbrokerezebackend.onrender.com/api/plans/getallplan",
      );
      setUserPlane(
        Array.isArray(response.data?.data) ? response.data.data : [],
      );
      setPlansError("");
    } catch (error) {
      console.error("Failed to load investment plans:", error);
      setPlansError("Unable to load investment plans. Please try again.");
    } finally {
      setPlansLoading(false);
    }
  };

  const filterPlans = (userPlane) => {
    userPlane.filter((item) => {
      if (item.userPlane === item.userPlane.toUpperCase()) {
        console.log("item", item);
        return item;
      }
    });
  };

  useEffect(() => {
    getallPlan();
  }, []);

  const validateSubmit = () => {
    if (planPrice > parseInt(userData.accountBalance)) {
      setDisabledBtn(true);
      setInfo("Insufficient fund");
      setError(true);
    } else {
      setDisabledBtn(false);
      setInfo("");
      setError(false);
    }
  };

  useEffect(() => {
    validateSubmit();
  }, []);

  const data = {
    planId: selectedPackage?._id,
    amount: planPrice,
  };

  const [show, setShow] = useState({ err: false, msg: "" });
  const [clickme, setClickMe] = useState(false);

  const reload = () => {
    setShow(false);
    window.location.reload();
    console.log("mememem");
  };

  const checkAmount = () => {
    setClickMe(true);
    console.log(data);
    const url = `https://mynewbrokerezebackend.onrender.com/api/invest/${userId}`;
    axios
      .post(url, data)
      .then((response) => {
        console.log(response.data.message);
        setShow({ err: true, msg: response.data.message });
        // toast.success(response.data.message);
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        setClickMe(false);
        setShow({ err: true, msg: error.response.data.message });
      });
  };

  const updatePlanPrice = (value) => {
    setPlanPrice(value);
    setSelectedPackage((prevPackage) => ({
      ...prevPackage,
      currentInvAmt: value,
    }));
  };

  return (
    <>
      <div className="TradingPlansBody">
        <h1>Get started with your investment</h1>
        <div className="TradingPlansContent">
          <div className="TradingPlansLeft">
            <div className="TradingPlansLeftBoxA">
              <div
                className="TradingPlansLeftBoxAMain"
                onClick={handleShowSelect}
              >
                <h3>
                  <span>
                    <FaHandHoldingDollar />
                  </span>
                  {selectedPackage !== null
                    ? `${selectedPackage.planName}`
                    : "SELECT PACKAGE"}
                </h3>
                <p className={`Angle ${showSelect ? "active" : ""}`}>
                  <FaAngleDown />
                </p>
              </div>
              <div
                className={`TradingPlansLeftBoxADrop ${
                  showSelect ? "active" : ""
                }`}
              >
                {plansLoading ? (
                  "Loading..."
                ) : plansError ? (
                  <p role="alert">{plansError}</p>
                ) : userPlane.length === 0 ? (
                  <p>No investment plans are available right now.</p>
                ) : (
                  <>
                    {userPlane
                      ?.filter((item) => {
                        // If user has notification true, show all plans
                        if (userData?.notification) return true;
                        // Otherwise, show only plans with capital letter names
                        return item.planName === item.planName.toUpperCase();
                      })
                      .map((item, index) => (
                        <div
                          key={index}
                          className="TradingPlansLeftBoxADropItem"
                          onClick={() => {
                            handleShowSelect();
                            setSelectedPackage(item);
                          }}
                        >
                          <h3 style={{ textTransform: "uppercase" }}>
                            <span>
                              <FaHandHoldingDollar />
                            </span>
                            {item.planName}
                          </h3>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>
            <div className="TradingPlansLeftBoxC">
              <p>Enter Your Amount</p>
              <input
                type="text"
                min={0}
                placeholder="0"
                // value={planPrice}
                onChange={(e) => updatePlanPrice(e.target.value)}
              />
            </div>
            <div className="TradingPlansLeftBoxD">
              <p>
                Available balance{" "}
                <span style={{ color: "red" }}>{error ? `${info}` : null}</span>
              </p>
              <div className="TradingPlansLeftBoxDDiv">
                <div className="TradingPlansLeftBoxDItem">
                  <IoWalletOutline className="IoWalletOutline" />
                  <p>
                    Account Balance{" "}
                    <span>${formatAmount(userData?.accountBalance)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="TradingPlansRight">
            <h3>Your Investment Details</h3>
            <div className="TradingPlansRightBox">
              {selectedPackage && (
                <>
                  <div className="TradingPlansRightBoxRow1">
                    <div className="TradingPlansRightBoxRow1L">
                      <h5>Name of plan</h5>
                      <p>{selectedPackage.planName}</p>
                    </div>
                    <div className="TradingPlansRightBoxRow1R">
                      <h5>Plan Price</h5>
                      <p>$ {selectedPackage.maximumDeposit}</p>
                    </div>
                  </div>
                  {/* <div className="TradingPlansRightBoxRow1">
                                <div className="TradingPlansRightBoxRow1L">
                                    <h5>Duration</h5>
                                    <p>{selectedPackage.duration} Days</p>
                                </div>
                                <div className="TradingPlansRightBoxRow1R">
                                    <h5>Profit</h5>
                                    <p>{selectedPackage.profit}% Daily</p>
                                </div>
                            </div> */}
                  <div className="TradingPlansRightBoxRow1">
                    <div className="TradingPlansRightBoxRow1L">
                      <h5>Minimum Deposit</h5>
                      <p>${selectedPackage.minimumDeposit}</p>
                    </div>
                    <div className="TradingPlansRightBoxRow1R">
                      <h5>Maximum Deposit</h5>
                      <p>${selectedPackage.maximumDeposit}</p>
                    </div>
                  </div>
                  <div className="TradingPlansRightBoxRow1">
                    <div className="TradingPlansRightBoxRow1L">
                      <h5>Interest</h5>
                      <p>{selectedPackage.percentageInterest}%</p>
                    </div>
                    <div className="TradingPlansRightBoxRow1L">
                      <h5>Duration</h5>
                      <p>{selectedPackage.durationDays} Days</p>
                    </div>
                  </div>
                  {/* <div className="TradingPlansRightBoxRow2">
                                        <div className="TradingPlansRightBoxRow1L">
                                            <h5>Duration</h5>
                                            <p>
                                                {selectedPackage.durationDays} Days
                                            </p>
                                        </div>
                                    </div> */}
                </>
              )}
            </div>
            <div className="TradingPlansRightBoxPay">
              <div className="TradingPlansRightBoxPayTop">
                <p>
                  Payment method: <span>Account Balance</span>
                </p>
              </div>
              <div className="TradingPlansRightBoxPayDown">
                <p>
                  Amount to invest: <span>${planPrice}</span>
                </p>
                <button onClick={checkAmount} disabled={disabledBtn}>
                  {clickme ? "Loading..." : "Confirm & Invest"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {show.err === true ? (
          <div className="SuccessPaid">
            <div className="PayCon">
              <h3>{show.msg} </h3>

              {show.msg === "plan not found" ||
              show.msg ===
                `Amount must be between ${selectedPackage.minimumDeposit} and ${selectedPackage.maximumDeposit}` ? (
                <button
                  style={{
                    width: "50%",
                    height: "40px",
                    background: "#d0d0d0",
                    border: "none",
                    color: "#181818",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    setShow(false);
                    nav(`/${id}`);
                  }}
                >
                  close
                </button>
              ) : (
                <button
                  onClick={reload}
                  style={{
                    width: "50%",
                    height: "40px",
                    background: "#d0d0d0",
                    border: "none",
                    color: "#181818",
                    fontSize: "15px",
                  }}
                >
                  ok
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default TradingPlans;
