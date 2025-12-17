export class SortingVisualizer {
  container;

  #board;
  #nums;
  #bars = [];
  #resizeObserver;
  #isFirstObservation = true;

  constructor(...nums) {
    if (nums.length < 2) {
      throw new Error('Cannot be less than two bars.');
    }

    if (!nums.every(n => typeof n === 'number' && !isNaN(n))) {
      throw new Error('All values must be numbers.');
    }

    this.#nums = nums;
    this.#initializeDOM();
    this.#setupResizeObserver();
  }

  #initializeDOM() {
    this.container = document.createElement('div');
    this.container.classList.add('container');

    this.#board = document.createElement('div');
    this.#board.classList.add('board');
    this.#board.style.setProperty('--maxH', Math.max(...this.#nums));
  
    this.container.appendChild(this.#board);
  }

  #setupResizeObserver() {
    this.#resizeObserver = new ResizeObserver(entries => {
      this.#handleResizing(entries);
    })

    this.#resizeObserver.observe(this.#board);
  }

  #handleResizing(entries) {
    if (this.#isFirstObservation) {
      this.#createBars();
      this.#isFirstObservation = false;
    } else {
      this.#updateSizing();
    }
  }

  #createBars() {
    this.#board.replaceChildren();
    this.#bars = []; 

    const [barW, moveToX] = this.#calculateDimensions();

    for (let i = 0; i < this.#nums.length; i++) {
      const bar = this.#newBar(i, barW, moveToX);
      this.#board.append(bar);
      this.#bars.push(bar);
    }
  }

  #calculateDimensions() {
    const boardWidth = this.#board.getBoundingClientRect().width;
    const withoutGapWidth = boardWidth * 0.8;
    const gap = (boardWidth - withoutGapWidth) / Math.max(this.#nums.length - 1, 1);
    const barW = withoutGapWidth / this.#nums.length;
    const moveToX = barW + gap;

    return [barW, moveToX];
  }

  #newBar(index, width, moveToX) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.setProperty('--h', this.#nums[index]);
    bar.style.setProperty('--w', `${width}px`);
    bar.style.setProperty('--position', `${index * moveToX}px`);
    return bar;
  }

  #updateSizing() {
    const [barWidth, moveToX] = this.#calculateDimensions();
    this.#bars.forEach((bar, index) => {
      bar.style.setProperty('--w', `${barWidth}px`);
      bar.style.setProperty('--position', `${index * moveToX}px`);
    });
  }

  addNewValue(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new Error('Value must be a number.');
    }

    this.#nums.push(value);
    this.#board.style.setProperty('--maxH', Math.max(...this.#nums));

    const [barW, moveToX] = this.#calculateDimensions();
    const index = this.#nums.length - 1;
    const bar = this.#newBar(index, barW, moveToX);
    this.#board.append(bar);
    this.#bars.push(bar);
    this.#updateSizing();
  }
}
