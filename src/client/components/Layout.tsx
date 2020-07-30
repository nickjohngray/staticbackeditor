import * as React from "react";

interface State {
    isDirty: boolean
    data: {}
}

export class Layout extends React.Component< {}, State > {

    constructor(props) {
        super(props);
    }

    render = () =>   <>
      <textarea onChange={ (event) =>
          this.setState( {data: event.target.value, } )}>
          {this.state.data}
      </textarea>
        <button onClick={ ()=>  this.save} />
    </>

    save = () => {

    }
}
