export type MediaSelection = {
  url: string;
  path: string;
  fileName: string;
  alt: string;
  width?: number;
  height?: number;
  bytes: number;
};

export function mediaAltFromFileName(fileName: string) {
  const decoded = (() => {
    try { return decodeURIComponent(fileName); }
    catch { return fileName; }
  })();
  const stem = decoded.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return stem || "文章圖片";
}

