import * as React from "react";
import {debug} from "webpack";

interface  Props {
    isEditMode: boolean;
    value: string;
}

class EditableLeaf extends React.Component<Props, any> {

    constructor(props) {
        super(props);
    }

    render = () =>  {
        return (
        <li className="leaf">
            {this.props.isEditMode ? <input value={this.props.value}  /> :
                <div className="leaf"
                    onClick={
                        (e) => {

                        }}>
                    {this.props.value}
                </div>}
        </li>
        )}
}

export  default  EditableLeaf;
