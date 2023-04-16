// tictactoe with minimax
// Marlon Zurita, 2023
// based on the script provided by The Coding Train

let tablero = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w; 
let h; 

let ai = 'X';
let persona = 'O';
let jugadorActual = persona;

function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
  mejorMovim();
}

function igualdad3(a, b, c) {
  return a == b && b == c && a != '';
}

function determinarGanador() {
  let ganador = null;

  // filas
  for (let i = 0; i < 3; i++) {
    if (igualdad3(tablero[i][0], tablero[i][1], tablero[i][2])) {
      ganador = tablero[i][0];
    }
  }

  // vertical
  for (let i = 0; i < 3; i++) {
    if (igualdad3(tablero[0][i], tablero[1][i], tablero[2][i])) {
      ganador = tablero[0][i];
    }
  }

  // diagonales
  if (igualdad3(tablero[0][0], tablero[1][1], tablero[2][2])) {
    ganador = tablero[0][0];
  }
  if (igualdad3(tablero[2][0], tablero[1][1], tablero[0][2])) {
    ganador = tablero[2][0];
  }

  let espaciosVacios = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (tablero[i][j] == '') {
        espaciosVacios++;
      }
    }
  }

  if (ganador == null && espaciosVacios == 0) {
    return 'empate';
  } else {
    return ganador;
  }
}

function mousePressed() {
  if (jugadorActual == persona) {
    // turno de persona
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // turno es valido
    if (tablero[i][j] == '') {
      tablero[i][j] = persona;
      jugadorActual = ai;
      mejorMovim();
    }
  }
}

function mejorMovim() {
  // turno de ai
  let mejorPunt = -Infinity;
  let movim;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // espacio disponible?
      if (tablero[i][j] == '') {
        tablero[i][j] = ai;
        let punt = minimax(tablero, 0, false);
        tablero[i][j] = '';
        if (punt > mejorPunt) {
          mejorPunt = punt;
          movim = { i, j };
        }
      }
    }
  }
  tablero[movim.i][movim.j] = ai;
  jugadorActual = persona;
}

let puntajes = {
  X: 10,
  O: -10,
  empate: 0
};

function minimax(tablero, prof, boolMax) {
  let result = determinarGanador();
  if (result !== null) {
    return puntajes[result];
  }

  if (boolMax) {
    let mejorPunt = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // espacio disponible?
        if (tablero[i][j] == '') {
          tablero[i][j] = ai;
          let punt = minimax(tablero, prof + 1, false);
          tablero[i][j] = '';
          mejorPunt = max(punt, mejorPunt);
        }
      }
    }
    return mejorPunt;
  } else {
    let mejorPunt = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // espacio disponible?
        if (tablero[i][j] == '') {
          tablero[i][j] = persona;
          let punt = minimax(tablero, prof + 1, true);
          tablero[i][j] = '';
          mejorPunt = min(punt, mejorPunt);
        }
      }
    }
    return mejorPunt;
  }
}


function draw() {
  background(255);
  strokeWeight(4);
  
  stroke(0);
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let espacio = tablero[i][j];
      textSize(32);
      let r = w / 3;
      if (espacio == persona) {
        noFill();
        stroke(255, 0, 0);
        ellipse(x, y, r * 2);
      } else if (espacio == ai) {
        noFill();
        stroke(0, 0, 255);
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let result = determinarGanador();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'empate') {
      resultP.html('Empate!');
    } else {
      resultP.html(`ganador: ${result}`);
    }
  }
}

