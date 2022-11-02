import React, {useEffect, useState} from "react";
import Item from "./Item";
import {Button, Container, Row} from "react-bootstrap";
import {move, createEmptyField, isFinish, generateNewValue} from "../utils/GameUtils";
import {useSwipeable} from "react-swipeable";


export default function Game(props) {
    const [field, setField] = useState(createEmptyField())
    const [history, setHistory] = useState([])
    const [score, setScore] = useState(0)

    function handleMove(x, y) {
        let f = move(field, x, y);
        if (f != null) {
            let nField = generateNewValue(f.field)
            let nScore = score + f.score
            setField(nField)
            setScore(nScore)
        }
    }

    let handleKey = key => {
        if (key.keyCode == '38') {
            handleMove(-1, 0)
        } else if (key.keyCode == '40') {
            handleMove(1, 0)
        } else if (key.keyCode == '37') {
            handleMove(0, -1)
        } else if (key.keyCode == '39') {
            handleMove(0, 1)
        }
    }

    useEffect(() => {
        let h = [...history]
        if (h[h.length - 1]?.field !== field) {
            h.push({field: field, score: score})
            setHistory(h)
        }
    }, [field, score])

    useEffect(() => {
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('keydown', handleKey);
        };
    }, [field]);

    function restartGame() {
        setField(createEmptyField())
        setHistory([])
        setScore(0)
    }

    let finished = isFinish(field)

    const swipeHandlers = useSwipeable({
        onSwipedLeft: e => handleMove(0, -1),
        onSwipedRight: e => handleMove(0, 1),
        onSwipedUp: e => handleMove(-1, 0),
        onSwipedDown: e => handleMove(1, 0),
        preventScrollOnSwipe: true,
        trackMouse: true
    })

    return (
        <div className="" style={{textAlign: 'center'}}>
            <div className="mt-2 d-flex">
                <div className="ms-auto me-auto">
                    <Button variant="outline-secondary" className="me-1" onClick={() => {
                        if (history?.length > 1) {
                            let h = [...history]
                            h.pop()
                            setHistory(h)
                            setField(h[h.length - 1].field)
                            setScore(h[h.length - 1].score)
                        }
                    }}>Back</Button>
                    <Button variant="secondary" className="ms-1" onClick={() => {
                        restartGame()
                    }}>Restart</Button>

                </div>

            </div>
            <div className="mt-2" style={{fontSize: 18}}>
                <b className="">score: </b>
                <label>{score}</label>
            </div>
            <div {...swipeHandlers}>
                <div className={"d-flex justify-content-center"}>
                    <div className={"mt-2"} style={{position: 'relative'}}>
                        <div className={"unselectable" + (finished ? " translucent" : "")}>
                            {
                                field.map((row, i) =>
                                    <Row>
                                        {
                                            row.map((value, j) => <Item key={i + "_" + j + '_' + value} value={value}/>)
                                        }
                                    </Row>
                                )
                            }
                        </div>

                        <div className={"m-auto" + (!finished ? " d-none" : '')} style={{
                            position: "absolute",
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                            <label style={{fontSize: 30, fontWeight: 'bold'}} className="m-auto">Game over</label>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )

}
