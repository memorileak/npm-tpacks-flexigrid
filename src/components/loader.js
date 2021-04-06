const {flexiGrid} = require('./grid.js');
const {flexiPane} = require('./pane.js');

function restoreGridFromDumpData(dumpData) {
  const { 
    gridBluePrint,
    previewPaneBluePrint,
    panePreviewingId,
    paneBluePrintsObject,
  } = extractDumpDataToBluePrints(dumpData);
  const grid = makeGridFromGridBluePrint(gridBluePrint);
  const previewPane = makePaneInstanceFromPaneBluePrint(previewPaneBluePrint);
  const paneInstancesObject = makePaneInstancesObjectFromPaneBluePrintsObject(paneBluePrintsObject);
  const panePreviewing = getPanePreviewingFromPaneInstancesObjectWithId(paneInstancesObject, panePreviewingId);
  attachPreviewPaneToGridWithId(previewPane, grid, previewPaneBluePrint.id);
  attachPaneInstancesObjectToGrid(paneInstancesObject, grid);
  attachPanePreviewingToGrid(panePreviewing, grid);
  return grid;
}

function extractDumpDataToBluePrints(dumpData) {
  const gridBluePrint = {
    widthByPixel: dumpData.widthByPixel,
    numberOfColumns: dumpData.numberOfColumns,
    rowHeightByPixel: dumpData.rowHeightByPixel,
    gapByPixel: dumpData.gapByPixel,
  };
  const previewPaneBluePrint = dumpData.previewPane;
  const panePreviewingId = dumpData.panePreviewingId;
  const paneBluePrintsObject = dumpData.paneInstances;
  return {
    gridBluePrint, 
    previewPaneBluePrint, 
    panePreviewingId, 
    paneBluePrintsObject,
  };
}

function makeGridFromGridBluePrint(gridBluePrint) {
  if (gridBluePrint) {
    return flexiGrid({
      widthByPixel: gridBluePrint.widthByPixel,
      numberOfColumns: gridBluePrint.numberOfColumns,
      rowHeightByPixel: gridBluePrint.rowHeightByPixel,
      gapByPixel: gridBluePrint.gapByPixel,
    });
  } else {
    throw new Error('Loader.makeGridFromGridBluePrint: gridBluePrint cannot be falsy');
  }
}

function makePaneInstancesObjectFromPaneBluePrintsObject(paneBluePrintsObject) {
  if (paneBluePrintsObject) {
    const paneInstancesObject = {};
    Object.keys(paneBluePrintsObject).forEach((paneId) => {
      const paneBluePrint = paneBluePrintsObject[paneId];
      paneInstancesObject[paneId] = makePaneInstanceFromPaneBluePrint(paneBluePrint);
    }); 
    return paneInstancesObject;
  }
  return null;
}

function makePaneInstanceFromPaneBluePrint(paneBluePrint) {
  if (paneBluePrint) {
    return flexiPane({
      xByGridCell: paneBluePrint.xByGridCell,
      yByGridCell: paneBluePrint.yByGridCell,
      widthByGridCell: paneBluePrint.widthByGridCell,
      heightByGridCell: paneBluePrint.heightByGridCell,
    });
  }
  return null
}

function getPanePreviewingFromPaneInstancesObjectWithId(paneInstancesObject, panePreviewingId) {
  if (paneInstancesObject && panePreviewingId) {
    return paneInstancesObject[panePreviewingId];
  }
  return null;
}

function attachPreviewPaneToGridWithId(previewPane, grid, previewPaneId) {
  if (previewPane && previewPaneId) {
    grid.setPreviewPaneWithSpecificId(previewPane, previewPaneId);
  }
}

function attachPaneInstancesObjectToGrid(paneInstancesObject, grid) {
  if (paneInstancesObject) {
    Object.keys(paneInstancesObject).forEach((paneId) => {
      attachPaneToGridWithId(paneInstancesObject[paneId], grid, paneId);
    });
  }
}

function attachPaneToGridWithId(pane, grid, paneId) {
  if (pane && paneId) {
    grid.addPaneWithSpecificId(pane, paneId);
  }
}

function attachPanePreviewingToGrid(panePreviewing, grid) {
  if (panePreviewing) {
    grid.attachPreview(panePreviewing);
  }
}

module.exports = {restoreGridFromDumpData};
