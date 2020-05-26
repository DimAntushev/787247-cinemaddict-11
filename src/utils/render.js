const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const createElement = (markup) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = markup;

  return newElement.firstChild;
};

const render = (container, component, position = `beforeend`) => {
  switch (position) {
    case `afterbegin`:
      container.prepend(component.getElement());
      break;
    case `afterend`:
      container.after(component.getElement());
      break;
    case `beforeend`:
      container.append(component.getElement());
      break;
  }
};

const replace = (newElement, oldElement) => {
  oldElement.getElement().replaceWith(newElement.getElement());
};

const remove = (element) => {
  element.getElement().remove();
};

export {createElement, render, replace, remove, RenderPosition};
