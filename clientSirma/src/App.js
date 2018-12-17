import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { graphql, compose } from 'react-apollo'
import { sendFile, getResult } from './requests/graphql.js'
import './css/App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null
    }
  }
  onDrop (files) {
    this.setState({
      file: files[0]
    })
    this.props.sendFile({
      variables: {
        file: this.state.file
      }
    })
  }
  handleSubmit (e) {
    this.props.mutate({ variables: { file: document.getElementById('input').files[0] } })
    this.setState({
      file: document.getElementById('input').files[0]
    })
  }
  loadData () {
    if (!this.props.getResult.loading) {
      let results = null
      try {
        results = JSON.parse(this.props.getResult.getResults)
      } catch (error) {
        return (<div className='errorMsg'>no connection to the server </div>)
      }
      if (results !== null) {
        return results.map(element => {
          return (
            <tr className='boardList' ><th>{element.indexKey}</th> <th>{element.pair.index}</th> <th>{element.pair.maxVal}</th></tr>
          )
        })
      }
    }
  }

  render () {
    return (
      <div className='main'>
        <div >
          {/* the developers of Dropzone(tm) decided to push new release
          whitout testing it and this component is broken
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>FILE</p>
          </Dropzone>
          */
          }
          <form className='formMain' onSubmit={this.handleSubmit.bind(this)}>
            <label>
              upload file:
              <input id='input' type='file' />
            </label>
            <input type='submit' value='Submit' />

          </form>
          <table className='tableMain' >
            <tr ><th>Employee ID #1</th> <th>Employee ID #2</th> <th>Days worked</th></tr>
            {this.loadData()}
          </table>
        </div>
      </div>
    )
  }
}

export default compose(graphql(sendFile),
  graphql(getResult, { name: 'getResult' }))(App)
