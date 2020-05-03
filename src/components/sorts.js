const createSortTemplate = (sort) => {
  return (
    `<li><a href="#" class="sort__button ${sort.active ? `sort__button--active` : ``}">
      Sort by ${sort.name}
    </a></li>`
  );
};

const createSortsListTemplate = (sorts) => {
  return sorts.map((sort) => {
    return createSortTemplate(sort);
  }).join(``);
};

const createSortsTemplate = (sorts) => {
  return (
    `<ul class="sort">
      ${createSortsListTemplate(sorts)}
    </ul>`
  );
};

export {createSortsTemplate};
