/** 时间戳格式化为 yyyy-MM-dd HH:mm:ss */
function formatTime(timestamp) {
  if (timestamp == null || timestamp === "") return "";
  const n = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
  if (Number.isNaN(n)) return "";
  const date = new Date(n);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

module.exports = {
  formatTime
};
