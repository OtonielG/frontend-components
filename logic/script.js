import { SortingVisualizer } from "./components/sorting_component.js";

const bodyEl = document.querySelector('body');
const valueEl = document.querySelector('input');

const sorting = new SortingVisualizer(30, 200, 100, 50, 90, 150);
bodyEl.append(sorting.container);

valueEl.addEventListener('keydown', (e) => {

  const key = e.key;
  if (key !== 'Enter') return;

  sorting.selectionSort();
})