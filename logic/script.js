import { SortingVisualizer } from "./components/sorting_component.js";

const bodyEl = document.querySelector('body');
const valueEl = document.querySelector('input');

const sorting = new SortingVisualizer(30, 200, 150, 80, 110);
bodyEl.append(sorting.container);

valueEl.addEventListener('keydown', (e) => {

  const key = e.key;
  if (key !== 'Enter') return;

  sorting.bubbleSort();
})