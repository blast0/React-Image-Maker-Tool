import React, { useState } from "react";
import { cloneDeep } from "lodash";
import Group from "../group";
function SiteColors(props) {
  const [searchKey, setSearchKey] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const siteColorData = cloneDeep(props.siteColorData);
  // delete gradient
  if (siteColorData.hasOwnProperty("color-gradient")) {
    delete siteColorData["color-gradient"];
  }

  // check key is for grouping
  function isGroupedData(siteColorDataKey) {
    if (siteColorDataKey.includes("_is_grouped_")) {
      return true;
    }
  }
  // modify key to show a proper title
  function modifyText(text) {
    if (text.includes("color-")) text = text.substr(6);

    let newStr = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "-") newStr += " ";
      else if (text[i - 1] === "-" || i === 0) newStr += text[i].toUpperCase();
      else newStr += text[i];
    }

    return newStr;
  }
  // search input action
  const handleSearch = (e) => {
    if (e.target.value !== "") {
      setActiveSearch(true);
    } else {
      setActiveSearch(false);
    }

    setSearchKey(e.target.value);
  };
  // filter data according to the search
  const filteredData = Object.keys(siteColorData).reduce((acc, key) => {
    if (modifyText(key).toLowerCase().includes(searchKey.toLowerCase())) {
      acc[key] = siteColorData[key];
    }
    return acc;
  }, {});

  return (
    <div className="SiteSettingsColor">
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={searchKey}
          onChange={handleSearch}
        />
        <span className="secarch-icon">
          <i className="icon-search"></i>
        </span>
      </div>
      <div style={{ height: "400px", overflow: "auto" }}>
        <div className="SiteColors-Container">
          {Object.keys(filteredData).map((item, index) => {
            let isGroupe = isGroupedData(item);
            let title = modifyText(item);
            return (
              <React.Fragment key={item}>
                {isGroupe && !activeSearch ? (
                  <Group value={filteredData[item]} />
                ) : !isGroupe ? (
                  <div className="SiteColors">
                    <span style={{ width: "calc(100% - 65px)" }}>{title}</span>
                    <div
                      className={`ColorSelectorWithPopup tooltip-top`}
                      style={{
                        backgroundColor: filteredData[item],
                      }}
                      onClick={(e, index) => {
                        props.onChange(filteredData[item]);
                      }}
                    ></div>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default SiteColors;
