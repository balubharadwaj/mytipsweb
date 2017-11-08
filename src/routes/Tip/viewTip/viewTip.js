import React, { PropTypes } from 'react';
import { Button, Label, Media } from 'react-bootstrap';
var Highlight = require('react-highlight');
import axios from 'axios';
var _ = require('lodash')



class Tip extends React.Component {

    constructor(props) {
        super(props);
        this.makeFovourite = this.makeFovourite.bind(this);
        //this.viewtip();
    }

    state = {
        comment: [],
        error: null,
        userData: [],
        postComment: [],
        likes: [],
        initfavourite: []
    }

    componentDidMount() {
        var userData = sessionStorage.getItem("login")
        userData = JSON.parse(userData)
        this.setState({
            userData
        })
        this.viewtip()

    }



    viewtip(e) {
        var tip = JSON.parse(window.sessionStorage.getItem("tip"));
        axios.get("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/" + tip.id + "/listComments")
            .then(res => {
                const comment = res.data;
                this.setState({
                    comment,
                    error: null,

                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: err
                })
            })
    }

    makeFovourite() {
        var tip = JSON.parse(window.sessionStorage.getItem("tip"));
        var a = []
        a = sessionStorage.getItem("login")
        a = JSON.parse(a);
        var b = []
        b.push(a)
        axios.post("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/favorite/" + tip.id + "/" + b[0].id)
            .then(res => {
                const likes = res.data;
                this.setState({
                    likes,
                    error: null,

                });
            })
            .catch(err => {
                this.setState({
                    error: err
                })
            })
    }

    handleKeyPress(event) {
        var tip = JSON.parse(window.sessionStorage.getItem("tip"));
        const { userData } = this.state
        if (userData != null) {
            if (event.key === 'Enter') {
                var data = {
                    commentText: event.target.value,
                    userId: userData.id,
                }
                event.target.value = ' '
                axios.post("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/add/" + tip.id + "/comment", data)
                    .then(res => {
                        const postComment = res.data;
                        this.setState({
                            postComment,
                            error: null,

                        });
                        this.viewtip()
                    })
                    .catch(err => {
                        this.setState({
                            loading: false,
                            error: err
                        })
                    })

            }
        } else {
            alert("please login to Comment")
        }

    }

    getFovourite() {

        var a = []
        a = sessionStorage.getItem("login")
        a = JSON.parse(a);
        var b = []
        b.push(a)
        axios.get("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/" + b[0].id + "/favourites")
            .then(res => {
                const initfavourite = res.data;

                this.setState({
                    initfavourite,
                    error: null,
                });
            })
            .catch(err => {
                this.setState({
                    error: err
                })
            })

    }

    render() {
        var tip = JSON.parse(window.sessionStorage.getItem("tip"));
        const { comment, userData, likes, initfavourite } = this.state;
        let comment1 = comment.sort((a, b) => new Date(...b.createdAt.split('/').reverse()) - new Date(...a.createdAt.split('/').reverse()));
        return (
            <div>
                <div className="viewtipContainer container">

                    <div className="tip">
                        <div className="col-md-8">
                            <div className="viewTip">
                                {/* <div>
                                    <h3>{tip.title}</h3>                                    
                            </div>   */}
                                {/* <div className="image" style={{ backgroundImage: "url(" + tip.images + ")" }}>
                            </div>                                                     */}
                                <img className="viewimage" src={tip.images} alt={tip.title} />
                                <div className="clearfix"></div>
                                {likes.favourite ?
                                    <i className="fa fa-heart" aria-hidden="true" onClick={this.makeFovourite}></i> :
                                    <i className="fa fa-heart-o" aria-hidden="true" onClick={this.makeFovourite}></i>
                                }
                                <div className="PostDetails">
                                    <table>
                                        <tbody>

                                            <tr>
                                                <td><label>category:</label> {tip.category}</td>
                                                {tip.comments ?
                                                    <td ><label>comments: <Label>{tip.comments.length}</Label></label> </td>
                                                    : <td ><label>comments: 0</label></td>}

                                            </tr>
                                            <tr>
                                                <td><label>Likes:</label> <Label>{tip.likes.length}</Label></td>
                                                <td><label>favourites:</label> <Label>{tip.favourites.length}</Label></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Highlight innerHTML={true} className='language-name-of-snippet'>
                                        {tip.description}
                                    </Highlight>
                                    <h2>Comments:</h2>
                                    <div className="comments container-fluid">

                                        <div className="commemtAdd">
                                            <div className="row">

                                                <div className="col-md-1">
                                                    {userData ?
                                                        <img width={64} height={64} src={userData.profilePic} alt="Image" /> :
                                                        <img width={64} height={64} src="http://ieee.ece.ufl.edu/img/profile-pics/default_person.png" alt="Image" />
                                                    }
                                                </div>
                                                <div className="col-md-11">
                                                    <textarea cols="80" type="text" onKeyPress={this.handleKeyPress.bind(this)}></textarea>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                        </div>

                                        {

                                            comment1.map((comments, index) => {
                                                return (<div key={index}>
                                                    <div className="commentsList">
                                                        <div className="row">
                                                            <div className="col-md-1">
                                                                {comments.user ?
                                                                    <img width={64} height={64} src={comments.user.image} alt="Image" /> :
                                                                    <img width={64} height={64} src="http://ieee.ece.ufl.edu/img/profile-pics/default_person.png" alt="Image" />
                                                                }
                                                            </div>
                                                            <div className="col-md-11 commentListText">
                                                            
                                                                {comments.user ?
                                                                    <Media.Heading>{comments.user.firstName}</Media.Heading> : <Media.Heading>user name</Media.Heading>
                                                                }
                                                                <p>{comments.commentText}</p>
                                                                <span>{new Date(comments.createdAt).toDateString()}</span>
                                                                {comments.replyComments ?
                                                                    <div> {
                                                                        comments.replyComments.map((rc, index1) => {
                                                                            return (<Media key={index1}>
                                                                                <Media.Left>
                                                                                    <img width={64} height={64} src="http://ieee.ece.ufl.edu/img/profile-pics/default_person.png" alt="Image" />
                                                                                </Media.Left>
                                                                                <Media.Body>
                                                                                    {comments.user ?
                                                                                        <Media.Heading>{rc.user.firstName}</Media.Heading> : <div />
                                                                                    }
                                                                                    <p>{rc.commentText}</p>
                                                                                </Media.Body>
                                                                            </Media>)
                                                                        })
                                                                    }
                                                                    </div> : <div />
                                                                }
                                                            </div>
                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </div>
                                                </div>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        )
    }


}


export default Tip;