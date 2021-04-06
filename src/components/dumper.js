function makeDumpDataFromGrid(grid) {
  const gridState = grid.getCurrentState();
  return {
    widthByPixel: gridState.widthByPixel,
    numberOfColumns: gridState.numberOfColumns,
    rowHeightByPixel: gridState.rowHeightByPixel,
    gapByPixel: gridState.gapByPixel,
    previewPane: makeBluePrintOfPane(gridState.previewPane),
    panePreviewingId: getPanePreviewingId(gridState.panePreviewing),
    paneInstances: makeBluePrintOfPaneInstancesObject(gridState.paneInstances),
  };
}

function makeBluePrintOfPaneInstancesObject(paneInstancesObject) {
  if (paneInstancesObject) {
    const bluePrintsObject = {};
    Object.keys(paneInstancesObject).forEach((paneId) => {
      bluePrintsObject[paneId] = makeBluePrintOfPane(paneInstancesObject[paneId]);
    });
    return bluePrintsObject;
  }
  return null;
}

function makeBluePrintOfPane(pane) {
  if (pane) {
    return pane.getCurrentState();
  }
  return null;
}

function getPanePreviewingId(panePreviewing) {
  if (panePreviewing) {
    return panePreviewing.getId();
  }
  return null;
}

module.exports = {makeDumpDataFromGrid};
