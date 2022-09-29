import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { Table, Col } from "reactstrap";
import axios from "axios";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "contexts/constans";
import ReactToPrint from "react-to-print";
import NotificationAlert from "react-notification-alert";

const CreateOrder = () => {
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [product, setProduct] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [loaikhach, setLoaiKhach] = React.useState(1);
  const [soLuong, setSoLuong] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState("");
  const [orderFor, setOrderFor] = React.useState("");
  const [tongcong, setTongCong] = React.useState(0);
  const [tongcongSL, setTongCongSL] = React.useState(0);

  const componentRef = useRef();
  const notificationAlert = React.useRef();

  const reset = () => {
    setLoaiKhach(1);
    setOrders([]);
    setSoLuong(0);
    setOrderBy("");
    setOrderFor("");
    setTongCong(0);
    setTongCongSL(0);
  };
  React.useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/product/all `);
      if (res.data.success) {
        setProducts([...res.data.products]);
        mapingOptions([...res.data.products]);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    reMappingPrice(loaikhach);
  }, [loaikhach]);
  const onChange = (e, product) => {
    setProduct(product);
  };
  const reMappingPrice = () => {
    if (!orders?.length) return;
    let tong = 0;
    let tongSL = 0;
    const newOrders = orders.map((od) => {
      od.price = +od[`price${loaikhach}`];
      od.tongGia = +od.price * +od.soLuong;
      tong += od.tongGia;
      tongSL += od.soLuong;
      return od;
    });
    setTongCong(tong);
    setTongCongSL(tongSL);

    setOrders([...newOrders]);
  };
  const mapingOptions = (products = []) => {
    if (!products.length) return;
    let options = [];
    products.forEach((product) => {
      options.push({
        label: product?.productName,
        key: product._id,
      });
    });
    setOptions(options);
  };
  const handleChange = (prop) => (event) => {
    setSoLuong(event.target.value);
    if (prop == "orderBy") {
      setOrderBy(event.target.value);
    }
    if (prop == "orderFor") {
      setOrderFor(event.target.value);
    }
  };
  const handleChangeSelect = (event) => {
    console.log(event.target.value);
    setLoaiKhach(event.target.value);
  };
  const onAddOrder = () => {
    const sl = +soLuong;
    const sp = product;
    if (sl == 0) return;
    // if exit product in order
    let orderFind = orders.find((od) => {
      return od._id == sp.key;
    });
    if (orderFind) {
      orderFind.soLuong += +sl;
      orderFind.price = orderFind[`price${loaikhach}`];
      orderFind.tongGia = +orderFind.soLuong * +orderFind.price;
      setTongCong(tongcong + orderFind.tongGia);
      setTongCongSL(tongcongSL + orderFind.soLuong);

      // tongcong = tongcong + orderFind.tongGia;
      let newOders = orders.map((ord) => {
        if (ord._id == orderFind._id) {
          ord = { ...orderFind };
        }
        return ord;
      });
      setOrders([...newOders]);
      setProduct("");
      setSoLuong(0);
      notify(`Thêm Sản Phẩm ${orderFind.productName} Thành Công`);
      return;
    }
    //
    let pro = products.find((p) => {
      return p._id == sp.key;
    });

    if (!pro) return;
    pro.soLuong = sl;
    pro.price = pro[`price${loaikhach}`];
    pro.tongGia = +pro.soLuong * +pro.price;
    setTongCong(tongcong + pro.tongGia);
    setTongCongSL(tongcongSL + pro.soLuong);

    // tongcong = tongcong + pro.tongGia;
    setOrders([...orders, pro]);
    setSoLuong(0);
    notify(`Thêm Sản Phẩm ${pro.productName} Thành Công`);
  };

  function currencyFormat(num) {
    return (
      "VND" + " " + num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  }
  const saveOrder = async () => {
    if (!orders.length) return;
    let totalPrice = 0;
    orders.forEach((o) => {
      totalPrice += o.tongGia;
    });

    const order = {
      totalPrice: totalPrice,
      orderBy: orderBy,
      orderFor: orderFor,
      products: [...orders],
    };
    try {
      const response = await axios.post(`${apiUrl}/order/create`, order);
      if (response.data.success) {
        reset();
        notify("Lưu Hóa Đơn Thành Công");
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const notify = (messages) => {
    var type = "success";
    var options = {};
    options = {
      place: "tr",
      message: (
        <div>
          <div>
            <span>{messages}</span>
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 1,
    };
    notificationAlert.current.notificationAlert(options);
  };
  return (
    <div className="content">
      <NotificationAlert ref={notificationAlert} />
      <div className="form">
        <Col className="row">
          <Col md="4">
            <Autocomplete
              disablePortal
              onChange={onChange}
              id="combo-box"
              options={options}
              renderInput={(params) => (
                <TextField {...params} label="Tên Sản Phẩm" />
              )}
            />
          </Col>
          <Col md="4">
            <FormControl fullWidth variant="standard">
              <TextField
                id="outlined-adornment-amount"
                value={soLuong}
                onChange={handleChange("soluong")}
                label="Số Lượng"
                type="number"
                variant="outlined"
              />
            </FormControl>
          </Col>
          <Col md="4">
            <Button
              onClick={() => onAddOrder()}
              size="large"
              variant="contained"
            >
              Add
            </Button>
          </Col>
        </Col>
        <Col
          md="12"
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginTop: "50px",
            borderTop: "solid",
          }}
        >
          <div className="col-md-3">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Loại Khách</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={loaikhach}
                label="LoaiKhach"
                onChange={handleChangeSelect}
              >
                <MenuItem value={1}>Loại 1</MenuItem>
                <MenuItem value={2}>Loại 2</MenuItem>
                <MenuItem value={3}>Loại 3</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mr-2">
            <ReactToPrint
              trigger={() => (
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="large"
                >
                  {"In Hóa Đơn"}
                </Button>
              )}
              onAfterPrint={saveOrder}
              content={() => componentRef.current}
            />
          </div>
          <div>
            <Button
              color="success"
              variant="contained"
              onClick={saveOrder}
              sx={{ mt: 3, mb: 2 }}
              size="large"
            >
              {"Lưu Hóa Đơn"}
            </Button>
          </div>
        </Col>

        <div ref={componentRef} md="12">
          <Table id="orderTable" style={{ overflow: "unset" }}>
            <thead className="text-default">
              <tr>
                <th>TT</th>
                <th>TÊN HÀNG</th>
                <th>SỐ LƯỢNG</th>
                <th>GIÁ</th>
                <th>THÀNH TIỀN</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((product, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product?.productName} </td>
                      <td>{product.soLuong}</td>
                      <td> {currencyFormat(product?.price)}</td>
                      <td>{currencyFormat(product?.tongGia)}</td>
                    </tr>
                  );
                })}
              {tongcong > 0 && (
                <>
                  <tr>
                    <td></td>
                    <td>TỔNG CỘNG </td>
                    <td>{tongcongSL} </td>
                    <td></td>
                    <td>{currencyFormat(tongcong)}</td>
                  </tr>
                  <br />
                  <tr>
                    <td colSpan={2}>
                      <div md="3">
                        <TextField
                          onChange={handleChange("orderFor")}
                          id="orderFor"
                          value={orderFor}
                          label="Khách Hàng"
                          variant="standard"
                          fullWidth
                        />
                      </div>
                    </td>
                    <td> </td>
                    <td></td>
                    <td>
                      <div className="mr-2" md="3">
                        <TextField
                          onChange={handleChange("orderBy")}
                          id="orderBy"
                          value={orderBy}
                          label="Người Bán Hàng"
                          variant="standard"
                          fullWidth
                        />
                      </div>
                    </td>
                  </tr>
                  <br />
                  <br />
                  <tr style={{ textAlign: "center" }}>
                    <td colSpan={5}>
                      Cảm Ơn Quý Khách Đã Tin Tưởng TRÙM ĂN VẶT
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
