import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // Fetch Orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Handle Status Change
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Layout title="All Orders">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h2 className="mb-4">All Orders</h2>

            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map((o, i) => (
                <div key={o._id} className="border shadow rounded-3 p-3 mb-4">
                  {/* Order Header */}
                  <div className="row text-center fw-bold bg-light py-2 rounded">
                    <div className="col"># {i + 1}</div>
                    <div className="col">
                      <Select
                        defaultValue={o.status}
                        style={{ width: 150 }}
                        onChange={(value) => handleChange(o._id, value)}
                      >
                        {status.map((s, idx) => (
                          <Option key={idx} value={s}>
                            {s}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="col">Buyer: {o.buyer?.name}</div>
                    <div className="col">
                      Date: {moment(o.createdAt).format("MMMM Do YYYY, h:mm a")}
                    </div>
                    <div className="col">
                      Payment: {o.payment?.success ? "✅ Success" : "❌ Failed"}
                    </div>
                    <div className="col">Quantity: {o.products.length}</div>
                  </div>

                  {/* Order Products */}
                  <div className="mt-3">
                    {o.products.map((p) => (
                      <div
                        key={p._id}
                        className="d-flex align-items-center border rounded p-2 mb-2"
                      >
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            marginRight: "15px",
                          }}
                        />
                        <div>
                          <h6>{p.name}</h6>
                          <p>{p.description?.substring(0, 50)}...</p>
                          <p>
                            <b>Price:</b> ₹{p.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
