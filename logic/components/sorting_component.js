export class SortingVisualizer {
  container;

  #board;
  #nums;
  #bars = [];
  #boardWidth;
  #withoutGapWidth;
  #gap;
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
    const el = entries[0];
    this.#boardWidth = el.contentRect.width;
    this.#withoutGapWidth = this.#boardWidth * 0.8;
    this.#gap = (this.#boardWidth - this.#withoutGapWidth) / (this.#nums.length - 1);

    if (this.#isFirstObservation) {
      this.#createBars();
      this.#isFirstObservation = false;
    } else {
      this.#updateSizing();
    }
  }

  #createBars() {
    const [barW, moveToX] = this.#calculateDimensions();

    for (let i = 0; i < this.#nums.length; i++) {
      const bar = this.#newBar(i, barW, moveToX);
      this.#board.append(bar);
      this.#bars.push(bar);
    }
  }

  #calculateDimensions() {
    const barW = this.#withoutGapWidth / this.#nums.length;
    const moveToX = barW + this.#gap;
    return [barW, moveToX];
  }

  #newBar(index, width, moveToX) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.dataset.order = index;
    bar.style.setProperty('--h', this.#nums[index]);
    bar.style.setProperty('--w', `${width}px`);
    bar.style.setProperty('--position', `${index * moveToX}px`);
    return bar;
  }

  #updateSizing() {
    const [barWidth, moveToX] = this.#calculateDimensions();

    this.#bars.forEach((bar) => {
      const order = Number(bar.dataset.order);
      bar.style.setProperty('--w', `${barWidth}px`);
      bar.style.setProperty('--position', `${order * moveToX}px`);
    });
  }
}