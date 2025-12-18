import { SortingVisualizer } from "./components/sorting_component.js";

const bubbleBtn = document.querySelector('.bubble-js');
const insertionBtn = document.querySelector('.insertion-js');
const selectionBtn = document.querySelector('.selection-js');
const quickBtn = document.querySelector('.quick-js');

const sorting = new SortingVisualizer(8, 2, 4, 7, 1, 3, 9, 6, 5);
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
quickBtn.addEventListener('click', () => {
  sorting.quickSort();
})