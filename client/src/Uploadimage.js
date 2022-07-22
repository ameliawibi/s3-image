import React, { Component } from "react";
import axios from "axios";

class Uploadimage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initially, no file is selected
      selectedFile: null,
      sucessmessage: " ",
      errormessage: " ",
    };
  }

  onChange = (e) => {
    // Update the state
    this.setState({ selectedFile: e.target.files[0] });
  };

  uploadFile = (e) => {
    e.preventDefault();

    // Create an object of formData
    let formData = new FormData();

    // Update the formData object

    formData.append("file", this.state.selectedFile);

    console.log(this.state.selectedFile);

    axios
      .post("/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200)
          return this.setState({
            sucessmessage: "File uploaded successfullyS3",
          });
      })
      .catch((error) => {
        console.error(error.response);
        this.setState({
          errormessage: error.response.status + " Please select the file",
        });
      });
  };

  render() {
    return (
      <div>
        <form method="post" action="#" onSubmit={this.uploadFile}>
          <input type="file" name="uploadfile" onChange={this.onChange}></input>
          <p> {this.state.sucessmessage}</p>
          <p>{this.state.errormessage}</p>
          <button> upload</button>
        </form>
      </div>
    );
  }
}
export default Uploadimage;
