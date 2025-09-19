// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import liquorsData from "./data/liquors.json";

function App() {
  const [liquors, setLiquors] = useState([]);
  const [filterBrand, setFilterBrand] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [rspUnder, setRspUnder] = useState("");
  const [rspOver, setRspOver] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("Brand Name");
  const [sortDir, setSortDir] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    // Load mock data from JSON file. Replace with fetch from API later.
    setLiquors(liquorsData);
  }, []);

  // derive unique brands and units for dropdowns
  const brands = Array.from(new Set(liquors.map((l) => l["Brand Name"]))).filter(Boolean);
  const units = Array.from(new Set(liquors.map((l) => l["Unit Name"]))).filter(Boolean);

  function applyFilters(list) {
    return list.filter((l) => {
      // brand filter
      if (filterBrand && l["Brand Name"] !== filterBrand) return false;

      // unit filter
      if (filterUnit && l["Unit Name"] !== filterUnit) return false;

      // RSP numeric filters - convert to number safely
      const price = parseFloat(l["RSP"]) || 0;
      if (rspUnder) {
        const val = parseFloat(rspUnder);
        if (!isNaN(val) && price >= val) return false;
      }
      if (rspOver) {
        const val = parseFloat(rspOver);
        if (!isNaN(val) && price <= val) return false;
      }

      // search text across Brand Name, Label Name, RSP
      if (searchText) {
        const q = searchText.trim().toLowerCase();
        const hay = (l["Brand Name"] + " " + l["Label Name"] + " " + l["RSP"]).toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }

  const filtered = applyFilters(liquors);

  function sortList(list) {
    const fld = sortField;
    const dir = sortDir === "asc" ? 1 : -1;
    // create a shallow copy before sort
    return [...list].sort((a, b) => {
      const A = (a[fld] || "").toString().toLowerCase();
      const B = (b[fld] || "").toString().toLowerCase();

      // If numeric compare (RSP), compare numeric
      if (fld === "RSP") {
        const na = parseFloat(a["RSP"]) || 0;
        const nb = parseFloat(b["RSP"]) || 0;
        return (na - nb) * dir;
      }

      if (A < B) return -1 * dir;
      if (A > B) return 1 * dir;
      return 0;
    });
  }

  const visible = sortList(filtered);

  return (
    <div className="container">
      <h1>Liquor List</h1>

      {/* Filters */}
      <div className="filters-row">
        <div className="filters">
        <input
          type="text"
          placeholder="Search Brand, Label or RSP"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <label>
          Type:
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
            <option value="">All</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label>
          Unit(ML):
          <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
            <option value="">All</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>

        <label>
          Max Price:
          <input
            type="number"
            placeholder="max"
            value={rspUnder}
            onChange={(e) => setRspUnder(e.target.value)}
          />
        </label>

        <label>
          Min Price:
          <input
            type="number"
            placeholder="min"
            value={rspOver}
            onChange={(e) => setRspOver(e.target.value)}
          />
        </label>

        <button
          onClick={() => {
            setFilterBrand("");
            setFilterUnit("");
            setRspUnder("");
            setRspOver("");
            setSearchText("");
          }}
        >
          Clear
        </button>
        </div>

        <div className="result-count">
          Showing <strong>{filtered.length}</strong> of <strong>{liquors.length}</strong>
        </div>
      </div>

      {/* Table for desktop */}
      <div className="table-wrapper">
        <table className="liquor-table">
          <thead>
            <tr>
              <th
                className={"sortable " + (sortField === "Liqour Type" ? (sortDir === "asc" ? "sorted-asc" : "sorted-desc") : "")}
                onClick={() => {
                  if (sortField === "Liqour Type") setSortDir(sortDir === "asc" ? "desc" : "asc");
                  else {
                    setSortField("Liqour Type");
                    setSortDir("asc");
                  }
                }}
              >
                Liqour Type
              </th>
              <th
                className={"sortable " + (sortField === "Brand Name" ? (sortDir === "asc" ? "sorted-asc" : "sorted-desc") : "")}
                onClick={() => {
                  if (sortField === "Brand Name") setSortDir(sortDir === "asc" ? "desc" : "asc");
                  else {
                    setSortField("Brand Name");
                    setSortDir("asc");
                  }
                }}
              >
                Brand Name
              </th>
              <th
                className={"sortable " + (sortField === "Label Name" ? (sortDir === "asc" ? "sorted-asc" : "sorted-desc") : "")}
                onClick={() => {
                  if (sortField === "Label Name") setSortDir(sortDir === "asc" ? "desc" : "asc");
                  else {
                    setSortField("Label Name");
                    setSortDir("asc");
                  }
                }}
              >
                Label Name
              </th>
              <th
                className={"sortable " + (sortField === "Unit Name" ? (sortDir === "asc" ? "sorted-asc" : "sorted-desc") : "")}
                onClick={() => {
                  if (sortField === "Unit Name") setSortDir(sortDir === "asc" ? "desc" : "asc");
                  else {
                    setSortField("Unit Name");
                    setSortDir("asc");
                  }
                }}
              >
                Unit Name
              </th>
              <th
                className={"sortable " + (sortField === "RSP" ? (sortDir === "asc" ? "sorted-asc" : "sorted-desc") : "")}
                onClick={() => {
                  if (sortField === "RSP") setSortDir(sortDir === "asc" ? "desc" : "asc");
                  else {
                    setSortField("RSP");
                    setSortDir("asc");
                  }
                }}
              >
                RSP
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((liq, idx) => (
              <tr key={idx}>
                <td>{liq["Liqour Type"]}</td>
                <td>{liq["Brand Name"]}</td>
                <td>{liq["Label Name"]}</td>
                <td>{liq["Unit Name"]}</td>
                <td>{liq["RSP"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="card-list">
        {visible.map((liq, idx) => (
          <div key={idx} className="card">
            <p><strong>Liqour Type:</strong> {liq["Liqour Type"]}</p>
            <p><strong>Brand Name:</strong> {liq["Brand Name"]}</p>
            <p><strong>Label Name:</strong> {liq["Label Name"]}</p>
            <p><strong>Unit Name:</strong> {liq["Unit Name"]}</p>
            <p><strong>RSP:</strong> {liq["RSP"]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
