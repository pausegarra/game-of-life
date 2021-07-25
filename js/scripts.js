'use strict'

const container = $("#container")
const play      = $("#play")
const nextFrame = $("#nextFrame")
const clear     = $("#clean")

const rows    = 45
const columns = 90
const width   = 20

let pic
let isPlaying = false

$(document).ready(() => {
    generateTable()

    setInterval(() => {
        if (isPlaying) 
            nextState()
    },100)

    play.on('click',changePlay)
    nextFrame.on('click',nextState)
    clear.on('click',clean)
})

$(document).on('keydown',evt => {
    evt.preventDefault()

    if (evt.keyCode == 39) // Right arrow
        nextState()
    if (evt.keyCode == 32) // Space
        changePlay()
})

/**
 * Generates the table
 */
const generateTable = () => {
    let html = "<table cellpadding=0 cellspacing=0 id='table'>"
    for (let x = 0; x < rows; x++) {
        html += "<tr>";
        for (let y = 0; y < columns; y++) {
            html += `<td id="celula-${y}-${x}" class="celula" data-x="${x}" data-y="${y}">`
            html += "</td>"
        }
        html += "</tr>"
    }
    html += "</table>"
    container.html(html)

    const table = $("#table")
    table.width(width * columns + "px")
    table.height(width * rows + "px")

    $(".celula").on('click',changeStateOnClick)
}

/**
 * Change the state of one cell on users click
 * @param {Object} evt 
 */
const changeStateOnClick = evt => {
    let x = evt.currentTarget.dataset['x']
    let y = evt.currentTarget.dataset['y']

    const cell = $(`#celula-${y}-${x}`)
    if (cell.css('background-color') != 'rgb(0, 0, 0)'){
        cell.css('background-color','#000')
    } else {
        cell.css('background-color','')
    }
}

/**
 * Captures the state of the table into an array of booleans
 */
const capture = () => {
    pic = []
    for (let y = 0; y < columns; y++) {
        pic.push([])
        for (let x = 0; x < rows; x++) {
            const cell = $(`#celula-${y}-${x}`)
            pic[y][x] = cell.css('background-color') == 'rgb(0, 0, 0)'
        }
    }
}

/**
 * Count the cells alive around the given one
 * @param {number} x 
 * @param {number} y 
 */
const countAlive = (x,y) => {
    let alive = 0
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0)
                continue
            
            try {
                if (pic[y + i][x + j])
                    alive++
            } catch (e) {}
            if (alive > 3) return alive
        }
    }
    return alive
}

/**
 * Steps to the next state
 */
const nextState = () => {
    capture()
    for (let y = 0; y < columns; y++) {
        for (let x = 0; x < rows; x++) {
            let alive = countAlive(x,y)
            const cell = $(`#celula-${y}-${x}`)
            if (pic[y][x]) { // Is alive
                if (alive < 2 || alive > 3) 
                    cell.css('background-color','') // The cell dies
            } else { // Is dead
                if (alive == 3) 
                    cell.css('background-color','#000') // The cell is born
            }
        }
    }
}

/**
 * Plays or pause the game
 */
const changePlay = () => {
    isPlaying = !isPlaying
    if (isPlaying) {
        $("#play").html("<i class='fas fa-pause'></i>")
        $("body").css('background-color','#FFF')
    } else {
        $("#play").html("<i class='fas fa-play'></i>")
        $("body").css('background-color','#f0f0ff')
    }
}

/**
 * Cleans the table
 * @param {Object} evt 
 */
const clean = evt => {
    console.log('cleaning!')
    evt.preventDefault()
    for (let y = 0; y < columns; y++) {
        for (let x = 0; x < rows; x++) {
            const cell = $(`#celula-${y}-${x}`)
            cell.css('background-color','')
        }
    }
}