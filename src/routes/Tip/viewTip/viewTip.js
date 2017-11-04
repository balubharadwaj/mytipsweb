import React, { PropTypes } from 'react';
import {Button, Label, Media} from 'react-bootstrap';
var Highlight = require('react-highlight');
import axios from 'axios';



class Tip extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.viewtip = this.viewtip.bind(this);
    //     this.viewtip();
    // }

    state = {
        comment: [],
        error: null,
    }

    // componentWillMount() {
        
    //     this.makeFourite()
    // }

    viewtip(e) {
        var tip =   JSON.parse(window.sessionStorage.getItem("tip"));        
        axios.get("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/"+tip.id+"/listComments")
        .then(res => {
            const comment =  res.data;
            console.log(comment)
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

    // makeFourite() {
    //     var tip =   JSON.parse(window.sessionStorage.getItem("tip"));        
    //     //console.log(e)
    //     var a = []
    //     a = sessionStorage.getItem("login")
    //     a = JSON.parse(a);
    //     var b = []
    //     b.push(a)        
    //     console.log(b[0].id)
    //     axios.post("http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/tips/favorite/"+tip.id+"/"+b[0].id)
    //     .then(res => {
    //         const likes =  res.data;
    //         console.log(likes)
    //         this.setState({
    //             likes,
    //             error: null,
                
    //         });
    //     })
    //     .catch(err => {
    //         this.setState({
    //             error: err
    //         })           
    //     })
    //   }

    render () {
        var tip =   JSON.parse(window.sessionStorage.getItem("tip"));
        const { comment} = this.state;
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
                            {<img className="viewimage" src={tip.images} alt={tip.title}/>                               }
                            <div className="PostDetails">
                            <table>
                                <tbody> 
                                   
                                    <tr> 
                                        <td><label>category:</label> {tip.category}</td>
                                        { tip.comments ? 
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

                            {
                                comment.map((comments, index) =>{
                                    return(<div key={index}>
                                        <Media>
                                        <Media.Left>
                                          <img width={64} height={64} src="http://ieee.ece.ufl.edu/img/profile-pics/default_person.png" alt="Image"/>
                                        </Media.Left>
                                        <Media.Body>
                                        { comments.user ?
                                          <Media.Heading>{comments.user.firstName}</Media.Heading> : <Media.Heading>user name</Media.Heading>
                                        }
                                          <p>{comments.commentText}</p>
                                          { comments.replyComments ? 
                                          <div> {
                                              comments.replyComments.map((rc,index1) => {
                                                  return (<Media key={index1}>
                                            <Media.Left>
                                              <img width={64} height={64} src="http://ieee.ece.ufl.edu/img/profile-pics/default_person.png" alt="Image"/>
                                            </Media.Left>
                                            <Media.Body>
                                                { comments.user ?
                                              <Media.Heading>{rc.user.firstName}</Media.Heading> : <div />
                                                }
                                              <p>{rc.commentText}</p>
                                            </Media.Body>
                                          </Media>)
                                              })
                                          }
                                          </div>  : <div />
                                          }
                                        </Media.Body>
                                      </Media>
                                    </div>)
                                })
                            }
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