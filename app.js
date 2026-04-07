(function () {
  'use strict';

  const FRAME_SIZE = 10;
  const state = {
    cells: new Array(FRAME_SIZE).fill(false),
    showNumber: true,
  };

  const frameEl = document.getElementById('ten-frame');
  const numberEl = document.getElementById('number-display');
  const resetBtn = document.getElementById('btn-reset');
  const toggleBtn = document.getElementById('btn-toggle-number');

  function buildFrame() {
    frameEl.innerHTML = '';
    for (let i = 0; i < FRAME_SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('data-index', String(i));
      cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
      cell.tabIndex = 0;

      const counter = document.createElement('div');
      counter.className = 'counter';
      cell.appendChild(counter);

      cell.addEventListener('click', () => toggleCell(i));
      cell.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleCell(i);
        }
      });

      frameEl.appendChild(cell);
    }
  }

  function toggleCell(i) {
    state.cells[i] = !state.cells[i];
    render();
  }

  function render() {
    const cellEls = frameEl.querySelectorAll('.cell');
    let count = 0;
    cellEls.forEach((el, i) => {
      const filled = state.cells[i];
      el.classList.toggle('filled', filled);
      el.setAttribute('aria-label', `Cell ${i + 1}, ${filled ? 'filled' : 'empty'}`);
      if (filled) count++;
    });
    numberEl.textContent = String(count);
    numberEl.classList.toggle('hidden', !state.showNumber);
  }

  resetBtn.addEventListener('click', () => {
    state.cells.fill(false);
    render();
  });

  toggleBtn.addEventListener('click', () => {
    state.showNumber = !state.showNumber;
    toggleBtn.setAttribute('aria-pressed', String(state.showNumber));
    toggleBtn.textContent = state.showNumber ? 'Hide Number' : 'Show Number';
    render();
  });

  buildFrame();
  render();
})();
