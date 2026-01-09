export class SearchingVisualizer {
  constructor(...nums) {
    this.nums = nums.filter(num => typeof num === 'number');;
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
    this.tiles = this.nums.map(value => this.createTile(value));
  }

  createTile(value) {
    const el = document.createElement('div');
    el.classList.add('tile');
    el.textContent = value;
    return el;
  }

  renderTiles() {
    this.tiles.forEach(tile => {
      this.board.append(tile);
    })
  }
}