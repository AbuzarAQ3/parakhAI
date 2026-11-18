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
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { StatusBadge } from "../../components/common/StatusBadge";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState("2 mins ago");
  const [dismissAlert, setDismissAlert] = useState(false);
  const [alertExpanded, setAlertExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check backend health
    api.getHealth()
      .then(() => {
        if (isMounted) setBackendStatus("connected");
      })
      .catch(() => {
        if (isMounted) setBackendStatus("offline");
      });

    // Load dashboard summary
    api.getDashboardSummary()
      .then((res) => {
        if (!isMounted) return;
        setData(res);
        setLastSynced("Just now");
      })
      .catch((err) => {
        console.warn("Backend summary loading error:", err);
      });

    return () => {
      isMounted = false;
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

  const getUserScans = () => {
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`parakh_inspections_${user.username || user.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const userScans = getUserScans();
  const isDemoUser =
    user?.is_guest ||
    user?.username === "rajesh_kumar" ||
    user?.username === "guest_inspector" ||
    user?.username === "guest_supervisor";

  const recentInspections =
    data?.recent_activity ||
    (userScans.length > 0
      ? userScans.slice(0, 5)
      : isDemoUser
      ? [
          {
            id: "INSP-2026-0918-001",
            product_name: "Bikano Aloo Bhujia",
            timestamp: "18 Sep 2026 • 09:30 AM",
            location: "Mall Road, Kanpur, UP",
            compliance_status: "COMPLIANT",
            image_url: "/samples/Aloo_Bhujia_Bikano.jpeg",
          },
          {
            id: "INSP-2026-0917-042",
            product_name: "Amul Taaza Toned Milk",
            timestamp: "17 Sep 2026 • 10:42 AM",
            location: "Civil Lines, Kanpur, UP",
            compliance_status: "COMPLIANT",
            image_url: "/samples/AmulTazaTonedMilk.jpeg",
          },
          {
            id: "INSP-2026-0916-037",
            product_name: "Crunchy Glucose Biscuits",
            timestamp: "16 Sep 2026 • 03:18 PM",
            location: "Govind Nagar, Kanpur, UP",
            compliance_status: "NON_COMPLIANT",
            image_url: "/samples/SunriseBiscuit.jpeg",
          },
        ]
      : []);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-3 sm:space-y-6">
      {/* Top Field Connectivity & Sync Bar — compact on mobile */}
      <div className="flex items-center justify-between gap-2 px-2.5 sm:p-3 py-2 rounded-xl bg-parakh-card border border-parakh-border shadow-xs text-xs">
        <div className="flex items-center space-x-2 min-w-0">
          {isOnline ? (
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
              <Wifi className="w-3 h-3" />
              <span className="hidden xs:inline">Field</span>
              <span>Online</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse shrink-0">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </span>
          )}
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <span className="text-parakh-muted font-medium flex items-center truncate">
            <Clock className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
            <span className="truncate">Synced: {lastSynced}</span>
          </span>
        </div>

        <button
          onClick={() => {
            setLastSynced("Just now");
            api.getDashboardSummary().then(setData).catch(() => {});
          }}
          className="text-parakh-primary hover:text-parakh-primaryHover font-semibold flex items-center space-x-1 hover:underline shrink-0 touch-target"
          aria-label="Sync now"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Sync Now</span>
        </button>
      </div>

      {/* Urgent Alerts / Department Announcement Banner */}
      {!dismissAlert && (
        <div className="rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 shrink-0 border border-amber-200">
                <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                    Urgent
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-amber-900 truncate">
                    LMPCR Special Drive: Rule 6(1)
                  </span>
                </div>
                {/* Full message — always visible on desktop, expandable on mobile */}
                <p className={`text-[11px] text-amber-800 leading-relaxed mt-0.5 ${alertExpanded ? '' : 'hidden sm:block'}`}>
                  Special enforcement drive active in Kanpur Nagar Zone 4. Verify Unit Sale Price (USP) declarations and ensure retail prices strictly adhere to Maximum Retail Price (MRP) guidelines inclusive of all taxes.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              {/* Expand/collapse toggle on mobile only */}
              <button
                onClick={() => setAlertExpanded(!alertExpanded)}
                className="sm:hidden p-1.5 text-amber-700 hover:text-amber-900 rounded-lg touch-target cursor-pointer"
                aria-label={alertExpanded ? "Collapse alert" : "Expand alert"}
              >
                {alertExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setDismissAlert(true)}
                className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg touch-target cursor-pointer"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Greeting & Date Header — tighter on mobile */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-parakh-text">
          {greeting}, {user?.name || user?.username || "Inspector"}
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs text-parakh-muted">
          <div className="flex items-center space-x-1.5 font-medium text-parakh-muted">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            <span>{dateStr}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-parakh-primary/15 text-parakh-primary font-semibold text-[11px] border border-parakh-primary/25">
            <MapPin className="w-3 h-3" />
            <span>Kanpur Nagar, UP</span>
          </div>
        </div>
      </div>

      {/* Blue "SCAN NOW" Main Action Card */}
      <Link
        to="/inspect?mode=camera"
        className="block group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 p-4 sm:p-6 md:p-7 rounded-2xl text-white shadow-xl shadow-blue-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white/80 block mb-0.5">
                LEGAL METROLOGY &bull; FIELD INSPECTION
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                SCAN NOW
              </h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/90 mt-0.5 font-medium">
                Capture or upload a packaged commodity label.
              </p>
            </div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      </Link>

      {/* 3 Shortcut Action Cards — horizontal row on mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4">
        {/* Upload Image */}
        <Link
          to="/inspect?mode=upload"
          className="bg-parakh-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs hover:border-parakh-primary/40 hover:bg-parakh-cardHover transition-all flex flex-col items-center justify-center text-center group active:scale-[0.97]"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-parakh-primary/15 border border-parakh-primary/25 text-parakh-primary flex items-center justify-center mb-1.5 sm:mb-2.5 group-hover:bg-parakh-primary group-hover:text-white transition-colors">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-sm font-bold text-parakh-text leading-tight">Upload Image</span>
        </Link>

        {/* Scan Barcode */}
        <Link
          to="/inspect?mode=barcode"
          className="bg-parakh-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs hover:border-parakh-primary/40 hover:bg-parakh-cardHover transition-all flex flex-col items-center justify-center text-center group active:scale-[0.97]"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-parakh-primary/15 border border-parakh-primary/25 text-parakh-primary flex items-center justify-center mb-1.5 sm:mb-2.5 group-hover:bg-parakh-primary group-hover:text-white transition-colors">
            <Barcode className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-sm font-bold text-parakh-text leading-tight">Scan Barcode</span>
        </Link>

        {/* Recent Inspections */}
        <Link
          to="/history"
          className="bg-parakh-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs hover:border-parakh-primary/40 hover:bg-parakh-cardHover transition-all flex flex-col items-center justify-center text-center group active:scale-[0.97]"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-parakh-primary/15 border border-parakh-primary/25 text-parakh-primary flex items-center justify-center mb-1.5 sm:mb-2.5 group-hover:bg-parakh-primary group-hover:text-white transition-colors">
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-sm font-bold text-parakh-text leading-tight">Recent Inspections</span>
        </Link>
      </div>

      {/* Recent Activity List Card */}
      <div className="bg-parakh-card rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs overflow-hidden">
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-parakh-border flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold text-parakh-text">Recent Activity</h4>
          <Link
            to="/history"
            className="text-xs font-semibold text-parakh-primary hover:text-parakh-primaryHover flex items-center space-x-1"
          >
            <span>View all</span>
            <span aria-hidden="true">&gt;</span>
          </Link>
        </div>

        <div className="divide-y divide-parakh-border">
          {recentInspections.map((item, idx) => (
            <Link
              key={item.id || idx}
              to={`/inspections/${item.id}`}
              className="px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-parakh-cardHover transition-colors group active:bg-parakh-cardHover"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-parakh-bg border border-parakh-border overflow-hidden shrink-0 flex items-center justify-center">
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
                    <span className="text-xs font-bold text-slate-500">IMG</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs sm:text-sm font-bold text-parakh-text group-hover:text-parakh-primary transition-colors truncate">
                    {item.product_name}
                  </h5>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0 text-[10px] sm:text-xs text-parakh-muted mt-0.5">
                    <span className="truncate">{item.timestamp}</span>
                    <span className="hidden sm:inline">&bull;</span>
                    <span className="hidden sm:flex items-center truncate">
                      <MapPin className="w-3 h-3 mr-0.5 text-slate-500 shrink-0" />
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 ml-2">
                <StatusBadge status={item.compliance_status} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Backend Connectivity Status Notification */}
      <div className="flex items-center justify-center pb-2">
        {backendStatus === "connected" ? (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-parakh-card border border-parakh-border text-parakh-text text-[10px] sm:text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Connected: Django &bull; DRF API Live &bull; Demo Mode Active</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-parakh-card border border-parakh-border text-parakh-text text-[10px] sm:text-xs shadow-xl flex-wrap justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="text-parakh-muted">Frontend Preview Mode</span>
            <button
              onClick={() => window.location.reload()}
              className="px-2 py-0.5 bg-parakh-primary hover:bg-parakh-primaryHover text-white rounded-full font-semibold text-[10px] sm:text-[11px] shrink-0"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
