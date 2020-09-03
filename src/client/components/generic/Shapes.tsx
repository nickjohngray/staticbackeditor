import * as React from 'react'

export default {
    Tick: () => <span className="shape_tick">&#10004;</span>,
    DownArrow: () => <span className="shape_down_arrow">&#x2B07;</span>,
    UpArrow: () => <span className="shape_up_arrow">&#x2B06;</span>,
    Cross: () => <span className="shape_up_arrow">&#10016;</span>,
    CaretDown: () => <span className="caret_down">&#x21e3;</span>
}
