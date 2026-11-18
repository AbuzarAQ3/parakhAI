import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Search,
  MapPin,
  ExternalLink,
  Download,
  Calendar,
  X,
  Store,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ScoreBadge } from "../../components/common/ScoreBadge";

// Custom Colored Leaflet SVG Pin Icons
const createPinIcon = (color) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: white;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const greenIcon = createPinIcon("#10b981");
const redIcon = createPinIcon("#ef4444");
const amberIcon = createPinIcon("#f59e0b");

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activePinFilter, setActivePinFilter] = useState(null);

  useEffect(() => {
    let isMounted = true;
    loadData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [user?.username]);

  const getUserLocalInspections = () => {
    if (!user) return [];
    try {
      const key = `parakh_inspections_${user.username || user.id}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const loadData = (isMounted = true) => {
    setLoading(true);
    const userScans = getUserLocalInspections();

    api.getInspections({ page: 1 })
      .then((res) => {
        if (!isMounted) return;
        const apiRecords = res.results && res.results.length > 0 ? res.results : [];
        if (apiRecords.length > 0) {
          // Merge API records with user scans (avoid duplicates by id)
          const ids = new Set(userScans.map((r) => r.id));
          const merged = [...userScans, ...apiRecords.filter((r) => !ids.has(r.id))];
          setInspections(merged);
        } else if (userScans.length > 0) {
          setInspections(userScans);
        } else if (
          user?.is_guest ||
          user?.username === "rajesh_kumar" ||
          user?.username === "guest_inspector" ||
          user?.username === "guest_supervisor"
        ) {
          setInspections(getDefaultInspections());
        } else {
          // New officer account with no scans yet
          setInspections([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("API inspections unavailable, checking local records:", err);
        if (userScans.length > 0) {
          setInspections(userScans);
        } else if (
          user?.is_guest ||
          user?.username === "rajesh_kumar" ||
          user?.username === "guest_inspector" ||
          user?.username === "guest_supervisor"
        ) {
          setInspections(getDefaultInspections());
        } else {
          setInspections([]);
        }
        setLoading(false);
      });
  };

  const getDefaultInspections = () => [
    {
      id: "INSP-2026-0918-001",
      inspection_number: "INSP-2026-0918-001",
      product_name: "Bikano Aloo Bhujia",
      category: "Snacks & Confectionery",
      timestamp: "2026-09-18T09:30:00Z",
      location_name: "Mall Road Retail Market, Kanpur",
      latitude: 26.4674,
      longitude: 80.3500,
      compliance_score: 100.0,
      compliance_status: "COMPLIANT",
      image_url: "/samples/Aloo_Bhujia_Bikano.jpeg",
    },
    {
      id: "INSP-2026-0917-042",
      inspection_number: "INSP-2026-0917-042",
      product_name: "Amul Taaza Toned Milk",
      category: "Dairy Products",
      timestamp: "2026-09-17T10:42:00Z",
      location_name: "Civil Lines Dairy Outlet, Kanpur",
      latitude: 26.4735,
      longitude: 80.3456,
      compliance_score: 94.0,
      compliance_status: "COMPLIANT",
      image_url: "/samples/AmulTazaTonedMilk.jpeg",
    },
    {
      id: "INSP-2026-0916-037",
      inspection_number: "INSP-2026-0916-037",
      product_name: "Crunchy Glucose Biscuits",
      category: "Bakery & Biscuits",
      timestamp: "2026-09-16T15:18:00Z",
      location_name: "Govind Nagar Wholesale Mandi, Kanpur",
      latitude: 26.4499,
      longitude: 80.3012,
      compliance_score: 38.0,
      compliance_status: "NON_COMPLIANT",
      image_url: "/samples/SunriseBiscuit.jpeg",
    },
  ];

  // Filtered dataset (Bug Fixed: Log always populates properly)
  const filteredInspections = useMemo(() => {
    return inspections.filter((item) => {
      // Map pin filter
      if (activePinFilter && !item.location_name?.toLowerCase().includes(activePinFilter.toLowerCase())) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.product_name?.toLowerCase().includes(q);
        const matchesId = item.inspection_number?.toLowerCase().includes(q);
        const matchesLoc = item.location_name?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesLoc) return false;
      }

      // Status Filter
      if (statusFilter !== "all") {
        if (statusFilter === "COMPLIANT" && item.compliance_status !== "COMPLIANT") return false;
        if (statusFilter === "VIOLATION" && item.compliance_status !== "NON_COMPLIANT") return false;
        if (
          statusFilter === "PENDING" &&
          item.compliance_status !== "NEEDS_REVIEW" &&
          item.compliance_status !== "PARTIAL_COMPLIANCE"
        )
          return false;
      }

      // Category Filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }

      // Location Filter
      if (locationFilter !== "all" && !item.location_name?.includes(locationFilter)) {
        return false;
      }

      // Custom From - To Date Range Filter
      if (fromDate) {
        const itemDate = new Date(item.timestamp).toISOString().split("T")[0];
        if (itemDate < fromDate) return false;
      }
      if (toDate) {
        const itemDate = new Date(item.timestamp).toISOString().split("T")[0];
        if (itemDate > toDate) return false;
      }

      return true;
    });
  }, [inspections, searchQuery, statusFilter, categoryFilter, locationFilter, fromDate, toDate, activePinFilter]);

  // Aggregate Metrics for the 4 Top Cards
  const totalCount = inspections.length;
  const compliantCount = inspections.filter((i) => i.compliance_status === "COMPLIANT").length;
  const violationCount = inspections.filter((i) => i.compliance_status === "NON_COMPLIANT").length;
  const pendingCount = inspections.filter((i) => i.compliance_status === "NEEDS_REVIEW" || i.compliance_status === "PARTIAL_COMPLIANCE").length;

  // 7-Day Chart Data for Demo Inspections
  const chartData = [
    { date: "15 Sep", compliant: 0, violation: 0, pending: 0 },
    { date: "16 Sep", compliant: 0, violation: 1, pending: 0 },
    { date: "17 Sep", compliant: 1, violation: 0, pending: 0 },
    { date: "18 Sep", compliant: 1, violation: 0, pending: 0 },
  ];

  const categories = useMemo(() => {
    const set = new Set(inspections.map((i) => i.category).filter(Boolean));
    return Array.from(set);
  }, [inspections]);

  const locationsList = useMemo(() => {
    const set = new Set(inspections.map((i) => i.location_name?.split(",")[0]).filter(Boolean));
    return Array.from(set);
  }, [inspections]);

  const mapMarkers = useMemo(() => {
    return inspections.filter(
      (item) => typeof item.latitude === "number" && typeof item.longitude === "number"
    );
  }, [inspections]);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      "Inspection ID",
      "Product Name",
      "Category",
      "Location / Shop",
      "Compliance Status",
      "Score",
      "Date Time",
    ];

    const rows = filteredInspections.map((item) => [
      `"${item.inspection_number || item.id}"`,
      `"${item.product_name}"`,
      `"${item.category || ''}"`,
      `"${item.location_name || ''}"`,
      `"${item.compliance_status}"`,
      `"${Math.round(item.compliance_score || 0)}%"`,
      `"${item.timestamp || ''}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Parakh_AI_Inspection_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* 4 Summary KPI Cards matching Screenshot 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspections */}
        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-parakh-text block leading-tight">
              {totalCount}
            </span>
            <span className="text-xs font-semibold text-parakh-muted">Total Inspections</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-parakh-primary/15 border border-parakh-primary/25 text-parakh-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Compliant */}
        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-parakh-text block leading-tight">
              {compliantCount}
            </span>
            <span className="text-xs font-semibold text-parakh-muted">Compliant</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Violations */}
        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-parakh-text block leading-tight">
              {violationCount}
            </span>
            <span className="text-xs font-semibold text-parakh-muted">Violations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-extrabold text-parakh-text block leading-tight">
              {pendingCount}
            </span>
            <span className="text-xs font-semibold text-parakh-muted">Pending Review</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Side-by-Side: 7-Day Chart & Geo-Tagged Map matching Screenshot 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Inspections - Last 7 Days with Enhanced Hover Tooltips */}
        <div className="bg-parakh-card p-6 rounded-2xl border border-parakh-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-parakh-muted">
                INSPECTIONS &bull; LAST 7 DAYS
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">Hover bars for counts</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222F44" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0B0F17] border border-[#222F44] text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold border-b border-[#222F44] pb-1">{label} Enforcement</p>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between space-x-3 text-[11px]">
                                <span className="flex items-center space-x-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                  <span className="capitalize">{entry.dataKey}:</span>
                                </span>
                                <span className="font-bold">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="compliant" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="violation" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs font-semibold text-slate-400 mt-3 pt-3 border-t border-parakh-border">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Violations</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* Right Column: Geo-Tagged Inspections Interactive Leaflet Map */}
        <div className="bg-parakh-card rounded-2xl border border-parakh-border shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-parakh-border flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-parakh-muted">
              GEO-TAGGED INSPECTIONS
            </h4>
            <div className="flex items-center space-x-2">
              {activePinFilter && (
                <button
                  onClick={() => setActivePinFilter(null)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center"
                >
                  Clear Pin Filter <X className="w-3 h-3 ml-1" />
                </button>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                KANPUR NAGAR &bull; GEO-TAGGED
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full relative z-0">
            <MapContainer
              center={[26.4600, 80.3319]}
              zoom={12}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mapMarkers.map((item) => {
                const icon =
                  item.compliance_status === "COMPLIANT"
                    ? greenIcon
                    : item.compliance_status === "NON_COMPLIANT"
                    ? redIcon
                    : amberIcon;

                return (
                  <Marker
                    key={item.id}
                    position={[item.latitude, item.longitude]}
                    icon={icon}
                    eventHandlers={{
                      click: () => {
                        // Map interaction: filters table below to this location
                        setActivePinFilter(item.location_name?.split(",")[0] || null);
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-1.5 max-w-[200px]">
                        <h5 className="font-bold text-xs text-slate-900 leading-snug">
                          {item.product_name}
                        </h5>
                        <div className="flex items-center justify-between">
                          <StatusBadge status={item.compliance_status} size="sm" />
                          <span className="text-[11px] font-bold text-slate-700">
                            {Math.round(item.compliance_score || 0)}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{item.location_name}</p>
                        <div className="pt-1 flex flex-col space-y-1">
                          <button
                            onClick={() => setActivePinFilter(item.location_name?.split(",")[0])}
                            className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 py-1 rounded text-center"
                          >
                            Filter Log to this Shop
                          </button>
                          <Link
                            to={`/inspections/${item.id}`}
                            className="block text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-1 rounded-md"
                          >
                            View Result &rarr;
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Map Legend matching Screenshot 4 */}
          <div className="p-3 bg-parakh-bg border-t border-parakh-border flex items-center justify-around text-xs font-semibold text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Compliant inspections</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Violations</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Pending verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row with Date Range & Export Button */}
      <div className="bg-parakh-card p-4 rounded-2xl border border-parakh-border shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product, shop name, or ID"
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="VIOLATION">Violations</option>
            <option value="PENDING">Pending Review</option>
          </select>

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Location Select */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All locations</option>
            {locationsList.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-parakh-primary hover:bg-parakh-primaryHover text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Custom "From - To" Date Range Picker */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-parakh-border text-xs">
          <span className="font-semibold text-slate-400 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Date Filter:
          </span>
          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-parakh-muted">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-parakh-border bg-parakh-bg text-xs text-parakh-text font-medium"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-parakh-muted">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-parakh-border bg-parakh-bg text-xs text-parakh-text font-medium"
            />
          </div>
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="text-xs text-rose-400 hover:underline font-bold"
            >
              Reset Date Range
            </button>
          )}

          {activePinFilter && (
            <span className="ml-auto text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 flex items-center">
              Filtering by Map Pin: {activePinFilter}
              <button onClick={() => setActivePinFilter(null)} className="ml-1 text-slate-400 hover:text-white">
                &times;
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Structured Inspection Records Table with Clear Columns */}
      <div className="bg-parakh-card rounded-2xl border border-parakh-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-parakh-border flex items-center justify-between">
          <h4 className="text-sm font-bold text-parakh-text">
            Inspections Log ({filteredInspections.length} records)
          </h4>
          <span className="text-xs text-parakh-muted">Kanpur Statutory Enforcement Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-parakh-bg border-b border-parakh-border text-parakh-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-5">Date</th>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Shop / Premise</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parakh-border font-medium">
              {filteredInspections.length > 0 ? (
                filteredInspections.map((item) => {
                  const dateStr = item.timestamp?.split("T")[0] || "2026-09-17";
                  const shopName = item.location_name?.split(",")[0] || "Retail Premises";

                  return (
                    <tr key={item.id} className="hover:bg-parakh-cardHover transition-colors text-parakh-text">
                      <td className="p-3.5 pl-5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {dateStr}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-parakh-bg border border-parakh-border overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-parakh-text block truncate max-w-[180px]">
                              {item.product_name}
                            </span>
                            <span className="text-[10px] text-parakh-muted font-mono">
                              {item.inspection_number || item.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-parakh-text font-bold max-w-[160px] truncate">
                        {shopName}
                      </td>
                      <td className="p-3.5 text-slate-400 max-w-[140px] truncate">
                        Kanpur Nagar
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <StatusBadge status={item.compliance_status} size="sm" />
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-black text-parakh-text">
                        {Math.round(item.compliance_score || 0)}%
                      </td>
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <Link
                          to={`/inspections/${item.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-parakh-primary/15 text-parakh-primary hover:bg-parakh-primary hover:text-white border border-parakh-primary/25 font-bold text-xs transition-all shadow-xs"
                        >
                          <span>View Result</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-parakh-muted space-y-2">
                    <p className="font-semibold text-parakh-text">
                      {inspections.length === 0
                        ? `No field inspections recorded yet for ${user?.name || user?.username || "your officer account"}.`
                        : "No inspections match the active filters."}
                    </p>
                    {inspections.length === 0 && (
                      <Link
                        to="/inspect"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 mt-2 bg-parakh-primary hover:bg-parakh-primaryHover text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        <span>Start First Inspection</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
