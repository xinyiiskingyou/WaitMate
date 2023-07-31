import React, { useState } from "react";

import Manager from "../Staff/ManagerInterface";
import ManagerSettings from "./ManagerSettings";


const SettingPage = () => {
  return (
    <>
      <Manager />
      <ManagerSettings />
    </>
  );
}

export default SettingPage;