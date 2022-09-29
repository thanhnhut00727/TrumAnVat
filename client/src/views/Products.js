import { CardActions } from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";
import React from "react";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "contexts/constans";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";
// reactstrap components
function Products() {
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/product/all `);
      if (res.data.success) {
        setProducts([...res.data.products]);
      }
    } catch (error) {}
  };
  const readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then(async (data) => {
      await axios.post(`${apiUrl}/product/addList`, [...data]);
    });
  };
  return (
    <React.Fragment>
      <div className="content">
        <Col md="12">
          <Card>
            <CardHeader
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <CardTitle tag="h4">Danh Sách Sản Phẩm</CardTitle>
              <CardActions>
                <Button variant="contained" component="label">
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      readExcel(file);
                    }}
                    type="file"
                  />
                </Button>
              </CardActions>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>MÃ VẠCH ( BARCODE)</th>
                    <th>TÊN HÀNG</th>
                    <th>NGÀNH HÀNG</th>
                    <th>MÃ HÀNG</th>
                    <th>TÌNH TRẠNG</th>
                    <th>ĐƠN VỊ TÍNH GRAM (G)</th>
                    <th>ĐƠN GIÁ NIÊM YẾT (VND)</th>
                    <th>GIÁ HÀNG XÁ (1KG)</th>
                    <th>Notes</th>
                    <th>Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {products &&
                    products.map((product, index) => {
                      return (
                        <tr key={index}>
                          <td>{product?.barCode}</td>
                          <td>{product?.productName} </td>
                          <td>{product?.productType}</td>
                          <td>{product?.productCode}</td>
                          <td>{product?.status}</td>
                          <td>{product?.unit}</td>
                          <td> {product ? `VND ${product?.price}` : ""}</td>
                          <td>{product ? `VND ${product?.giahangxa}` : ""}</td>
                          <td>{product?.notes}</td>
                          <td>
                            <a href="#">{product?.photo}</a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </div>
    </React.Fragment>
  );
}

export default Products;
