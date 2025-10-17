export default function getImageUrl(images) {
  let imgUrl = "/placeholder.png";

  try {
    if (!images) return imgUrl;

    // ✅ CASE 1: If it's a string
    if (typeof images === "string") {
      // if it looks like a JSON array string
      if (images.trim().startsWith("[")) {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imgUrl = parsed[0];
        }
      } else {
        imgUrl = images;
      }
    }

    // ✅ CASE 2: If it's an array
    else if (Array.isArray(images) && images.length > 0) {
      let first = images[0];

      // if first element is a JSON-stringified array
      if (typeof first === "string" && first.trim().startsWith("[")) {
        const parsed = JSON.parse(first);
        if (Array.isArray(parsed) && parsed.length > 0) {
          first = parsed[0];
        }
      }

      imgUrl = first;
    }

    // ✅ Clean up quotes if present accidentally
    if (typeof imgUrl === "string") {
      imgUrl = imgUrl.replace(/^"+|"+$/g, "").trim(); // remove extra quotes

      // prepend localhost if not full http url
      if (!imgUrl.startsWith("http")) {
        imgUrl = `http://localhost:5000${imgUrl.startsWith("/") ? imgUrl : "/" + imgUrl}`;
      }
    }
  } catch (err) {
    console.error("getImageUrl error:", err);
    imgUrl = "/placeholder.png";
  }

//   // Force HTTPS to avoid mixed content block
// if (imgUrl.startsWith("http://")) {
//   imgUrl = imgUrl.replace("http://", "https://");
// }

// // Optional CORS proxy fallback if image load fails
// if (!imgUrl.includes("corsproxy.io")) {
//   imgUrl = `https://corsproxy.io/?${encodeURIComponent(imgUrl)}`;
// }


  return imgUrl;
}
