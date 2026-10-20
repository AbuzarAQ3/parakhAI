import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  Barcode,
  History,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  Wifi,
  WifiOff,
  BellRing,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/common/StatusBadge";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState("2 mins ago");
  const [dismissAlert, setDismissAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check backend health
    api.getHealth()
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("offline"));

    // Load dashboard summary
    api.getDashboardSummary()
      .then((res) => {
        setData(res);
        setLastSynced("Just now");
      })
      .catch((err) => {
        console.warn("Backend summary loading error:", err);
      });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Format dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const recentInspections = data?.recent_activity || [
    {
      id: "insp-1",
      product_name: "Amul Taaza Toned Milk",
      timestamp: "17 Sep 2026 • 10:42 AM",
      location: "Civil Lines, Kanpur, UP",
      compliance_status: "COMPLIANT",
      image_url: "/samples/AmulTazaTonedMilk.jpeg",
    },
    {
      id: "insp-2",
      product_name: "Crunchy Glucose Biscuits",
      timestamp: "16 Sep 2026 • 03:18 PM",
      location: "Govind Nagar, Kanpur, UP",
      compliance_status: "NON_COMPLIANT",
      image_url: "/samples/SunriseBiscuit.jpeg",
    },
    {
      id: "insp-3",
      product_name: "Fortune Sunlite Refined Sunflower Oil",
      timestamp: "16 Sep 2026 • 11:05 AM",
      location: "Kidwai Nagar, Kanpur, UP",
      compliance_status: "PARTIAL_COMPLIANCE",
      image_url: "/samples/FortuneOil.jpeg",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Field Connectivity & Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <div className="flex items-center space-x-2.5">
          {isOnline ? (
            <span className="flex items-center space-x-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Wifi className="w-3.5 h-3.5" />
              <span>Field Online</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode Active</span>
            </span>
          )}
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            Last Synced: {lastSynced}
          </span>
        </div>

        <button
          onClick={() => {
            setLastSynced("Just now");
            api.getDashboardSummary().then(setData).catch(() => {});
          }}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 hover:underline"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Urgent Alerts / Department Announcement Banner */}
      {!dismissAlert && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 shadow-xs flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-100/80 text-amber-800 shrink-0 mt-0.5">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Urgent Notice
                </span>
                <span className="text-xs font-bold text-amber-950">
                  LMPCR Special Drive: Packaged Commodities Rule 6(1)
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Special enforcement drive active in Kanpur Nagar Zone 4. Verify Unit Sale Price (USP) declarations and ensure retail prices strictly adhere to Maximum Retail Price (MRP) guidelines inclusive of all taxes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissAlert(true)}
            className="text-amber-700 hover:text-amber-900 text-xs font-bold px-2 py-1 hover:bg-amber-100 rounded-lg shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Greeting & Date Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {greeting}, Inspector
        </h2>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center space-x-1.5 font-medium text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{dateStr}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">&bull;</span>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kanpur Nagar, Uttar Pradesh</span>
          </div>
        </div>
      </div>

      {/* Royal-Blue "SCAN NOW" Main Action Card */}
      <Link
        to="/inspect?mode=camera"
        className="block group relative overflow-hidden bg-[#2358e6] hover:bg-[#1d4ecc] p-6 sm:p-7 rounded-2xl text-white shadow-lg shadow-blue-600/25 transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-blue-200 block mb-0.5">
                LEGAL METROLOGY &bull; FIELD INSPECTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                SCAN NOW
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium">
                Capture or upload a packaged commodity label for inspection.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </Link>

      {/* 3 Shortcut Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Upload Image */}
        <Link
          to="/inspect?mode=upload"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Upload Image</span>
        </Link>

        {/* Scan Barcode */}
        <Link
          to="/inspect?mode=barcode"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Barcode className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Scan Barcode</span>
        </Link>

        {/* Recent Inspections */}
        <Link
          to="/history"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <History className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Recent Inspections</span>
        </Link>
      </div>

      {/* Recent Activity List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900">Recent Activity</h4>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View all</span>
            <span aria-hidden="true">&gt;</span>
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentInspections.map((item, idx) => (
            <Link
              key={item.id || idx}
              to={`/inspections/${item.id}`}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
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
                    <span className="text-xs font-bold text-slate-400">IMG</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {item.product_name}
                  </h5>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span>{item.timestamp}</span>
                    <span>&bull;</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 ml-3">
                <StatusBadge status={item.compliance_status} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Backend Connectivity Status Notification */}
      <div className="flex items-center justify-center">
        {backendStatus === "connected" ? (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Connected: Django &bull; DRF API Live &bull; Demo Mode Active</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-slate-900 text-white text-xs shadow-xl">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Frontend Preview Mode &bull; Click to connect backend</span>
            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-[11px]"
            >
              Wake up servers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
