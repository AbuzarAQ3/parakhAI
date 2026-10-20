/**
 * Parakh AI - Constants & Utilities
 * Legal Metrology Packaged Commodities Inspection System
 */

export const COMPLIANCE_STATUSES = {
  COMPLIANT: "COMPLIANT",
  NON_COMPLIANT: "NON_COMPLIANT",
  PARTIAL_COMPLIANCE: "PARTIAL_COMPLIANCE",
  NEEDS_REVIEW: "NEEDS_REVIEW",
};

export const SEVERITY_LEVELS = {
  CRITICAL: "CRITICAL",
  MANDATORY: "MANDATORY",
  RECOMMENDED: "RECOMMENDED",
};

export const DEMO_LOCATION = {
  name: "Mall Road Retail Market, Kanpur",
  jurisdiction: "Kanpur Nagar, Uttar Pradesh",
  latitude: 26.4674,
  longitude: 80.35,
  zone: "Zone 4",
};

export const SAMPLE_PRODUCTS = [
  {
    id: "amul_taaza",
    name: "Amul Taaza Toned Milk",
    category: "Dairy Products",
    status: "COMPLIANT",
    score: 94,
    image: "/samples/AmulTazaTonedMilk.jpeg",
  },
  {
    id: "crunchy_glucose",
    name: "Crunchy Glucose Biscuits",
    category: "Bakery & Biscuits",
    status: "NON_COMPLIANT",
    score: 38,
    image: "/samples/SunriseBiscuit.jpeg",
  },
  {
    id: "fortune_sunlite",
    name: "Fortune Sunlite Refined Sunflower Oil",
    category: "Edible Oils",
    status: "PARTIAL_COMPLIANCE",
    score: 75,
    image: "/samples/FortuneOil.jpeg",
  },
  {
    id: "bikano_aloo_bhujia",
    name: "Bikano Aloo Bhujia",
    category: "Snacks & Confectionery",
    status: "COMPLIANT",
    score: 100,
    image: "/samples/Aloo_Bhujia_Bikano.jpeg",
  },
];

/**
 * Client-side Safe Image Compression (Mandatory Enhancement 1)
 * Scales large images down to max dimension (~2000px) and compresses to ~500KB
 * while retaining crisp readability for fine print.
 */
export async function compressImage(fileOrDataUrl, maxDimension = 2000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(fileOrDataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(fileOrDataUrl);
            return;
          }
          const compressedFile = new File([blob], "compressed_inspection.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve({ file: compressedFile, dataUrl, width, height, size: blob.size });
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = (err) => reject(err);

    if (typeof fileOrDataUrl === "string") {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Offline Draft Queue via IndexedDB (Mandatory Enhancement 4)
 */
const DB_NAME = "ParakhAIOfflineDB";
const STORE_NAME = "inspection_drafts";

function openDraftsDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineDraft(draft) {
  try {
    const db = await openDraftsDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const record = {
        ...draft,
        id: draft.id || `draft-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        queued_at: new Date().toISOString(),
        sync_status: "QUEUED",
      };
      store.put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("Failed to persist offline draft:", err);
    return null;
  }
}

export async function getOfflineDrafts() {
  try {
    const db = await openDraftsDB();
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeOfflineDraft(id) {
  try {
    const db = await openDraftsDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}
