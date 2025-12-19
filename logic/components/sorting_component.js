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

    for (let i = 0; i < this.#nums.length; i++) {
      let swap = false;
      for (let j = 0; j < this.#nums.length - 1 - i; j++) {
        const left = this.#bars[j];
        const right = this.#bars[j + 1];

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

      this.#bars[this.#bars.length - 1 - i].classList.add('sorted');

      if (!swap) {
        while (i >= 0) {
          this.#bars[this.#bars.length - 1 - i].classList.add('sorted');
          i++;
        }
        break;
      }
    }

    this.#isInProcess = false;
  }

  async insertionSort() {

    if (this.#isInProcess) return;
    this.#isInProcess = true;
    
    for (let i = 1; i < this.#nums.length; i++) {
      let tempNums = this.#nums[i];
      let tempBars = this.#bars[i];
      let j = i;
      let swap = false;

      while(j > 0 && this.#nums[j - 1] > tempNums) {
        const left = this.#bars[j - 1];
        const right = this.#bars[j];

        left.classList.add('active');
        right.classList.add('active');

        this.#nums[j] = this.#nums[j - 1];
        this.#bars[j] = this.#bars[j - 1];
        this.#swap(this.#bars[j], j, tempBars, j - 1);
        
        await this.#sleep();

        left.classList.remove('active');
        right.classList.remove('active');

        swap = true;
        j--;
      }

      if (j > 0 && !swap) {
        const left = this.#bars[j - 1];
        left.classList.add('active');
        await this.#sleep();
        left.classList.remove('active');
        continue;
      }

      this.#nums[j] = tempNums;
      this.#bars[j] = tempBars;
      this.#swap(tempBars, j);

      await this.#sleep();
    }

    this.#isInProcess = false;
  }

  async selectionSort() {

    if (this.#isInProcess) return;
    this.#isInProcess = true;

    for (let i = 0; i < this.#nums.length; i++) {
      let min = this.#nums[i];
      let index = i;

      for (let j = i + 1; j < this.#nums.length; j++) {
        const left = this.#bars[index];
        const right = this.#bars[j];

        left.classList.add('active');
        right.classList.add('active');

        if (this.#nums[j] < min) {
          min = this.#nums[j];
          index = j;
        }

        await this.#sleep();

        left.classList.remove('active');
        right.classList.remove('active');
      }

      if (index === i) continue;
      
      [this.#nums[i], this.#nums[index]] = [this.#nums[index], this.#nums[i]];
      
      this.#swap(this.#bars[i], index, this.#bars[index], i);
      
      [this.#bars[i], this.#bars[index]] = [this.#bars[index], this.#bars[i]];
      

      await this.#sleep();
    } 

    this.#isInProcess = false;
  }

  async quickSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;
    await this.#executeQuickSort();
    this.#isInProcess = false;
  }

  async #executeQuickSort(left = 0, right = this.#nums.length - 1) {
    if (left >= right) return;

    const partition = async (left, right) => {
      let pivotNumber = this.#nums[right];
      let i = left - 1;
      let j = left;

      while(j < right) {
        if (this.#nums[j] < pivotNumber) {
          i++;
          [this.#nums[i], this.#nums[j]] = [this.#nums[j], this.#nums[i]];
          this.#swap(this.#bars[i], j, this.#bars[j], i);
          [this.#bars[i], this.#bars[j]] = [this.#bars[j], this.#bars[i]];

          await this.#sleep();
        }

        j++;
      }

      i++;

      [this.#nums[i], this.#nums[right]] = [this.#nums[right], this.#nums[i]];
      this.#swap(this.#bars[i], right, this.#bars[right], i);
      [this.#bars[i], this.#bars[right]] = [this.#bars[right], this.#bars[i]];

      await this.#sleep();

      return i;
    }

    let pi = await partition(left, right);

    await this.#executeQuickSort(left, pi - 1);
    await this.#executeQuickSort(pi + 1, right);
  }

  async mergeSort() {
    if (this.#isInProcess) return;
    this.#isInProcess = true;
    this.#nums = await this.#executeMergeSort();
    this.#isInProcess = false;
  }

  async #executeMergeSort(arr = this.#nums) {
    if (arr.length <= 1) return arr;

    let mid = Math.floor(arr.length / 2);
    let left = await this.#executeMergeSort(arr.slice(0, mid));
    let right = await this.#executeMergeSort(arr.slice(mid));

    function merge(left, right) {
      let newArr = [];
      let i = 0;
      let j = 0;

      while(i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          newArr.push(left[i]);
          i++;
        } else {
          newArr.push(right[j]);
          j++;
        }
      }

      while(i < left.length) {
        newArr.push(left[i]);
        i++;
      } 

      while(j < right.length) {
        newArr.push(right[j]);
        j++;
      }

      return newArr;
    }
    
    return merge(left, right);
  }
  
  #swap(firstB, next, secondB, previous) {
    const [barWidth, moveToX] = this.#calculateDimensions();

    firstB.style.setProperty('--position', `${next * moveToX}px`);
    firstB.dataset.index = next;

    if (!secondB) return;

    secondB.style.setProperty('--position', `${previous * moveToX}px`);
    secondB.dataset.index = previous;
  }

  #sleep() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}
