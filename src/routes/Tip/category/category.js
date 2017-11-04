import React, { PropTypes } from 'react';
import axios from 'axios';
import { Grid, Row, Col, Image, Button, Label } from 'react-bootstrap';
import history from '../../../core/history';



class Category extends React.Component {
	// React components are simple functions that take in props and state, and render HTML
	constructor(props) {
		super(props);
		//	this.renderLoading = this.renderLoading.bind(this);
		this.handleClick = this.handleClick.bind(this);

	}

	state = {
		posts1: [],
		ctips: [],
		loading: true,
		error: null,
		setTip: false
	}

	componentDidMount() {

		// Remove the 'www.' to cause a CORS error (and see the error state)
		axios.get(`http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/category/list/all`)
			.then(res => {
				// Transform the raw data by extracting the nested posts1
				const posts1 = res.data;
				// Update state to trigger a re-render.
				// Clear any errors, and turn off the loading indiciator.
				this.setState({
					posts1,
					loading: false,
					error: null,
					setTip: false
				});
			})
			.catch(err => {
				// Something went wrong. Save the error in state and re-render.
				this.setState({
					loading: false,
					error: err
				});
			});
	}



	renderLoading() {
		return (<div className="spinner">
			<div className="cube1"></div>
			<div className="cube2"></div>
		</div>)
	}

	renderError() {
		return (

			<div>
				Something went wrong: {this.state.error.message}
			</div>
		);
	}

	handleClick(e) {
		axios.get("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/" + e.id + "/categoryTips")
			.then(res => {
				// Transform the raw data by extracting the nested posts1
				const ctips = res.data;
				// Update state to trigger a re-render.
				// Clear any errors, and turn off the loading indiciator.
				this.setState({
					ctips,
					setTip: true,
					loading: false,
					error: null
				});
			})
			.catch(err => {
				// Something went wrong. Save the error in state and re-render.
				this.setState({
					loading: false,
					error: err
				});
			})
	}

	handleClick1(e) {
		var tip = { "title": e.title };
		window.sessionStorage.setItem("tip", JSON.stringify(e));
	}


	render() {
		const { error, posts1, loading, ctips, setTip } = this.state;
		if (loading) {
			return this.renderLoading();
		}

		if (setTip) {
			return (
				<div className="tipsContainer container">
					{ctips.map((tip, index) => {
						return (
							<div className="col-md-4" key={index}>
								<div className="tip">
									<div className="image" style={{ backgroundImage: "url(" + tip.images + ")" }}>
									</div>
									{/* <img src={tip.images} alt={tip.title}/>    */}
									<div className="imageDetails">
										<div>
											<h3 >{tip.title}</h3>
										</div>
										<table>
											<tbody >
												<tr>
													<td><label>category:</label> {tip.category}</td>
													{tip.comments ?
														<td ><label><i className="fa fa-comment-o" aria-hidden="true"></i>: <Label>{tip.comments.length}</Label></label> </td>
														: <td ><label><i className="fa fa-comment-o" aria-hidden="true"></i>: 0</label></td>}


												</tr>
												<tr>
													<td><label><i className="fa fa-smile-o" aria-hidden="true"></i>:</label> <Label>{tip.likes.length}</Label></td>
													<td><label><i className="fa fa-heart" aria-hidden="true"></i>:</label> <Label>{tip.favourites.length}</Label></td>
												</tr>
											</tbody>
										</table>
										<Button bsStyle="primary" bsSize="large" active
											onClick={(e) => {
												e.preventDefault(); history.push('/tipDetails'); this.handleClick(tip);
											}}>View Post</Button>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)
		}
		else {
			return (
				<div className="categoryContainer container">
				
					{posts1.map((tip, index) => {
						return (
							<div className="col-md-2" key={index}>
							<div className="category">
								  <div className="image" onClick={(e) => this.handleClick(tip, e)} style={{ backgroundImage: "url(" + tip.imageURL + ")" }}>
									</div>
								{/* <Image src={tip.imageURL} onClick={(e) => this.handleClick(tip, e)} thumbnail /> */}
								<h2>{tip.name}</h2>
							</div>
							</div>
						)
					})}
				
				</div>
			);
		}
	}
}

export default Category;