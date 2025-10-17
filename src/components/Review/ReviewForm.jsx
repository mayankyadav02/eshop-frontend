// src/components/ReviewForm.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

export default function ReviewForm({ productId, userToken }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // protect middleware ke liye
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setMessage("Review submitted ✅");
      setRating(0);
      setComment("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Write a Review</Typography>
      <Rating
        value={rating}
        onChange={(e, newVal) => setRating(newVal)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Comment"
        fullWidth
        multiline
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
      {message && (
        <Typography color="primary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
