import React from "react";

export default function Item(props) {
    const value = props.value

    return (
        <div style={{width: 100, height: 100}} className="border d-inline-block">
            <div className="d-flex h-100">
                <span className="m-auto" style={{fontSize: '25px'}}>{value !== -1 ? value : ''}</span>
            </div>
        </div>
    )

}