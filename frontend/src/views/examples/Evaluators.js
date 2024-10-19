import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { getAllEvaluators } from "store/actions/evaluatorAction";
import { Link } from "react-router-dom";

const AllEvaluators = (props) => {
  const dispatch = useDispatch();
  const evaluators = useSelector((state) => state.evaluator.evaluators);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    dispatch(getAllEvaluators());
  }, [dispatch]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">All Evaluators</h3>
                  </div>
                  <div className="col text-right">
                    {/* <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button> */}
                  </div>
                </Row>
              </CardHeader>
              {evaluators && (
                <>
                  {" "}
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Evaluator Id</th>
                        <th scope="col">Evaluator Name</th>
                        <th scope="col">Evaluator department</th>
                        <th scope="col">Evaluator's Email</th>

                        {/* <th scope="col">Assign Groups</th> */}
                      </tr>
                    </thead>

                    {evaluators.map((p) => {
                      return (
                        <>
                          <tbody key={p._id}>
                            <tr>
                              <th scope="row">{p.evaluatorId}</th>
                              <th> {p.evaluatorName}</th>
                              <td>{p.department}</td>
                              <td>{p.email}</td>

                              <td>
                                {/* <button className="btn bg-yellow text">
                                  {" "}
                                  Assign
                                </button> */}
                                {/* <button></button> */}
                                {/* <i className="fas fa-arrow-up text-success mr-3" /> 46,53% */}
                              </td>
                            </tr>
                          </tbody>
                        </>
                      );
                    })}
                  </Table>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AllEvaluators;
