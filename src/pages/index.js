/*eslint-disable*/
import React, {Component} from "react";
//import { Link } from "gatsby";
import WebSocketComponent from "../components/WebSocket/WebSocket.js"

//import IndexNavbar from "../components/Navbars/IndexNavbar.js";
//import Footer from "../components/Footers/Footer.js";
import Layout from "../layouts/layout1.js";

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "default" };
  }

  handleChangeMesage = (newMessage) => {
    this.setState({
      message: newMessage
    })
  }

  componentDidMount() {
    this.timer = setTimeout(
      () => this.handleChangeMesage("helllooo"),
      1000*3 // in milliseconds, 3s for fast show
    )
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render(){
    return(
      <p>{this.state.message}</p>
    );
  }
}

const Index = () => {

  let mensaje = "Hola";

  return (

    //<Layout>
      <div className="relative flex flex-wrap">
        <div className="w-full mb-12 px-4">
          {mensaje}
          <Text />
          <WebSocketComponent />
        </div>
      </div>
    //</Layout>

  );
}

export default Index;