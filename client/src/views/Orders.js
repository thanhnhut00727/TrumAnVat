/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "contexts/constans";
function Orders() {
  const [value, setValue] = React.useState("");
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/order/all `);
      if (res.data.success) {
        setOrders([...res.data.orders]);
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="content">
        <Table id="orderTable" responsive>
          <thead className="">
            <tr>
              <th>TT</th>
              <th>Tên Người Mua</th>
              <th>Tổng Cộng</th>
              <th>Tên Người Tạo</th>
              <th>Ngày Tạo</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order?.orderFor} </td>
                    <td>{order?.totalPrice}</td>
                    <td> {order?.orderBy}</td>
                    <td>{order?.CreateAt}</td>
                    <td>
                      <Button
                        onClick={() => alert("ToDO")}
                        size="large"
                        variant="contained"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default Orders;
