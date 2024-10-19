import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6"></Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem></NavItem>

            <NavItem></NavItem>

            <NavItem></NavItem>

            <NavItem></NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
