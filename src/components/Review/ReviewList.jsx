// src/components/ReviewList.jsx
import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Rating,
  Divider,
} from "@mui/material";

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Reviews fetch error:", err));
  }, [productId]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <Typography variant="h6" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((r) => (
          <Card key={r._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {r.user?.name || "Anonymous"}
              </Typography>
              <Rating value={r.rating} readOnly size="small" />
              <Typography variant="body2">{r.comment}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No reviews yet 😔</Typography>
      )}
      <Divider sx={{ mt: 2 }} />
    </div>
  );
}
