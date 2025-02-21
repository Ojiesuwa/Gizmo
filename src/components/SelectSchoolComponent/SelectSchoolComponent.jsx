import React, { useEffect, useState } from "react";
import "./SelectSchoolComponent.css";
import SearchBar from "../SearchBar/SearchBar";
import { addNewSchool, fetchAllSchools } from "../../controllers/site";
import { toast } from "react-toastify";
import Button from "../Button/Button";

const SelectSchoolComponent = ({ isVisible, onHide, onSelect }) => {
  const [selected, setSelected] = useState("");
  const [school, setSchool] = useState(null);
  const [displaySchool, setDisplaySchool] = useState(null);
  const [search, setSearch] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolName, setSchoolName] = useState("");

  const handleSelectSchool = () => {
    onSelect(selected);
    onHide();
  };

  const handleAddNewSchool = async () => {
    try {
      setIsLoading(true);
      const alreadyExist = school.some((data) =>
        data.toLowerCase().includes(schoolName.toLowerCase())
      );
      if (alreadyExist) {
        return toast.error("School already exist");
      }

      const formattedName = schoolName.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
      await addNewSchool(formattedName);
      fetchAllSchools()
        .then((data) => {
          setSchool(data.schools);
          setDisplaySchool(data.schools);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error Loading Schools");
        });

      toast.success("School name updated");
      onSelect(formattedName);
      setCanAdd(false);
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Error adding school");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSchools()
      .then((data) => {
        setSchool(data.schools);
        setDisplaySchool(data.schools);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Loading Schools");
      });
  }, []);

  useEffect(() => {
    setDisplaySchool(
      school?.filter((data) =>
        data?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);
  if (!isVisible) return null;
  return (
    <div className="SelectSchoolComponent">
      <div className="main-container">
        <div className="header">
          <p className="heading-4">Select Campus</p>
          <i className="fa-light fa-circle-xmark" onClick={onHide}></i>
        </div>
        <div className="body-cont">
          {!canAdd ? (
            <div className="search-cont">
              <div className="input-wrapper">
                <i className="fa-light fa-search"></i>
                <input
                  type="text"
                  placeholder="Search School"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  setCanAdd(true);
                  setSelected("");
                }}
              >
                <i className="fa-light fa-circle-plus"></i>
                Add
              </button>
            </div>
          ) : (
            <div className="add-cont flex flex-col gap-3">
              <p className="heading-4">Create new school</p>
              <input
                type="text"
                placeholder="Enter School name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <div className="btn-cont flex gap-3">
                <Button
                  text={"Add School"}
                  isLoading={isLoading}
                  loadingText={"Adding New School"}
                  disabled={!schoolName}
                  onClick={handleAddNewSchool}
                />

                <button className="half-width" onClick={() => setCanAdd(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="list-cont">
            {displaySchool?.map((data) => (
              <div
                className="list-item"
                onClick={() => {
                  if (data === selected) {
                    setSelected("");
                  } else {
                    setSelected(data);
                  }
                }}
              >
                {data === selected ? (
                  <i className="fa-solid fa-circle"></i>
                ) : (
                  <i className="fa-light fa-circle"></i>
                )}
                <p>{data}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-cont">
          <button disabled={!selected} onClick={handleSelectSchool}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectSchoolComponent;
