import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NestedApi.css";
const Api = () => {
  const [data, setData] = useState({
    name: "",
    price: "",
    cat: "",
    cmp: "",
  });
  const [products, setProducts] = useState([]);

  async function productData() {
    try {
      const response = await axios.get(
        "https://mejevo.pythonanywhere.com/product/"
      );
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Erro Fetching Details", error);
    }
  }

  useEffect(() => {
    productData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data.id);
    try {
      if (data.id) {
        await axios.put(
          `https://mejevo.pythonanywhere.com/product/${data.id}/`,
          data
        );
        alert("Product updated successfully!");
      } else {
        await axios.post("https://mejevo.pythonanywhere.com/product/", data);
        alert("Product added successfully!");
      }

      setData({
        id: "",
        name: "",
        price: "",
        cat: "",
        cmp: "",
      });

      productData();
    } catch (error) {
      console.error("Error updating or creating product:", error);
    }
  };

  const handleUpdate = async (product) => {
    setData(product);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `https://mejevo.pythonanywhere.com/product/${productId}/`
      );
      alert(`Product deleted successfully!`);
      productData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      for (const product of products) {
        await axios.delete(
          `https://mejevo.pythonanywhere.com/product/${product.id}/`
        );
      }
      alert("All product deleted successfully!");
      setProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="please enter name"
              name="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="name">Price</label>
            <input
              type="text"
              placeholder="please enter price"
              name="price"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="name">Category</label>
            <select
              id="cat"
              name="cat"
              onChange={(e) => setData({ ...data, cat: e.target.value })}
              value={data.cat}
            >
              <option value="">Select.....</option>
              <option value="Mobile">Mobile</option>
              <option value="Laptop">Laptop</option>
              <option value="Television">Television</option>
              <option value="Cooler">Cooler</option>
              <option value="AC">AC</option>
            </select>
          </div>
          <div>
            <label htmlFor="name">Company</label>
            <input
              type="text"
              placeholder="please enter company"
              name="cmp"
              value={data.cmp}
              onChange={(e) => setData({ ...data, cmp: e.target.value })}
            />
          </div>
          <button type="submit">
            {data.id ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Company</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr key={i}>
              <td>{1 + i}</td>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.cat}</td>
              <td>{product.cmp}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleUpdate(product)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
      <br />
      <button
        className="btn btn-danger mt-3"
        onClick={handleDeleteAll}
        disabled={products.length === 0}
      >
        Delete All Customers
      </button>
    </>
  );
};

export default Api;
