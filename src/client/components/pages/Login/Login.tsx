import React from 'react'
import {IStore} from '../../../redux/store'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import {IManifest} from '../../../../shared/typings'
import './Login.css'
import Loader from '../Loaders/OrbLoader/OrbLoader'
import {login} from '../../../redux/actions/manifest.action'
// @ts-ignore
import logoImagePath from '../../../assets/images/logo.png'
import {fieldsOk} from '../../../../shared/util'

/*const salt = await bcrypt.genSalt(20);
user.password = await bcrypt.hash(user.password, salt);*/

interface IState {
    email: string
    pwd: string
    manifest: IManifest
    repoName: string
}

interface IProps {
    login: (email: string, pwd: string) => void
    manifest: IManifest
    isBusy: boolean
}

class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
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
                        <div>
                            <input
                                value={email}
                                type={email}
                                placeholder="email"
                                name="email"
                                onChange={(e) => {
                                    this.setState({email: e.target.value})
                                }}
                            />
                        </div>
                        <div>
                            <input
                                autoComplete={'new-password'}
                                value={pwd}
                                type="password"
                                placeholder="pwd"
                                name="pwd"
                                onChange={(e) => {
                                    this.setState({pwd: e.target.value})
                                }}
                            />{' '}
                        </div>
                        <div>
                            <button type="submit">Login</button>
                        </div>
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
    (state: IStore) => ({
        manifest: state.manifest.present.manifest,
        isBusy: state.manifest.present.isBusy
    }),
    mapDispatchToProps
)(Login)
