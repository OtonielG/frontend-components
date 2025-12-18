import { SortingVisualizer } from "./components/sorting_component.js";

const bubbleBtn = document.querySelector('.bubble-js');
const insertionBtn = document.querySelector('.insertion-js');
const selectionBtn = document.querySelector('.selection-js');


const sorting = new SortingVisualizer(30, 200, 100, 50, 90, 150);
document.body.append(sorting.container);

bubbleBtn.addEventListener('click', () => {
  sorting.bubbleSort();
});
insertionBtn.addEventListener('click', () => {
  sorting.insertionSort();
});
selectionBtn.addEventListener('click', () => {
  sorting.selectionSort();
});