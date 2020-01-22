let controlsCanvas;
let slider1, slider2;
let PATTERN;
let phrase;
let part;
let doot;
let playButton;
let bpm = 80;
let envelope;
let controlsDiv;
let attackLevel = 1.0;
let releaseLevel = 0;
let attackTime = 0.001;
let decayTime = 0.2;
let sustainPercent = 0.2;
let releaseTime = 0.5;
let noiseType = 'sine';
let noiseTypeSelect;

let bpmSlider, attackLevelSlider, releaseLevelSlider, attackTimeSlider, decayTimeSlider, sustainPercentSlider, releaseTimeSlider;

let bpmDiv, attackLevelDiv, releaseLevelDiv, attackTimeDiv, decayTimeDiv, sustainPercentDiv, releaseTimeDiv;

const WIDTH = 400;
const HEIGHT = 400;
const GRID_SIZE = 4;
const INDICATOR_SIZE_X = 30;
const INDICATOR_SIZE_Y = 15;

function setup() {
  let controlsCanvas = createCanvas(WIDTH, HEIGHT);
  controlsCanvas.mousePressed(handleControlsClick);
  background(40);
  
  initControls();

  env = new p5.Envelope();

  env.setADSR(attackTime, decayTime, sustainPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  doot = new p5.Oscillator()
  doot.amp(env);

  PATTERN = [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1];


  phrase = new p5.Phrase('doot', (time) => {
    env.triggerAttack();
  }, PATTERN);

  part = new p5.Part();
  part.addPhrase(phrase);
  part.setBPM(bpm);


  //drawGrid();
  drawIndicators();
}

function draw() {
  drawIndicators();
  updateSliders();
  env.setADSR(attackTime, decayTime, sustainPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);
  part.setBPM(bpm);

}


function drawGrid() {
  for (let i = 0; i <= GRID_SIZE; i++) {
    let step = i * (WIDTH / 4); // this will break if WIDTH != HEIGHT, lazy hack
    line(0, step, WIDTH, step);
    line(step, 0, step, HEIGHT);
  }
}

function updateSliders() {
  bpmDiv.html(`BPM: ${bpm}`)
  attackLevelDiv.html(`Attack: ${attackLevel}`)
  releaseLevelDiv.html(`Release: ${releaseLevel} `);
  attackTimeDiv.html(`Attack Time: ${attackTime}`);
  releaseTimeDiv.html(`Release Time: ${releaseTime}`);
  decayTimeDiv.html(`Decay Time: ${decayTime}`);
  sustainPercentDiv.html(`Sustain: ${sustainPercent}`);
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

function initControls(){
  playButton = createButton('doit');
  playButton.mousePressed(() => {
    if (!part.isPlaying) {
      doot.start();
      part.loop();
    } else {
      doot.stop();
      part.stop();
    }
  });
  
  noiseTypeSelect = createSelect();
  noiseTypeSelect.option('sine');
  noiseTypeSelect.option('triangle');
  noiseTypeSelect.option('sawtooth');
  noiseTypeSelect.option('square');
  noiseTypeSelect.changed(() => { noiseType = noiseTypeSelect.value(); doot.setType(noiseType)});
  
  controlsDiv = createDiv().class('controls');

  bpmDiv = createDiv(`BPM: ${bpm}`).parent(controlsDiv);
  bpmSlider = createSlider(40, 240).parent(controlsDiv);
  bpmSlider.input(() => {
    bpm = bpmSlider.value()
  });

  attackLevelDiv = createDiv(`Attack: ${attackLevel}`).parent(controlsDiv);
  attackLevelSlider = createSlider(0.0, 1.0, attackLevel, 0.01).parent(controlsDiv);
  attackLevelSlider.input(() => {
    attackLevel = attackLevelSlider.value();
  });

  releaseLevelDiv = createDiv(`Release: ${releaseLevel} `).parent(controlsDiv);
  releaseLevelSlider = createSlider(0.0, 1.0, releaseLevel, 0.01).parent(controlsDiv);
    releaseLevelSlider.input(() => {
    releaseLevel = releaseLevelSlider.value();
  });

  attackTimeDiv = createDiv(`Attack Time: ${attackTime}`).parent(controlsDiv);
  attackTimeSlider = createSlider(0.0, 0.005, attackTime, 0.0001).parent(controlsDiv);
  attackTimeSlider.input(() => {
    attackTime = attackTimeSlider.value();
  });
  
  releaseTimeDiv = createDiv(`Release Time: ${releaseTime}`).parent(controlsDiv);
  releaseTimeSlider = createSlider(0.0, 0.5, releaseTime, 0.001).parent(controlsDiv);
  releaseTimeSlider.input(() => {
    releaseTime = releaseTimeSlider.value()
  });

  decayTimeDiv = createDiv(`Decay Time: ${decayTime}`).parent(controlsDiv);
  decayTimeSlider = createSlider(0.0, 1.0, decayTime, 0.01).parent(controlsDiv);
  decayTimeSlider.input(() => {
    decayTime = decayTimeSlider.value()
  });

  sustainPercentDiv = createDiv(`Sustain: ${sustainPercent}`).parent(controlsDiv);
  sustainPercentSlider = createSlider(0.0, 1.0, sustainPercent, 0.01).parent(controlsDiv);
  sustainPercentSlider.input(() => {
    sustainPercent = sustainPercentSlider.value()
  });
}
