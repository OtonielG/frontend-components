export class SearchingVisualizer {
  constructor(...nums) {
    this.nums = nums;
    this.tiles = [];

    this.createContainer();
    this.createTiles();
    this.renderTiles();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('container');

    this.board = document.createElement('div');
    this.board.classList.add('board');

    this.container.append(this.board);
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