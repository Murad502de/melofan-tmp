import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Faq = () => {
	return (
		<div className="content faq">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<h4 className="content__title">FAQ</h4>
					</Col>
				</Row>
				<Row>
					<Col lg={12}>
						<div className="wrapper-box">
							<Accordion className="landing-accordions">
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header">
									<Typography>Заголовок 1</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
										lacus ex, sit amet blandit leo lobortis eget.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion className="landing-accordions">
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel3a-content"
									id="panel2a-header">
									<Typography>Заголовок 2</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
										lacus ex, sit amet blandit leo lobortis eget.
									</Typography>
								</AccordionDetails>
							</Accordion>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Faq;
