import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { API_URL } from "../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/orders", {
        headers: { Authorization: auth?.token },
      });

      // ✅ Safely handle different response formats
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]); // fallback if no valid array found
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Your Orders">
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* Orders Section */}
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Orders</h1>

            {loading ? (
              <p className="text-center mt-4">Loading orders...</p>
            ) : Array.isArray(orders) && orders.length > 0 ? (
              orders.map((o, i) => (
                <div
                  className="border shadow p-3 mb-4 rounded bg-light"
                  key={o._id || i}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Products Section */}
                  <div className="container">
                    {Array.isArray(o?.products) &&
                      o.products.map((p) => (
                        <div
                          className="row mb-2 p-3 card flex-row align-items-center"
                          key={p._id}
                        >
                          <div className="col-md-4 text-center">
                            <img
                              src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
                              className="card-img-top rounded"
                              alt={p.name}
                              width="100px"
                              height="100px"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="col-md-8">
                            <p className="mb-1 fw-bold">{p.name}</p>
                            <p className="mb-1 text-muted">
                              {p.description.substring(0, 40)}...
                            </p>
                            <p className="mb-0">Price: ₹{p.price}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <h5 className="text-center text-muted mt-4">
                You have no orders yet.
              </h5>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
