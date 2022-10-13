import React from "react";
import { RotateLoader } from "react-spinners";

const Spinner = () => {
  return (
    <>
      <RotateLoader color="#3e3c61" loading={true} size={17} />
    </>
  );
};

export default Spinner;
