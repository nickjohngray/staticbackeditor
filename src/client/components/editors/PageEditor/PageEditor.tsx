import {ActionCreators} from 'redux-undo'
import {IPage, IObjectPath, ISection, IMoveNodeOrLeafToMethod, IProduct} from '../../../../shared/typings'
import * as React from 'react'
import store from '../../../redux/store'
import SectionEditor from '../SectionEditor/SectionEditor'
import {RouteComponentProps, Link, navigate} from '@reach/router'
import LabelEditor from '../../editors/LabelEditor/LabelEditor'
import './PageEditor.css'
import Tree from '../../generic/Tree'
import ProductEditor from '../ProductEditor/ProductEditor'
import RTEditor from '../RichTextEditor/RTEditor'
import {Constants, PageContentEditors} from '../../../util'
import IncredibleEditor from '../IncredibileEditor/IncredibleEditor'
import {IIncredibleItem} from '../IncredibileEditor'

type IProps = {
    page: IPage
    products: IProduct[]
    onPageNameAndPathChange: (id: number, name: string, path: string) => void
    onObjectAdd: (jsonObject: object, objectPath: any[]) => void
    onObjectChange: (text: string, objectPath: any[]) => void
    onObjectDelete: (objectPath: any[]) => void
    onMoveNodeOrLeafTo: IMoveNodeOrLeafToMethod
    assetDirectory: string
    projectUploadFolder: string
} & RouteComponentProps // routable

interface IState {
    name: string
    path: string
    sections?: ISection[]
}

class PageEditor extends React.Component<IProps, IState> {
    richTextData: any

    constructor(props: IProps) {
        super(props)
        if (this.props.page) {
            const {name, path} = props.page
            this.state = {name, path}
        }

    }

    componentDidMount() {
        store.dispatch(ActionCreators.clearHistory())
        /*if (!this.props.page) {
            navigate('/')
            /!* navigate('/pages')*!/
        }*/
    }

    // todo refactor this, maybe use useMemo
    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
        if (!nextProps.page) {
            return
        }
        if (nextProps.page.name !== this.props.page.name || nextProps.page.path !== this.props.page.path) {
            this.setState({name: nextProps.page.name, path: nextProps.page.path})
        }
    }

    render = () => {
        const {name, path} = this.state

        return (
            <div>
                <h2>
                    {/* <Link title={'Back to pages'} to="/pages" replace>*/}
                    <Link title={'Back to pages'} to="/" replace>
                        <span>pages{'/'}</span>
                    </Link>

                    <LabelEditor
                        value={name}
                        onUpdate={(name) => {
                            this.fireUpdatePath(name)
                        }}
                    />
                </h2>
                <div className={'path-and-name-container'}>
                    <LabelEditor
                        type={this.props.page.isFixedURLPath ? 'readonly' : 'string'}
                        label="Path"
                        value={path}
                        onUpdate={(path) => {
                            this.fireUpdatePath(undefined, path)
                        }}
                    />
                </div>
                {this.getContentEditor()}
            </div>
        )
    }

    getContentEditor = () => {
        if (!this.props.page) {
            return <div> Page is null </div>
        }
        switch (this.props.page.editor) {
            case PageContentEditors.sectionEditor: {
                return (
                    <SectionEditor
                        onUpdate={(text, objectPath) => this.props.onObjectChange(text, objectPath)}
                        onAdd={(jsonObject, objectPath) => this.props.onObjectAdd(jsonObject, objectPath)}
                        onDelete={(objectPath) => this.props.onObjectDelete(objectPath)}
                        sections={this.props.page.sections}
                        assetDirectory={this.props.assetDirectory}
                        projectUploadFolder={this.props.projectUploadFolder}
                        onMoveNodeOrLeafTo={this.props.onMoveNodeOrLeafTo}
                    />
                )
            }
            case PageContentEditors.productEditor: {
                return (
                    <ProductEditor
                        onUpdate={(text, objectPath) => this.props.onObjectChange(text, objectPath)}
                        onAdd={(jsonObject, objectPath) => this.props.onObjectAdd(jsonObject, objectPath)}
                        onDelete={(objectPath) => this.props.onObjectDelete(objectPath)}
                        products={this.props.products}
                        assetDirectory={this.props.assetDirectory}
                        projectUploadFolder={this.props.projectUploadFolder}
                        onMoveNodeOrLeafTo={this.props.onMoveNodeOrLeafTo}
                    />
                )
            }
            case PageContentEditors.richTextEditor: {
                return (
                    <RTEditor
                        onChange={(richTextData) => {
                            this.richTextData = richTextData
                        }}
                        onBlur={() => {
                            this.props.onObjectChange(this.richTextData, [Constants.richTextData])
                        }}
                        data={this.props.page.richTextData}
                    />
                )
            }
            case PageContentEditors.incredibleEditor: {
                return (
                    <IncredibleEditor
                        onUpdate={(jsonObject, objectPath) => this.props.onObjectChange(jsonObject, objectPath)}
                        onAdd={(jsonObject, objectPath) => this.props.onObjectAdd(jsonObject, objectPath)}
                        onDelete={(objectPath) => this.props.onObjectDelete(objectPath)}
                        assetDirectory={this.props.assetDirectory}
                        projectUploadFolder={this.props.projectUploadFolder}
                        onMoveNodeOrLeafTo={this.props.onMoveNodeOrLeafTo}
                        data={this.props.page.incredibleData}
                    />
                )
            }
            default: {
                return (
                    <div>
                        <h2> Sorry! The Content is Not editable </h2>
                        <p>
                            This page does not have a editor for it as it is a custom page. An Editor can be built for
                            it on request.
                        </p>
                    </div>
                )
            }
        }
    }

    fireOnPageNameAndPathChange = (event) => {
        const {name, path} = this.state
        if (path.trim() === '' || name.trim() === '') {
            alert('Please fill in all values')
            return
        }

        this.props.onPageNameAndPathChange(this.props.page.id, name, path)
    }

    fireUpdatePath = (name: string = this.state.name, path: string = this.state.path) => {
        if (path.trim() === '' || name.trim() === '') {
            alert('Please fill in all values')
            return
        }

        this.props.onPageNameAndPathChange(this.props.page.id, name, path)
    }
}

export default PageEditor
