import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { FaSearch } from "react-icons/fa";
import { setSearchQuery } from "../../redux/slices/productSlice";
import { useDispatch } from "react-redux";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(query)); // ✅ Redux me update
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by name, brand or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        <FaSearch />
      </button>
    </form>
  );
}
