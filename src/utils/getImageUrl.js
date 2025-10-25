export default function getImageUrl(images) {
  let imgUrl = "/placeholder.png";

  try {
    if (!images) return imgUrl;

    if (typeof images === "string") {
      if (images.trim().startsWith("[")) {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imgUrl = parsed[0];
        }
      } else {
        imgUrl = images;
      }
    } else if (Array.isArray(images) && images.length > 0) {
      let first = images[0];
      if (typeof first === "string" && first.trim().startsWith("[")) {
        const parsed = JSON.parse(first);
        if (Array.isArray(parsed) && parsed.length > 0) {
          first = parsed[0];
        }
      }
      imgUrl = first;
    }

    if (typeof imgUrl === "string") {
      imgUrl = imgUrl.replace(/^"+|"+$/g, "").trim();

      // ✅ Use env base URL only for relative paths (like /uploads/xyz.png)
      if (!imgUrl.startsWith("http")) {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        imgUrl = `${baseURL}${imgUrl.startsWith("/") ? imgUrl : "/" + imgUrl}`;
      }
    }

    // ❌ Don’t force corsproxy or HTTPS locally — it blocks loading
    // ✅ Optional: only use HTTPS replacement in production
    if (import.meta.env.MODE === "production" && imgUrl.startsWith("http://")) {
      imgUrl = imgUrl.replace("http://", "https://");
    }

  } catch (err) {
    console.error("getImageUrl error:", err);
    imgUrl = "/placeholder.png";
  }

  return imgUrl;
}
