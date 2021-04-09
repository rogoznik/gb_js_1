function renderBoard() {
    const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const board = document.querySelector('.board');

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if ((i === 0 || i === 9) && (j >= 1 && j <= 8)) {
                cell.classList.add('cell-address');
                cell.innerHTML = abc[j - 1];
            } else if ((j === 0 || j === 9) && (i >= 1 && i <= 8)) {
                cell.classList.add('cell-address');
                cell.innerHTML = i;
            } else if ((j >= 1 && j <= 8) && (i >= 1 && i <= 8 )) {
                cell.classList.add('cell-field');
                if (i % 2 != 0) {
                    if (j % 2 === 0) {
                        cell.classList.add('light');
                    } else {
                        cell.classList.add('dark');
                    }
                } else {
                    if (j % 2 === 0) {
                        cell.classList.add('dark');
                    } else {
                        cell.classList.add('light');
                    }
                }
                
            }

            row.appendChild(cell);
        }

        board.appendChild(row);
    }
}

function arrangeFigures() {
    const rows = document.getElementsByClassName('row');
    const listDarkFigures = [
        '&#9820;',
        '&#9822;',
        '&#9821;',
        '&#9819;',
        '&#9818;',
        '&#9821;',
        '&#9822;',
        '&#9820;'
    ];
    const listLightFigures = [
        '&#9814;',
        '&#9816;',
        '&#9815;',
        '&#9813;',
        '&#9812;',
        '&#9815;',
        '&#9816;',
        '&#9814;'
    ];
    
    for (let i = 1; i <= 8; i++) {
        rows[1].children[i].innerHTML = listLightFigures[i - 1];
        rows[2].children[i].innerHTML = '&#9817;';
        rows[7].children[i].innerHTML = '&#9823;';
        rows[8].children[i].innerHTML = listDarkFigures[i - 1];
    }
}

renderBoard();
arrangeFigures();