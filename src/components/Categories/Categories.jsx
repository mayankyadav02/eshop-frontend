import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Categories({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        // Clean quotes from names and map ID → name
        const cleaned = data.map((cat) => ({
          ...cat,
          name: cat.name?.replace(/"/g, ""),
        }));
        setCategories(cleaned);
      })
      .catch((err) => console.error("Categories fetch error:", err));
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(categories.length, 6), // max 6 slides visible
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Slider {...settings}>
        {categories.map((cat) => (
          <div key={cat._id} style={{ padding: "0 8px" }}>
            <Card>
              <CardActionArea
                onClick={() => {
                  // Optionally notify parent about selected category
                  if (onCategorySelect) onCategorySelect(cat);
                  navigate(`/category/${cat._id}`);
                }}
              >
                <img
                  src={`/assets/categories/${cat._id}.jpg`} // map images by ID
                  alt={cat.name}
                  style={{ width: "100%", height: 120, objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/placeholder.png")} // fallback
                />
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    {cat.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}
