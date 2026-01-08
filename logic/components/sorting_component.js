export class SortingVisualizer {
  container;

  #board;
  #nums;
  #bars = [];
  #resizeObserver;
  #isFirstObservation = true;
  #isInProcess = false;

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
    bar.dataset.index = index;
    bar.style.setProperty('--h', this.#nums[index]);
    bar.style.setProperty('--w', `${width}px`);
    bar.style.setProperty('--position', `${index * moveToX}px`);
    return bar;
  }

  #updateSizing() {
    const [barWidth, moveToX] = this.#calculateDimensions();
    this.#bars.forEach((bar, index) => {
      bar.dataset.index = index;
      bar.style.setProperty('--w', `${barWidth}px`);
      bar.style.setProperty('--position', `${index * moveToX}px`);
    });
  }

  addNewValue(value) {
    if (this.#isInProcess) throw new Error('Cannot modify while sorting.');

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

  removeValue(value) {
    if (this.#isInProcess) throw new Error('Cannot modify while sorting.');

    const index = this.#nums.indexOf(value);
    if (index < 0) {
      throw new Error('Value was not found.');
    }

    this.#nums.splice(index, 1);

    const bar = this.#bars[index];
    if (bar) bar.remove();
    this.#bars.splice(index, 1);

    this.#board.style.setProperty('--maxH', Math.max(...this.#nums));
    this.#updateSizing();
  }

  async bubbleSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;

    this.#clearStates();

    try {
      for (let i = 0; i < this.#nums.length; i++) {
        let swap = false;

        for (let j = 0; j < this.#nums.length - 1 - i; j++) {
          const left = this.#bars[j];
          const right = this.#bars[j + 1];

          if (!left || !right) throw new Error('Bars out of sync.');

          left.classList.add('active');
          right.classList.add('active');

          if (this.#nums[j] > this.#nums[j + 1]) {
            [this.#nums[j], this.#nums[j + 1]] = [this.#nums[j + 1], this.#nums[j]];
            this.#swap(left, j + 1, right, j);
            [this.#bars[j], this.#bars[j + 1]] = [this.#bars[j + 1], this.#bars[j]];
            swap = true;
          }

          await this.#sleep();

          left.classList.remove('active');
          right.classList.remove('active');
        }

        if (!swap) break;
      }
    } catch (err) {
      console.error('bubbleSort failed:', err);
    } finally {
      this.#clearStates();
      this.#isInProcess = false;
    }
  }

  async insertionSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;

    this.#clearStates();

    try {
      for (let i = 1; i < this.#nums.length; i++) {
        const tempNums = this.#nums[i];
        const tempBars = this.#bars[i];
        let j = i;

        if (!tempBars) throw new Error('Bars out of sync.');

        while (j > 0 && this.#nums[j - 1] > tempNums) {
          const left = this.#bars[j - 1];
          const right = this.#bars[j];

          if (!left || !right) throw new Error('Bars out of sync.');

          left.classList.add('active');
          right.classList.add('active');

          this.#nums[j] = this.#nums[j - 1];
          this.#bars[j] = this.#bars[j - 1];

          this.#swap(this.#bars[j], j, tempBars, j - 1);

          await this.#sleep();

          left.classList.remove('active');
          right.classList.remove('active');

          j--;
        }

        this.#nums[j] = tempNums;
        this.#bars[j] = tempBars;

        this.#swap(tempBars, j);

        await this.#sleep();
      }
    } catch (err) {
      console.error('insertionSort failed:', err);
    } finally {
      this.#clearStates();
      this.#isInProcess = false;
    }
  }

  async selectionSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;

    this.#clearStates();

    try {
      for (let i = 0; i < this.#nums.length; i++) {
        let minIndex = i;

        for (let j = i + 1; j < this.#nums.length; j++) {
          const selectedBar = this.#bars[minIndex];
          const currentBar = this.#bars[j];

          if (!selectedBar || !currentBar) throw new Error('Bars out of sync.');

          selectedBar.classList.add('selected');
          currentBar.classList.add('active');

          if (this.#nums[j] < this.#nums[minIndex]) {
            minIndex = j;
          }

          await this.#sleep();

          selectedBar.classList.remove('selected');
          currentBar.classList.remove('active');
        }

        if (minIndex === i) continue;

        [this.#nums[i], this.#nums[minIndex]] = [this.#nums[minIndex], this.#nums[i]];
        this.#swap(this.#bars[i], minIndex, this.#bars[minIndex], i);
        [this.#bars[i], this.#bars[minIndex]] = [this.#bars[minIndex], this.#bars[i]];

        await this.#sleep();
      }
    } catch (err) {
      console.error('selectionSort failed:', err);
    } finally {
      this.#clearStates();
      this.#isInProcess = false;
    }
  }

  async quickSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;

    this.#clearStates();

    try {
      await this.#executeQuickSort();
    } catch (err) {
      console.error('quickSort failed:', err);
    } finally {
      this.#clearStates();
      this.#isInProcess = false;
    }
  }

  async #executeQuickSort(left = 0, right = this.#nums.length - 1) {
    if (left >= right) return;

    const partition = async (left, right) => {
      const pivotBar = this.#bars[right];
      pivotBar.classList.add('pivot');

      let pivotNumber = this.#nums[right];
      let i = left - 1;
      let j = left;

      while (j < right) {
        const currentBar = this.#bars[j];
        currentBar.classList.add('active');

        if (this.#nums[j] < pivotNumber) {
          i++;
          [this.#nums[i], this.#nums[j]] = [this.#nums[j], this.#nums[i]];
          this.#swap(this.#bars[i], j, this.#bars[j], i);
          [this.#bars[i], this.#bars[j]] = [this.#bars[j], this.#bars[i]];
        }

        await this.#sleep();
        currentBar.classList.remove('active');
        j++;
      }

      i++;

      [this.#nums[i], this.#nums[right]] = [this.#nums[right], this.#nums[i]];
      this.#swap(this.#bars[i], right, pivotBar, i);
      [this.#bars[i], this.#bars[right]] = [this.#bars[right], this.#bars[i]];

      await this.#sleep();
      pivotBar.classList.remove('pivot');

      return i;
    };


    let pi = await partition(left, right);

    await this.#executeQuickSort(left, pi - 1);
    await this.#executeQuickSort(pi + 1, right);
  }

  async mergeSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;

    this.#clearStates();

    try {
      const aux = this.#nums.slice();
      await this.#executeMergeSort(0, this.#nums.length - 1, aux);
    } catch (err) {
      console.error('mergeSort failed:', err);
    } finally {
      this.#clearStates();
      this.#isInProcess = false;
    }
  }

  async #executeMergeSort(left = 0, right = this.#nums.length - 1, aux = this.#nums.slice()) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    await this.#executeMergeSort(left, mid, aux);
    await this.#executeMergeSort(mid + 1, right, aux);

    for (let i = left; i <= right; i++) {
      aux[i] = this.#nums[i];
    }

    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
      const leftBar = this.#bars[i];
      const rightBar = this.#bars[j];
      const writeBar = this.#bars[k];

      leftBar.classList.add('active');
      rightBar.classList.add('active');
      writeBar.classList.add('active');

      if (aux[i] <= aux[j]) {
        this.#nums[k] = aux[i];
        writeBar.style.setProperty('--h', aux[i]);
        i++;
      } else {
        this.#nums[k] = aux[j];
        writeBar.style.setProperty('--h', aux[j]);
        j++;
      }

      await this.#sleep();

      leftBar.classList.remove('active');
      rightBar.classList.remove('active');
      writeBar.classList.remove('active');

      k++;
    }

    while (i <= mid) {
      this.#bars[i].classList.add('active');
      this.#bars[k].classList.add('active');

      this.#nums[k] = aux[i];
      this.#bars[k].style.setProperty('--h', aux[i]);

      await this.#sleep();

      this.#bars[i].classList.remove('active');
      this.#bars[k].classList.remove('active');

      i++;
      k++;
    }

    while (j <= right) {
      this.#bars[j].classList.add('active');
      this.#bars[k].classList.add('active');

      this.#nums[k] = aux[j];
      this.#bars[k].style.setProperty('--h', aux[j]);

      await this.#sleep();

      this.#bars[j].classList.remove('active');
      this.#bars[k].classList.remove('active');

      j++;
      k++;
    }
  }

  #swap(firstB, next, secondB, previous) {
    const [barWidth, moveToX] = this.#calculateDimensions();

    firstB.style.setProperty('--position', `${next * moveToX}px`);
    firstB.dataset.index = next;

    if (!secondB) return;

    secondB.style.setProperty('--position', `${previous * moveToX}px`);
    secondB.dataset.index = previous;
  }

  #clearStates() {
    this.#bars.forEach(b => b.classList.remove('active', 'selected', 'pivot'));
  }

  #sleep() {
    return new Promise(resolve => setTimeout(resolve, 20));
  }
}
