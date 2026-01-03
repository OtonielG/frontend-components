// import { SortingVisualizer } from "./components/sorting_component.js";

// // const bubbleBtn = document.querySelector('.bubble-js');
// // const insertionBtn = document.querySelector('.insertion-js');
// // const selectionBtn = document.querySelector('.selection-js');
// // const quickBtn = document.querySelector('.quick-js');
// // const mergeBtn = document.querySelector('.merge-js');

// // const arr = [
// //   73, 12, 94, 38, 61,
// //   5, 87, 29, 46, 18,
// //   90, 7, 54, 81, 33,
// //   66, 21, 99, 14, 42,
// //   58, 3, 76, 25, 88,
// //   60, 31, 97, 9, 49,
// //   70, 16, 84, 36, 52,
// //   1, 93, 27, 64, 45,
// //   79, 20, 56, 11, 91
// // ];

// // const sorting = new SortingVisualizer(...arr);
// // document.body.append(sorting.container);

// // bubbleBtn.addEventListener('click', () => {
// //   sorting.bubbleSort();
// // });
// // insertionBtn.addEventListener('click', () => {
// //   sorting.insertionSort();
// // });
// // selectionBtn.addEventListener('click', () => {
// //   sorting.selectionSort();
// // });
// // quickBtn.addEventListener('click', () => {
// //   sorting.quickSort();
// // })
// // mergeBtn.addEventListener('click', () => {
// //   sorting.mergeSort();
// // })

import { SearchingVisualizer } from "./components/searching_component.js";

const searching = new SearchingVisualizer(10, 50, 80, 20, 40);
document.body.append(searching.container);