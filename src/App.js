import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbx8m0heCyyiq3CrZtecQ7jQQBcw289BmZvmR4relpHq5jzpbEHo37YwOPHQ7S0icl0/exec";

function App() {

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] =
    useState([]);

  const [summary, setSummary] = useState({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("");

  // Fetch products
  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    try {

      const response = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify({
          accessToken: "mysecret123"
        })
      });

      const data = await response.json();

      if (data.success) {

        setProducts(data.products);

        setFilteredProducts(data.products);

        setSummary(data.summary);

      } else {

        setError(data.error);
      }

    } catch (err) {

      console.log(err);

      setError("Failed to fetch data");
    }

    setLoading(false);
  };

  // Search + Filter + Sort
  useEffect(() => {

    let updatedProducts = [...products];

    // Search
    updatedProducts = updatedProducts.filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    // Category Filter
    if (category !== "All") {

      updatedProducts = updatedProducts.filter(
        (item) =>
          item.category === category
      );
    }

    // Sorting
    if (sortBy === "price") {

      updatedProducts.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortBy === "rating") {

      updatedProducts.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sortBy === "priorityScore") {

      updatedProducts.sort(
        (a, b) =>
          b.priorityScore - a.priorityScore
      );
    }

    setFilteredProducts(updatedProducts);

  }, [search, category, sortBy, products]);

  const categories = [
    ...new Set(
      products.map((p) => p.category)
    )
  ];

  // Loading state
  if (loading) {

    return <h2>Loading...</h2>;
  }

  // Error state
  if (error) {

    return <h2>{error}</h2>;
  }

  return (

    <div className="container">

      <h1>
        E-commerce Analytics Dashboard
      </h1>

      {/* Summary Cards */}

      <div className="summary-container">

        <div className="card">

          <h3>Total Products</h3>

          <p>{summary.totalProducts}</p>

        </div>

        <div className="card">

          <h3>Average Price</h3>

          <p>${summary.averagePrice}</p>

        </div>

        <div className="card">

          <h3>Average Rating</h3>

          <p>{summary.averageRating}</p>

        </div>

        <div className="card">

          <h3>Total Categories</h3>

          <p>{summary.totalCategories}</p>

        </div>

      </div>

      {/* Filters */}

      <div className="filters">

        {/* Search */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Category Filter */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="All">
            All Categories
          </option>

          {
            categories.map((cat, index) => (

              <option
                key={index}
                value={cat}
              >
                {cat}
              </option>
            ))
          }

        </select>

        {/* Sort */}

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >

          <option value="">
            Sort By
          </option>

          <option value="price">
            Price
          </option>

          <option value="rating">
            Rating
          </option>

          <option value="priorityScore">
            Priority Score
          </option>

        </select>

      </div>

      {/* Table */}

      {
        filteredProducts.length > 0
          ? (

            <table>

              <thead>

                <tr>

                  <th>Image</th>

                  <th>Title</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Discount %</th>

                  <th>Discounted Price</th>

                  <th>Rating</th>

                  <th>Profit Margin</th>

                  <th>Priority Score</th>

                </tr>

              </thead>

              <tbody>

                {
                  filteredProducts.map(
                    (product) => (

                      <tr key={product.id}>

                        <td>

                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            width="60"
                          />

                        </td>

                        <td>
                          {product.title}
                        </td>

                        <td>
                          {product.category}
                        </td>

                        <td>
                          ${product.price}
                        </td>

                        <td>
                          {
                            product.discountPercentage
                          }%
                        </td>

                        <td>
                          $
                          {
                            product.discountedPrice
                          }
                        </td>

                        <td>
                          {product.rating}
                        </td>

                        <td>
                          {
                            product.profitMargin
                          }%
                        </td>

                        <td>
                          {
                            product.priorityScore
                          }
                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          )
          : (
            <h3>No Products Found</h3>
          )
      }

    </div>
  );
}

export default App;