export class SortingVisualizer {
  container;

  #board;
  #nums;
  #boardWidth;
  #withoutGapWidth;
  #gap;
  #resizeObserver;

  constructor(...nums) {
    if (nums.length < 1) {
      throw new Error('Cannot be less than two bars.');
    }

    this.#nums = nums;
    this.#initializeDOM();
  }

  #initializeDOM() {
    this.container = document.createElement('div');
    this.container.classList.add('container');

    this.#board = document.createElement('div');
    this.#board.classList.add('board');
    this.#board.style.setProperty('--maxH', Math.max(...this.#nums));
  
    this.container.appendChild(this.#board);
  }
}