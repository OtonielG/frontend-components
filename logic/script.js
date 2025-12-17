import { SortingVisualizer } from "./components/sorting_component.js";

const bodyEl = document.querySelector('body');

const sorting = new SortingVisualizer(30, 200, 150, 80, 110);
bodyEl.append(sorting.container);
sorting.addNewValue(400);