import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";
import getImageUrl from "../utils/getImageUrl";

export default function CategoryPage() {
  const { idOrSlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${idOrSlug}`);
        const data = await res.json();
        setCategory(data);

        // fetch products of this category
        const prodRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?category=${data._id}`
        );
        const prodData = await prodRes.json();
        setProducts(prodData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [idOrSlug]);

  if (loading) return <div>Loading...</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <Typography variant="h4" gutterBottom>
        {category.name}
      </Typography>

      {products.length === 0 ? (
        <Typography>No products in this category 😔</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(p.images)}
                  alt={p.name}
                  sx={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => window.location.assign(`/product/${p._id}`)}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {p.name}
                  </Typography>
                  <Typography variant="body2">₹{p.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
