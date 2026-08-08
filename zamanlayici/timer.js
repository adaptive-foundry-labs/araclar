(function () {
  'use strict';

  var minutesInput = document.getElementById('minutes-input');
  var secondsInput = document.getElementById('seconds-input');
  var startBtn = document.getElementById('start-btn');
  var pauseBtn = document.getElementById('pause-btn');
  var resetBtn = document.getElementById('reset-btn');
  var display = document.getElementById('display');
  var container = document.getElementById('app');
  var errorMsg = document.getElementById('error-msg');

  var STATE = { IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused', FINISHED: 'finished' };
  var state = STATE.IDLE;
  var remainingSeconds = 0;
  var intervalId = null;

  function pad(n) {
    n = Math.max(0, Math.floor(n));
    return n < 10 ? '0' + n : String(n);
  }

  function formatTime(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return pad(m) + ':' + pad(s);
  }

  function updateDisplay() {
    display.textContent = formatTime(remainingSeconds);
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.hidden = !msg;
    }
  }

  function clearFinishedVisual() {
    if (container) container.classList.remove('finished');
  }

  function triggerFinishedVisual() {
    if (container) container.classList.add('finished');
  }

  function readInputs() {
    var minsRaw = minutesInput ? minutesInput.value : '0';
    var secsRaw = secondsInput ? secondsInput.value : '0';
    var mins = parseInt(minsRaw, 10);
    var secs = parseInt(secsRaw, 10);

    if (isNaN(mins)) mins = 0;
    if (isNaN(secs)) secs = 0;

    if (mins < 0 || secs < 0 || secs > 59) {
      return null;
    }

    var total = mins * 60 + secs;
    if (total <= 0) {
      return null;
    }
    return total;
  }

  function setInputsDisabled(disabled) {
    if (minutesInput) minutesInput.disabled = disabled;
    if (secondsInput) secondsInput.disabled = disabled;
  }

  function setButtonsForState(newState) {
    if (newState === STATE.IDLE) {
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = true;
      setInputsDisabled(false);
    } else if (newState === STATE.RUNNING) {
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;
      setInputsDisabled(true);
    } else if (newState === STATE.PAUSED) {
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
      setInputsDisabled(true);
    } else if (newState === STATE.FINISHED) {
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
      setInputsDisabled(true);
    }
  }

  function tick() {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateDisplay();
      finish();
      return;
    }
    updateDisplay();
  }

  function start() {
    if (state === STATE.RUNNING) return;

    if (state === STATE.IDLE || state === STATE.FINISHED) {
      var total = readInputs();
      if (total === null) {
        showError('Gecerli bir dakika/saniye degeri girin (saniye 0-59, toplam > 0).');
        return;
      }
      showError('');
      clearFinishedVisual();
      remainingSeconds = total;
      updateDisplay();
    }

    state = STATE.RUNNING;
    setButtonsForState(state);
    intervalId = window.setInterval(tick, 1000);
  }

  function pause() {
    if (state !== STATE.RUNNING) return;
    window.clearInterval(intervalId);
    intervalId = null;
    state = STATE.PAUSED;
    setButtonsForState(state);
  }

  function reset() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
    state = STATE.IDLE;
    remainingSeconds = 0;
    showError('');
    clearFinishedVisual();
    updateDisplay();
    setButtonsForState(state);
  }

  function finish() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
    state = STATE.FINISHED;
    triggerFinishedVisual();
    setButtonsForState(state);
  }

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);

  updateDisplay();
  setButtonsForState(state);
})();
