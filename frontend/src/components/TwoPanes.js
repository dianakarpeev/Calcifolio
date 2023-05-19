import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/** Component that displays one pane on the left and another on the right. */
function TwoPanes({ leftPane, rightPane }) {
  return (
    <div style={{ display: "block", width:"auto", padding: 30 }}>
      <Row>
        <Col xs={10}>{leftPane}</Col>
        <Col xs={2}>
          <h3 style={{textAlign:"left", color:"orange"}}>Last added:</h3>
        {rightPane}
        </Col>
      </Row>
    </div>
  );
}
export default TwoPanes;
