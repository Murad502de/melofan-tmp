import React, {Component} from "react";
import {Pagination as Pgn} from "react-bootstrap";
import PropTypes from "prop-types";

const propTypes = {
	countRows: PropTypes.number,
	countPerPage: PropTypes.number,
	currentPage: PropTypes.number,
	changeCurrentPage: PropTypes.func,
};

class Pagination extends Component {
	onClickPage = (e, numPage) => {
		e.preventDefault();

		this.props.changeCurrentPage(numPage);
	};

	onClickButtonBack = (e, currentPage, isStartPage) => {
		if (!isStartPage) {
			this.props.changeCurrentPage(currentPage - 1);
		}
	};
	onClickButtonNext = (e, currentPage, isEndPage) => {
		if (!isEndPage) {
			console.log(isEndPage);
			this.props.changeCurrentPage(currentPage + 1);
		}
	};

	render() {
		let {countRows, countPerPage, currentPage} = this.props;

		let arrayPage = [];
		let countPage = countRows === 0 ? 1 : Math.ceil(countRows / countPerPage);

		let index = currentPage === 1 || currentPage - 2 <= 1 ? 2 : currentPage - 2;
		let counter = index + 4 >= countPage ? countPage - 1 : index + 4;
		for (index; index <= counter; index++) {
			arrayPage.push(index);
		}

		let isStartPage = currentPage === 1;
		let isEndPage = currentPage === countPage;

		return (
			<Pgn>
				<Pgn.Prev onClick={e => this.onClickButtonBack(e, currentPage, isStartPage)} />
				{currentPage === 1 ? (
					<Pgn.Item active>{1}</Pgn.Item>
				) : (
					<Pgn.Item onClick={e => this.onClickPage(e, 1)}>{1}</Pgn.Item>
				)}
				{countPage > 5 && currentPage > 3 && <Pgn.Item>...</Pgn.Item>}
				{arrayPage.map(page =>
					page === currentPage ? (
						<Pgn.Item key={page} active>
							{page}
						</Pgn.Item>
					) : (
						<Pgn.Item key={page} onClick={e => this.onClickPage(e, page)}>
							{page}
						</Pgn.Item>
					)
				)}
				{countPage > 5 && currentPage < countPage - 3 && <Pgn.Item>...</Pgn.Item>}
				{countPage > 1 &&
					(currentPage === countPage ? (
						<Pgn.Item active>{countPage}</Pgn.Item>
					) : (
						<Pgn.Item onClick={e => this.onClickPage(e, countPage)}>{countPage}</Pgn.Item>
					))}
				<Pgn.Next onClick={e => this.onClickButtonNext(e, currentPage, isEndPage)} />
			</Pgn>
		);
	}
}
Pagination.propTypes = propTypes;

export default Pagination;
