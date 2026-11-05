export function requestSheet(selection, name) {
  return { name, requestKey: selection.requestKey + 1 };
}

export function dismissSheet(selection, name, requestKey) {
  if (selection.name !== name || selection.requestKey !== requestKey) {
    return selection;
  }
  return requestSheet(selection, null);
}
