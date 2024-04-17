import React, { useEffect, useState } from "react";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const NestedApi = () => {
  const [formData, setFormData] = useState({
    cname: "",
    cemail: "",
    mob: "",
    product: "",
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [readOnlyName, setReadOnlyName] = useState(false);

  const handleUpdate = async (v) => {
    setFormData(v);
    setReadOnlyName(true);
  };

  async function fetchDataCustomer() {
    try {
      const res = await axios.get(
        "https://mihexem7.pythonanywhere.com/customer/"
      );
      setCustomers(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://mejevo.pythonanywhere.com/product/"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchDataCustomer();
  }, []);

  const handleInputChange = (e) => {
    console.log(e.target.value);
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product.id === parseInt(selectedProductId)
    );

    if (selectedProduct) {
      const productUrl = `https://mejevo.pythonanywhere.com/product/${selectedProduct.id}`;
      setFormData({
        ...formData,
        product: productUrl,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.id);
    try {
      if (formData.id) {
        await axios.put(
          `https://mihexem7.pythonanywhere.com/customer/${formData.id}/`,
          formData
        );
        alert(
          `Customer "${formData.cname}" whose id "${formData.id}" updated successfully!`
        );
      } else {
        await axios.post(
          "https://mihexem7.pythonanywhere.com/customer/",
          formData
        );
        alert(`Customer "${formData.cname}" added successfully!`);
      }
      setFormData({
        id: "",
        cname: "",
        cemail: "",
        mob: "",
        product: "",
      });
      fetchDataCustomer();
    } catch (error) {
      console.error("Error updating or creating customer:", error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(
        `https://mihexem7.pythonanywhere.com/customer/${customerId}/`
      );
      alert(`Customer whose id "${customerId}" deleted successfully!`);
      fetchDataCustomer();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      for (const customer of customers) {
        await axios.delete(
          `https://mihexem7.pythonanywhere.com/customer/${customer.id}/`
        );
      }
      alert("All customers deleted successfully!");
      setCustomers([]);
    } catch (error) {
      console.error("Error deleting customers:", error);
    }
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Add Customers
      </h1>

      <div
        style={{
          width: "80%",
          maxWidth: "500px",
          margin: "0 auto",
          border: "1px solid black",
          borderRadius: "6px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSubmit} style={{ padding: "5px" }}>
          <TextField
            label="Name"
            fullWidth
            id="cname"
            name="cname"
            value={formData.cname}
            required
            style={{ marginBottom: "15px" }}
            onChange={(e) =>
              setFormData({ ...formData, cname: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            id="cemail"
            name="cemail"
            value={formData.cemail}
            onChange={(e) =>
              setFormData({ ...formData, cemail: e.target.value })
            }
            required
            style={{ marginBottom: "15px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "15px" }}>
            <InputLabel id="demo-simple-select-label">
              Select a Product
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="product"
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">Select a Product</MenuItem>
              {/* Assume products array is defined */}
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.id} {product.name} {product.price} {product.cat}{" "}
                  {product.cmp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mobile No."
            fullWidth
            type="number"
            id="mob"
            name="mob"
            value={formData.mob}
            onChange={(e) => setFormData({ ...formData, mob: e.target.value })}
            required
            style={{ marginBottom: "15px" }}
          />
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {formData.id ? "Update" : "Add"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <br />
      <br />
      <hr />
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "silver" }}>
            <TableCell>Sr.No.</TableCell>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile No.</TableCell>
            <TableCell>Product URL</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow
              key={customer.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0e0e0", // Alternate row colors
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FF9991"; // Hover color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  index % 2 === 0 ? "#f9f9f9" : "#e0e0e0"; // Restore original color
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.cname}</TableCell>
              <TableCell>{customer.cemail}</TableCell>
              <TableCell>{customer.mob}</TableCell>
              <TableCell>
                <a href={customer.product}>{customer.product}</a>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleUpdate(customer)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(customer.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          className="mt-5"
          onClick={handleDeleteAll}
          disabled={customers.length === 0}
        >
          Delete All Customers
        </Button>
      </div>
    </div>
  );
};

export default NestedApi;
