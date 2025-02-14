import React from "react";
import "./Timer.css";

const Timer = ({ duration, setDuration }) => {
  return (
    <div className="Timer">
      <div className="hours-cont timer-cont-2">
        <input
          type="number"
          placeholder="00"
          value={duration?.hours}
          onChange={(e) =>
            setDuration({ ...duration, hours: parseInt(e.target.value) })
          }
        />
        <p id="dem">Hrs</p>
      </div>
      <div className="mins-cont timer-cont-2">
        {" "}
        <input
          type="number"
          placeholder={0}
          value={duration?.minutes}
          onChange={(e) =>
            setDuration({ ...duration, minutes: parseInt(e.target.value) })
          }
        />
        <p id="dem">Mins</p>
      </div>
      <div className="secs-cont timer-cont-2">
        <input
          type="number"
          placeholder="00"
          value={duration?.seconds}
          onChange={(e) =>
            setDuration({ ...duration, seconds: parseInt(e.target.value) })
          }
        />
        <p id="dem">Secs</p>
      </div>
    </div>
  );
};

export default Timer;
