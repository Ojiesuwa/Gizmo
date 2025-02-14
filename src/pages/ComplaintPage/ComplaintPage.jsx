import React, { useEffect, useState } from "react";
import "./ComplaintPage.css";
import AllComplaints from "../../components/AllComplaints/AllComplaints";
import { toast } from "react-toastify";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";
import { fetchUserComplaint, makeComplaint } from "../../controllers/complaint";
import { formatDate } from "../../utils/date";

const ComplaintPage = () => {
  const { userCredential, accountDetail } = useAuth() || {};
  const [text, setText] = useState("");
  const [userComplaint, setUserComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleMakeComplaint = async () => {
    try {
      if (!userCredential) return;
      setIsLoading(true);
      await makeComplaint(
        text,
        userCredential?.uid,
        accountDetail?.firstname,
        accountDetail?.lastname,
        accountDetail?.email
      );
      toast.success("Your complaint has been recorded");
      setText("");
      fetchUpdateUserComplaint();
    } catch (error) {
      console.error(error);
      toast.error("Error uploading complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdateUserComplaint = async () => {
    try {
      const cmp = await fetchUserComplaint(userCredential?.uid);
      setUserComplaint(cmp);
    } catch (error) {
      console.error(error);
      toast.error("Can't load your complaint");
    }
  };

  useEffect(() => {
    if (!userCredential) return;
    fetchUpdateUserComplaint();
  }, [userCredential]);
  return (
    <div className="ComplaintPage fade">
      <p className="big-text">Got a Complaint? Let’s Fix It!</p>
      <p className="small-text">
        At Gizmo, we prioritize your experience. If you encounter any
        problems—technical glitches, quiz discrepancies, or billing
        questions—please inform us. Your feedback is crucial for our
        improvement. Provide details, and our support team will respond
        promptly.
      </p>
      <textarea
        name=""
        id=""
        placeholder="Enter complaint here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <Button
        text={"Lodge Complaint"}
        isLoading={isLoading}
        loadingText={"Uploading Complaint"}
        onClick={handleMakeComplaint}
        disabled={!text}
      />
      <div className="line"></div>
      <p className="heading-4">Complaints</p>
      <div className="complaint-container">
        {userComplaint?.map((data, index) => (
          <ComplaintItem data={data} key={index} />
        ))}
      </div>
      {accountDetail?.root && window.innerWidth > 800 && <AllComplaints />}
    </div>
  );
};

export default ComplaintPage;

const ComplaintItem = ({ data }) => {
  return (
    <div className="complaint-item">
      <div className="date-cont">
        <i className="fa-light fa-calendar-days"></i>
        <p>{formatDate(data?.createdAt?.seconds)}</p>
      </div>
      <div className="message-cont">
        <p>{data?.complaint}</p>
      </div>
      <div className="response-cont">
        <b className="">Response</b>

        <p>{data?.response || "We will respond soon..."}</p>
      </div>
    </div>
  );
};
