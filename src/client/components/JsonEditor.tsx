import * as React from "react";

interface State {
    isDirty: boolean
}

interface Props {
    data: {}
    dataChnage: (data: string) => void
    saveData: () => void
}



export class JsonEditor extends React.Component< Props, State > {

    constructor(props) {
        super(props);
    }

    render = () =>   <>
      <textarea onChange={ (event) =>
          this.props.dataChnage(  event.target.value) }>
          {this.props.data}
      </textarea>
        <button onClick={   this.props.saveData} > Save </button>
        </>


}
