import { Button, Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";

const UserHeader = () => {
  const user = useSelector((state) => state.user.userData);
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage:
            "url(" + require("../../assets/img/photos/DSC_0007-01.jpeg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              {user && (
                <>
                  {user.userType === 0 && (
                    <h1 className="display-2 text-white">
                      Hello Student {user.userName}
                    </h1>
                  )}
                  {user.userType === 1 && (
                    <h1 className="display-2 text-white">
                      Hello Evaluator {user.userName}{" "}
                    </h1>
                  )}
                  {user.userType === 2 && (
                    <h1 className="display-2 text-white">
                      Hello Admin {user.userName}{" "}
                    </h1>
                  )}
                </>
              )}

              {/* <p className="text-white mt-0 mb-5">your brief Description</p> */}
              {/* <Button
                color="info"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Edit profile
              </Button> */}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
