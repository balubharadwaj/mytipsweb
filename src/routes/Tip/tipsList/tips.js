import React, { PropTypes } from 'react';
import axios from 'axios';
import { Button, Label } from 'react-bootstrap';
import Tip from '../viewTip/viewTip'
var Highlight = require('react-highlight');
import history from '../../../core/history';
import Pagination from '../Pagination';



class Tips extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }
    handleClick(e) {
        var tip = { "title": e.title };
        window.sessionStorage.setItem("tip", JSON.stringify(e));

    }

    // viewcomments(e) {
    //     return (
    //         <div>
    //             <Tip items={e}/>
    //         </div>
    //     )
    // }

    state = {
        tips: [],
        loading: true,
        error: null,
        pageOfItems: []

    }

    componentDidMount() {

        axios.get('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/all/tips')
            .then(res => {
                const tips = res.data;
                this.setState({
                    tips,
                    loading: false,
                    error: null,
                    exampleItems: tips,
                    pageOfItems: []
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: err
                })
            })
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }


    renderLoading() {
        return (
            <div className="spinner">
                <div className="cube1"></div>
                <div className="cube2"></div>
            </div>
        )
    }

    renderError() {
        return (
            <div>some thing went wrong: {this.state.error.message}</div>
        )
    }

    change(event) {
        if (event.target.value) {
            var url = "http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/" + event.target.value + "/searchTips"
        }
        else {
            var url = "http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/all/tips";
        }
        axios.get(url)
            .then(res => {
                // Transform the raw data by extracting the nested posts1
                const tips = res.data;
                // Update state to trigger a re-render.
                // Clear any errors, and turn off the loading indiciator.
                this.setState({
                    tips,
                    error: null,
                });
            })
            .catch(err => {
                // Something went wrong. Save the error in state and re-render.
                this.setState({
                    error: err
                });
            });
    }



    render() {
        const { error, tips, loading, pageOfItems } = this.state;
        if (loading) {
            return this.renderLoading();
        }
        else {
            return (
                <div>

                    <div className="tipsContainer container">
                        <div className="search">

                        <i className="fa fa-search" aria-hidden="true"></i>
                        <input type="text" placeholder="Search For Tip" onChange={this.change.bind(this)} />
                        
                        <div className="clear"></div>
                        </div>
                       
                        {pageOfItems.map((tip, index) => {
                            return (

                                <div className="col-md-4" key={index}>
                                    <div className="tip">
                                        <div className="image" style={{ backgroundImage: "url(" + tip.images + ")" }}>
                                        </div>
                                        {/* <img src={tip.images} alt={tip.title}/>    */}
                                        <div className="imageDetails">
                                            <div>
                                                <h3>{tip.title}</h3>
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
                                                }}>View Post...</Button>
                                        </div>
                                    </div>
                                </div>

                            )


                        })}
                        <div className="clear"></div>
                        <Pagination items={tips} onChangePage={this.onChangePage} />

                    </div>

                </div>
            )
        }
    }



}

export default Tips;