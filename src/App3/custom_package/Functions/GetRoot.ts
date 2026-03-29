const getRoot = (): HTMLElement => {
  const rootEl: HTMLElement | null = document.getElementById("root");
  if (rootEl !== null) {
    return rootEl;
  } else {
    return document.body;
  }
};

export default getRoot;
