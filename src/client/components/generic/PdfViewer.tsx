// dont import like import {Document, Page} from 'react-pdf'
// as using commonjs as set in tsconfig
import {Document, Page} from 'react-pdf/dist/umd/entry.webpack'

import React from 'react'

interface IPdfViewerState {
    pages: number
    currentPageID: number
}

interface IPdfViewerProps {
    file: string
}
class PdfViewer extends React.Component<IPdfViewerProps, IPdfViewerState> {
    constructor(props: IPdfViewerProps) {
        super(props)

        this.state = {
            pages: -1,
            currentPageID: 1
        }
    }

    onDocumentLoadSuccess = ({numPages}) => {
        this.setState({pages: numPages})
    }

    nextPage = () => {
        if (this.state.currentPageID + 1 <= this.state.pages) {
            this.setState({currentPageID: this.state.currentPageID + 1})
        }
    }

    previousPage = () => {
        if (this.state.currentPageID - 1 > 0) {
            this.setState({currentPageID: this.state.currentPageID - 1})
        }
    }

    render() {
        const {currentPageID, pages} = this.state

        return (
            <div className="center-it" style={{flexDirection: 'column', overflow: 'scroll'}}>
                <Document file={this.props.file} onLoadSuccess={this.onDocumentLoadSuccess}>
                    <Page pageNumber={currentPageID} />
                </Document>

                <p>
                    Page {currentPageID} of {pages}
                </p>

                <div>
                    <button
                        placeholder="Previous"
                        title="Previous"
                        disabled={this.state.currentPageID === 1}
                        onClick={this.previousPage}>
                        {' '}
                        &lt;
                    </button>
                    <button
                        style={{marginLeft: 5}}
                        placeholder="Next"
                        title="Next"
                        disabled={this.state.currentPageID + 1 > this.state.pages}
                        onClick={this.nextPage}>
                        {' '}
                        &gt;
                    </button>
                </div>
            </div>
        )
    }
}

export default PdfViewer
