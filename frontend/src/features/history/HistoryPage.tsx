import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Scan,
  TrendingUp,
  Map as MapIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { api } from "../../services/api";
import { Inspection, WeeklyTrendsResponse, LocationCluster } from "../../types";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ScoreBadge } from "../../components/common/ScoreBadge";

export const HistoryPage: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Analytics data
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrendsResponse | null>(null);
  const [locations, setLocations] = useState<LocationCluster[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "analytics" | "map">("list");

  useEffect(() => {
    loadInspections(currentPage, statusFilter, categoryFilter, search);
  }, [currentPage, statusFilter, categoryFilter]);

  useEffect(() => {
    api.getWeeklyAnalytics().then(setWeeklyTrends).catch(console.error);
    api.getLocationAnalytics().then(setLocations).catch(console.error);
  }, []);

  const loadInspections = (page: number, status: string, category: string, query: string) => {
    setLoading(true);
    api
      .getInspections({
        page,
        compliance_status: status || undefined,
        category: category || undefined,
        search: query || undefined,
      })
      .then((res) => {
        setInspections(res.results);
        setTotalPages(res.total_pages);
        setTotalCount(res.count);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadInspections(1, statusFilter, categoryFilter, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inspection History &amp; Field Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete statutory inspection log, 7-day trend analysis, and Kanpur jurisdiction mapping
          </p>
        </div>

        {/* View Switcher */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex space-x-1">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "list"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Records
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>7-Day Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "map"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Geo Map</span>
          </button>
        </div>
      </div>

      {/* 7-Day Analytics View */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                7-Day Inspection &amp; Violation Trends
              </h3>
              <p className="text-xs text-slate-500">
                Persisted database analytics for the current enforcement period
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Kanpur Division
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {weeklyTrends ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends.trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="compliant" name="Compliant Packages" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="violations" name="Violations (PCR 2011)" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending Review" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Loading analytics trends...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Geo Map View */}
      {activeTab === "map" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Geo-Tagged Inspection Sites — Kanpur Nagar
              </h3>
              <p className="text-xs text-slate-500">
                Inspections mapped by physical GPS coordinates &amp; retail hubs
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {locations.length} Active Hotspots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-600 shrink-0" />
                      {loc.location_name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {loc.latitude.toFixed(4)}° N, {loc.longitude.toFixed(4)}° E
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {loc.total_inspections} Insp.
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs pt-1">
                  <span className="text-emerald-700 font-semibold">
                    {loc.compliant_count} Compliant
                  </span>
                  <span>&bull;</span>
                  <span className="text-rose-700 font-semibold">
                    {loc.violations_count} Violations
                  </span>
                </div>

                {loc.latest_inspection && (
                  <Link
                    to={`/inspections/${loc.latest_inspection.id}`}
                    className="block pt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between border-t border-slate-200/60"
                  >
                    <span>Latest: {loc.latest_inspection.product_name}</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, inspection ID, or shop location..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Violation</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Packaged Food">Packaged Food</option>
            <option value="Dairy Products">Dairy Products</option>
            <option value="Edible Oils">Edible Oils</option>
            <option value="Personal Care">Personal Care</option>
          </select>
        </div>
      </div>

      {/* Inspections Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 font-semibold">
              Loading inspection records...
            </div>
          ) : inspections.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 font-medium">
              No inspections found matching the current filters.
            </div>
          ) : (
            inspections.map((insp) => (
              <Link
                key={insp.id}
                to={`/inspections/${insp.id}`}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {insp.image_url ? (
                      <img
                        src={insp.image_url}
                        alt={insp.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Scan className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {insp.inspection_number}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {insp.category}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {insp.inspection_method}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {insp.product_name}
                    </h4>
                    {insp.product_name_hindi && (
                      <p className="text-xs text-slate-400 font-medium">
                        {insp.product_name_hindi}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {insp.location_name}
                      </span>
                      <span>&bull;</span>
                      <span>{new Date(insp.timestamp).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <StatusBadge status={insp.compliance_status} size="sm" />
                  <ScoreBadge score={insp.compliance_score} size="sm" showLabel={false} />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing page {currentPage} of {totalPages} ({totalCount} total inspections)
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
