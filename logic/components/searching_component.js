export class SearchingVisualizer {
  constructor(...nums) {
    this.container = document.createElement('div');
    this.container.classList.add('container');

    this.board = document.createElement('div');
    this.board.classList.add('board');
    this.container.append(this.board);

    this.nums = nums;
    this.createTiles();
    this.renderTiles();
  }

  createTiles() {
    this.tiles = [];

    for (let i = 0; i < this.nums.length; i++) {
      const current = this.nums[i];
      const el = document.createElement('div');
      el.classList.add('tile');
      el.textContent = current;
      this.tiles.push(el);
    }
  }

  renderTiles() {
    this.tiles.forEach(tile => {
      this.board.append(tile);
    })
  }
}