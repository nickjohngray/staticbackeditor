import {Document, Page} from 'react-pdf'
import React from 'react'

interface IPdfViewerState {
    pages: number
    currentPage: number
}

interface IPdfViewerProps {
    file: string
}
class PdfViewer extends React.Component<IPdfViewerProps, IPdfViewerState> {
    constructor(props: IPdfViewerProps) {
        super(props)

        this.state = {
            pages: -1,
            currentPage: 1
        }
    }

    onDocumentLoadSuccess = ({numPages}) => {
        this.setState({pages: numPages})
    }

    nextPage = () => {
        if (this.state.currentPage + 1 <= this.state.pages) {
            this.setState({currentPage: this.state.currentPage + 1})
        }
    }

    previousPage = () => {
        if (this.state.currentPage - 1 > 0) {
            this.setState({currentPage: this.state.currentPage - 1})
        }
    }

    render() {
        const {currentPage, pages} = this.state

        return (
            <div className="center-it" style={{flexDirection: 'column', overflow: 'scroll'}}>
                <Document file={this.props.file} onLoadSuccess={this.onDocumentLoadSuccess}>
                    <Page pageNumber={currentPage} />
                </Document>

                <p>
                    Page {currentPage} of {pages}
                </p>

                <div>
                    <button
                        placeholder="Previous"
                        title="Previous"
                        disabled={this.state.currentPage === 1}
                        onClick={this.previousPage}>
                        {' '}
                        &lt;
                    </button>
                    <button
                        style={{marginLeft: 5}}
                        placeholder="Next"
                        title="Next"
                        disabled={this.state.currentPage + 1 > this.state.pages}
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
