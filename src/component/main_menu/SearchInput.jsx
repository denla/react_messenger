import React from "react";
import search_icon from "../../sources/icons/search_icon.svg";

const SearchInput = ({ searchText, setSearchText }) => {
  return (
    <div className="search-container">
      <input
        className="input--search "
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
