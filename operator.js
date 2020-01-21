let controlsCanvas;
let slider1, slider2;
let PATTERN;
let phrase;
let part;
let doot;
let playButton;
let BPM = 80;

const WIDTH = 400;
const HEIGHT = 400;
const GRID_SIZE = 4;
const INDICATOR_SIZE_X = 30;
const INDICATOR_SIZE_Y = 15;

function setup() {
  let controlsCanvas = createCanvas(WIDTH, HEIGHT);
  controlsCanvas.mousePressed(handleControlsClick);
  background(40);
  
  playButton = createButton('doit');
  playButton.mousePressed(() => { if (!part.isPlaying) {
        part.loop();
      } else {
        part.stop();
      }});
  doot = new p5.Oscillator();
  PATTERN = [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1];

  
  phrase = new p5.Phrase('doot', (time) => { 
    doot.start(time); doot.stop(time + ((BPM / 60) / 16));
  }, PATTERN);
  
  part = new p5.Part();
  part.addPhrase(phrase);
  part.setBPM(BPM);
  

  //drawGrid();
  drawIndicators();

}

function draw() {
  drawIndicators();
}

function drawGrid() {
  for (let i = 0; i <= GRID_SIZE; i++) {
    let step = i * (WIDTH / 4); // this will break if WIDTH != HEIGHT, lazy hack
    line(0, step, WIDTH, step);
    line(step, 0, step, HEIGHT);
  }
}

function drawIndicators() {
  let y_offset = HEIGHT / (GRID_SIZE * 2) - (INDICATOR_SIZE_Y / 2);
  let x_offset = WIDTH / (GRID_SIZE * 2) - (INDICATOR_SIZE_X / 2);

  for (let m_y = 0; m_y <= GRID_SIZE; m_y++) {
    let rect_y = m_y * (HEIGHT / GRID_SIZE) + y_offset;
    for (let m_x = 0; m_x <= GRID_SIZE; m_x++) {
      if (PATTERN[(m_y * GRID_SIZE) + m_x]) {
        fill(255, 0, 0)
      } else {
        fill(40, 0, 0)
      }
      let rect_x = m_x * (WIDTH / GRID_SIZE) + x_offset;
      rect(rect_x, rect_y, INDICATOR_SIZE_X, INDICATOR_SIZE_Y, 5);
    }
  }
}

function handleControlsClick() {
  let m_y = 0;
  let y = mouseY;
  let stepSizeY = WIDTH / GRID_SIZE;
  y -= stepSizeY;
  while (y > 0) {
    y -= stepSizeY;
    m_y++;
  }
  let m_x = 0;
  let x = mouseX;
  let stepSizeX = HEIGHT / GRID_SIZE;
  x -= stepSizeX;
  while (x > 0) {
    x -= stepSizeX;
    m_x++;
  }
  let pattern_index = (m_y * GRID_SIZE) + m_x
  PATTERN[pattern_index] = PATTERN[pattern_index] ? 0 : 1;
  // console.log(`${m_x}, ${m_y}`);
}
