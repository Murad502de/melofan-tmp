import React from "react";
import {Modal} from "react-bootstrap";
import {useSelector} from "react-redux";

export default props => {
	const nameTheme = useSelector(state => state.themeCabinet.name);

	return (
		<Modal show={props.show} onHide={props.handleClose} centered className={`${nameTheme+'__modal'} modalCabinet`} backdrop="static">
			<Modal.Header className="pb-0" closeButton>
				<Modal.Title />
			</Modal.Header>
			<Modal.Body>{props.textQuestion}</Modal.Body>
			<Modal.Footer>
				<button
					className="btn-main"
					onClick={() => {
						props.handleClose();
						props.functionApply();
					}}>
					{props.textButtonApply}
				</button>
				<button className="btn-outline" onClick={props.handleClose}>
					{props.textButtonCancel}
				</button>
			</Modal.Footer>
		</Modal>
	);
};
