function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNewValue(f) {
    let field = JSON.parse(JSON.stringify(f))
    const possible = [
        [2, 0.8],
        [4, 1]
    ]
    const rnd = Math.random()
    let value;
    for (let i in possible) {
        if (rnd <= possible[i][1]) {
            value = possible[i][0]
            break
        }
    }

    const free = []

    for (let row in field) {
        for (let col in field[row]) {
            if (field[row][col] === -1) {
                free.push([row, col])
            }
        }
    }
    let ind = getRndInteger(0, free.length)

    field[free[ind][0]][free[ind][1]] = value
    return field
}

function createEmptyField() {
    return generateNewValue([
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
    ])
}

function move(f, dx, dy) {
    let field = JSON.parse(JSON.stringify(f))
    const n = field.length
    const m = field[0].length
    let flags = []
    for (let i = 0; i < n; i++) {
        flags.push([])
        for (let j = 0; j < m; j++) {
            flags[i].push(false)
        }
    }
    let updated = true
    let dScore = 0

    while (updated) {
        updated = false
        let i = 0, j = 0;
        if (dx === 1) {
            i = n - 1
        }
        if (dy === 1) {
            j = m - 1
        }

        for (; 0 <= i && i < n && 0 <= j && j < m; i = dy !== 0 ? i + 1 : (dx === 1 ? n - 1 : 0), j = dx !== 0 ? j + 1 : (dy === 1 ? m - 1 : 0)) {
            for (; 0 <= i && i < n && 0 <= j && j < m; i -= dx, j -= dy) {
                if (field[i][j] === -1) {
                    continue
                }
                let nx = i + dx;
                let ny = j + dy;
                if (!(0 <= nx && nx < n && 0 <= ny && ny < m)) {
                    continue
                }
                if (field[nx][ny] === -1) {
                    field[nx][ny] = field[i][j]
                    field[i][j] = -1
                    flags[nx][ny] = flags[i][j]
                    flags[i][j] = false
                    updated = true
                } else if (field[nx][ny] === field[i][j] && !flags[nx][ny] && !flags[i][j]) {
                    field[nx][ny] *= 2
                    field[i][j] = -1
                    flags[nx][ny] = true
                    flags[i][j] = false
                    dScore += field[nx][ny]
                    updated = true
                }
            }
        }
    }
    if (JSON.stringify(f) === JSON.stringify(field)) {
        return null
    }

    return {field: field, score: dScore}
}

function isFinish(field) {
    return !move(field, -1, 0) && !move(field, 1, 0) && !move(field, 0, -1) && !move(field, 0, 1)
}


export { createEmptyField, generateNewValue, move, isFinish }