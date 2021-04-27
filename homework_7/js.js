"use strict";
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
    numWalls: 0,
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    getNumWalls() {
        return this.settings.numWalls;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getColsCount() < 10 || this.getColsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }

        if (this.getNumWalls() < 0 || this.getNumWalls() > 20) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение numWalls должно быть в диапазоне [0, 20].');
        }

        return result;
    },
};

const map = {
    cells: null,
    usedCells: [],

    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {}; // {x1_y1: td, x1_y2: td}
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');

                this.cells[`x${col}_y${row}`] = td;
                tr.appendChild(td);
            }
        }

    },

    render(snakePointsArray, foodPoint, wallPoints) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, idx) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);

        wallPoints.forEach((point) => {
            const wallCell = this.cells[`x${point.x}_y${point.y}`];
            wallCell.classList.add('wall');
            this.usedCells.push(wallCell);
        });
    }
};

const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,
    config,

    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    isOnPoint(point) {
        return this.getBody().some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());
        this.body.pop();
    },

    growUp() {
        const lastBodyIdx = this.body.length - 1;
        const lastBodyPoint = this.body[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint); // {...lastBodyPoint}

        this.body.push(lastBodyPointClone);
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0];

        switch(this.direction) {
            case 'up':
                if (firstPoint.y === 0) {
                    return {x: firstPoint.x, y: this.config.getRowsCount() - 1};
                }
                return {x: firstPoint.x, y: firstPoint.y - 1};
            case 'right':
                if (firstPoint.x === this.config.getColsCount() - 1) {
                    return {x: 0, y: firstPoint.y};
                }
                return {x: firstPoint.x + 1, y: firstPoint.y};
            case 'down':
                if (firstPoint.y === this.config.getRowsCount() - 1) {
                    return {x: firstPoint.x, y: 0};
                }
                return {x: firstPoint.x, y: firstPoint.y + 1};
            case 'left':
                if (firstPoint.x === 0) {
                    return {x: this.config.getColsCount() - 1, y: firstPoint.y};
                }
                return {x: firstPoint.x - 1, y: firstPoint.y};
        }
    },

    setDirection(direction) {
        this.direction = direction;
    },
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

const wall = {
    walls: [],

    getCoordinates() {
        return this.walls;
    },

    setCoordinates(point) {
        this.walls.push(point);
    },
};

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
    food,
    status,
    tickInterval: null,
    board: null,
    wall,

    init(userSettings = {}) {
        this.config.init(userSettings);
        this.board = document.querySelector('.board');
        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());

        this.setEventHandlers();
        this.reset();
    },

    reset() {
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up');
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.wall.walls = [];
        for (let i = 0; i < this.config.getNumWalls(); i++) {
            this.wall.setCoordinates(this.getRandomFreeCoordinates());
        }
        this.render();
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            }
        ];
    },

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody(), ...this.wall.getCoordinates()];

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра закончена', true);
    },

    setPlayButton(textContents, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = textContents;
        isDisabled
            ? playButton.classList.add('disabled')
            : playButton.classList.remove('disabled');
    },

    tickHandler() {
        if (!this.canMakeStep()) {
            return this.finish();
        }

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            this.food.setCoordinates(this.getRandomFreeCoordinates());

            if (this.isGameWon()) this.finish();
        }
        this.showBoard();
        this.snake.makeStep();
        this.render();
    },

    canMakeStep() {
        // const nextHeadPoint = this.snake.getNextStepHeadPoint();

        // return !this.snake.isOnPoint(nextHeadPoint) &&
        //     nextHeadPoint.x < this.config.getColsCount() &&
        //     nextHeadPoint.y < this.config.getRowsCount() &&
        //     nextHeadPoint.x >= 0 &&
        //     nextHeadPoint.y >= 0 &&

        for (let i = 0; i < this.config.getNumWalls(); i++) {
            if (this.snake.isOnPoint(this.wall.walls[i])) {
                return false;
            }
        }

        return true;
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) this.snake.setDirection(direction);
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
        }
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.wall.getCoordinates());
        this.showBoard();
    },

    showBoard() {
        this.board.textContent = `До конца игры осталось ${this.config.getWinFoodCount() - this.snake.getBody().length + 1} еды`;
    }
};

game.init({speed: 5, numWalls: 5});
