import React from 'react'
import {fieldsOk} from '../../../util'
import {Istore} from '../../../redux/store'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {IManifest} from '../../../typings'
// @ts-ignore
import logoImagePath from '../../../images/logo.png'
import './Login.css'
import Loader from '../Loader/Loader'
import {login} from '../../../redux/actions/manifest.action'

/*const salt = await bcrypt.genSalt(20);
user.password = await bcrypt.hash(user.password, salt);*/

interface State {
    email: string
    pwd: string
    manifest: IManifest
    repoName: string
}

interface Props {
    login: (email: string, pwd: string) => void
    manifest: IManifest
    isBusy: boolean
}
class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {email: '', pwd: '', manifest: null, repoName: ''}
    }
    login = (event) => {
        event.preventDefault()

        if (!fieldsOk(this.state.email, this.state.pwd)) {
            alert('Please fill in all the fields')
            return
        }
        this.props.login(this.state.email, this.state.pwd)
    }

    render = () => {
        const {email, pwd} = this.state

        return (
            <div className="login">
                {this.props.isBusy && <Loader />}
                <div className="login-container">
                    <h1> Login to take control</h1>
                    <form onSubmit={(event) => this.login(event)}>
                        <input
                            value={email}
                            type={email}
                            placeholder="email"
                            name="email"
                            onChange={(e) => {
                                this.setState({email: e.target.value})
                            }}
                        />
                        <input
                            value={pwd}
                            type="password"
                            placeholder="pwd"
                            name="pwd"
                            onChange={(e) => {
                                this.setState({pwd: e.target.value})
                            }}
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
                <img src={logoImagePath} />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    login: (email: string, pwd: string) => {
        dispatch(login(email, pwd))
    }
})

export default connect(
    (state: Istore) => ({
        manifest: state.manifest.present.manifest,
        isBusy: state.manifest.present.isBusy
    }),
    mapDispatchToProps
)(Login)
