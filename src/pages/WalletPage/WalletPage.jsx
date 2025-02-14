import React, { useState } from "react";
import "./WalletPage.css";
import { toast } from "react-toastify";
import { fundAccountWallet } from "../../controllers/account";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/Button/Button";

const WalletPage = () => {
  // Hooks
  const { userCredential, accountDetail } = useAuth();

  // States
  const [amount, setAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  // Functions
  const handleFundAccount = async (params) => {
    try {
      if (!amount || amount < 1000) return;
      if (!userCredential) return;

      setIsLoading(true);
      await fundAccountWallet(userCredential?.uid, amount);
      toast.success("Wallet succesfully funded!");
    } catch (error) {
      console.error(error);
      toast.error("Error funding wallet");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="WalletPage fade">
      <p className="big-text">We are glad</p>
      <p className="big-text">Gizmo is serving you well</p>
      <div className="bill-cont">
        <i className="fa-light fa-money-bill"></i>
        <p>N {accountDetail?.wallet.toLocaleString("fr-FR")}</p>
      </div>
      <div className="line"></div>
      <p className="small-text">
        Fund your wallet now to generate quizzes, access premium features, and
        enhance your study experience.
        <br />
        Don't miss out—top up and keep learning! 💡📚
      </p>

      <input
        type="number"
        min={1000}
        placeholder="Amount"
        value={amount}
        onChange={(e) => {
          let value = parseInt(e.target.value);
          // value = isNaN(value) ? 0 : value;
          setAmount(value);
        }}
        title="Minimum amount is N 1000"
      />
      <Button
        disabled={parseInt(isNaN(amount) ? 0 : amount) < 1000}
        onClick={handleFundAccount}
        text={"Fund Wallet"}
        isLoading={isLoading}
        loadingText={"Funding wallet"}
      />
    </div>
  );
};

export default WalletPage;
