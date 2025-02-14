import React, { useEffect, useState } from "react";
import "./AllComplaints.css";
import { toast } from "react-toastify";
import {
  fetchAllComplaints,
  respondToComplaint,
} from "../../controllers/complaint";
import { formatDate } from "../../utils/date";
import Button from "../Button/Button";
const AllComplaints = () => {
  const [visible, setVisible] = useState(false);
  const [complaints, setComplaints] = useState(null);

  const fetchUpdateComplaints = async () => {
    try {
      const res = await fetchAllComplaints();
      setComplaints(res);
    } catch (error) {
      console.error(error);
      toast.error("Can't fetch all complaint");
    }
  };

  useEffect(() => {
    fetchUpdateComplaints();
  }, []);

  return (
    <div
      className={`AllComplaints ${visible ? "active-comp" : "inactive-comp"}`}
    >
      {visible ? (
        <i
          className="fa-light fa-circle-chevron-right"
          onClick={() => setVisible((p) => !p)}
        ></i>
      ) : (
        <i
          className="fa-light fa-circle-chevron-left"
          onClick={() => setVisible((p) => !p)}
        ></i>
      )}
      <div className="header">
        <p className="heading-4">Address Complaint</p>
      </div>
      <div className="main">
        {complaints?.map((data, index) => (
          <MasterComplaintItem
            data={data}
            key={index}
            handleRefresh={fetchUpdateComplaints}
          />
        ))}
      </div>
    </div>
  );
};

export default AllComplaints;

const MasterComplaintItem = ({ data, handleRefresh }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReponse = async () => {
    try {
      setIsLoading(true);
      await respondToComplaint(text, data?.docId);
      handleRefresh();
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!data.response) return;
    setText(data.response);
  }, [data]);
  return (
    <div className={`master-c-item ${data?.response ? "responded" : "not-responded"}`}>
      <div className="user-cont">
        <p>
          <b>Name: </b>
          {data?.lastname} {data?.firstname}
        </p>
      </div>
      <div className="user-cont">
        <p>
          <b>Email: </b> {data?.email}
        </p>
      </div>
      <div className="user-cont">
        <p>
          <b>Date: </b> {formatDate(data?.createdAt?.seconds)}
        </p>
      </div>
      <div className="line"></div>
      <p className="complaint">{data?.complaint}</p>
      <div className="line"></div>
      <textarea
        name=""
        id=""
        placeholder="Respond here"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={data?.response}
      ></textarea>
      <Button
        onClick={handleReponse}
        text={"Respond"}
        loadingText={"Updating reponse"}
        isLoading={isLoading}
        disabled={data?.response}
      />
    </div>
  );
};
