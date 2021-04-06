const {genid} = require('../utils/genid');

function flexiGrid({widthByPixel, numberOfColumns, rowHeightByPixel, gapByPixel}) {
  let thisWidthByPixel = typeof widthByPixel === 'number' ? widthByPixel : 1280;
  let thisNumberOfColumns = typeof numberOfColumns === 'number' ? numberOfColumns : 24;
  let thisRowHeightByPixel = typeof rowHeightByPixel === 'number' ? rowHeightByPixel : 80;
  let thisGapByPixel = typeof gapByPixel === 'number' ? gapByPixel : 5;
  let thisPreviewPane = null;
  let thisPanePreviewing = null;
  const thisPaneIds = [];
  const thisPaneInstances = {};

  function isTwoPanesCollided(sourcePaneInstance, destPaneInstance) {
    const [sourceXByGridCell, sourceYByGridCell] = sourcePaneInstance.getXYByGridCell();
    const [sourceWidthByGridCell, sourceHeightByGridCell] = sourcePaneInstance.getWidthHeightByGridCell();
    const [destXByGridCell, destYByGridCell] = destPaneInstance.getXYByGridCell();
    const [destWidthByGridCell, destHeightByGridCell] = destPaneInstance.getWidthHeightByGridCell();
    return (
      sourceXByGridCell <= destXByGridCell + destWidthByGridCell - 1 
      && sourceXByGridCell + sourceWidthByGridCell - 1 >= destXByGridCell
      && sourceYByGridCell <= destYByGridCell + destHeightByGridCell - 1 
      && sourceYByGridCell + sourceHeightByGridCell - 1 >= destYByGridCell
    );
  }

  function calculateVectorByPixelFromPixels([sourceXByPixel, sourceYByPixel], [destXByPixel, destYByPixel]) {
    return [destXByPixel - sourceXByPixel, destYByPixel - sourceYByPixel];
  }

  function calculateVectorByGridCellFromPixels([sourceXByPixel, sourceYByPixel], [destXByPixel, destYByPixel]) {
    const [sourceXByGridCell, sourceYByGridCell] = getXYByGridCellFromPixel([sourceXByPixel, sourceYByPixel]);
    const [destXByGridCell, destYByGridCell] = getXYByGridCellFromPixel([destXByPixel, destYByPixel]);
    return [destXByGridCell - sourceXByGridCell, destYByGridCell - sourceYByGridCell];
  }

  function getGridData() {
    return {
      widthByPixel: thisWidthByPixel,
      numberOfColumns: thisNumberOfColumns,
      rowHeightByPixel: thisRowHeightByPixel,
      gapByPixel: thisGapByPixel,
    };
  }

  function getPaneIds() {
    return [...thisPaneIds];
  }

  function getPane(paneId) {
    return thisPaneInstances[paneId] || null;
  }

  function getPreviewPane() {
    return thisPreviewPane;
  }

  function getCellSizeByPixel() {
    const cellWidthByPixel = (thisWidthByPixel - thisGapByPixel * (thisNumberOfColumns - 1)) / thisNumberOfColumns;
    const cellHeightByPixel = thisRowHeightByPixel;
    return [cellWidthByPixel, cellHeightByPixel];
  }

  function getGridHeightByPixel() {
    let maxHeightByPixel = 0;
    for (let i = 0; i < thisPaneIds.length; i += 1) {
      const [, bottomRightYByPixel] = getPane(thisPaneIds[i]).getBottomRightXYByPixel();
      maxHeightByPixel = (maxHeightByPixel < bottomRightYByPixel) ? bottomRightYByPixel : maxHeightByPixel;
    }
    return maxHeightByPixel;
  }

  function getGridHeightByGridCell() {
    const [, maxYByGridCell] = getXYByGridCellFromPixel([0, getGridHeightByPixel()]);
    return maxYByGridCell + 1;
  }

  function getXYByGridCellFromPixel([xByPixel, yByPixel]) {
    const cellSizeByPixel = getCellSizeByPixel();
    const xByGridCell = Math.floor(xByPixel / (cellSizeByPixel[0] + thisGapByPixel));
    const yByGridCell = Math.floor(yByPixel / (cellSizeByPixel[1] + thisGapByPixel));
    return [xByGridCell, yByGridCell];
  }

  function getCurrentState() {
    return {
      widthByPixel: thisWidthByPixel,
      numberOfColumns: thisNumberOfColumns,
      rowHeightByPixel: thisRowHeightByPixel,
      gapByPixel: thisGapByPixel,
      previewPane: thisPreviewPane,
      panePreviewing: thisPanePreviewing,
      paneIds: thisPaneIds,
      paneInstances: thisPaneInstances,
    };
  }


  function setGridParameter({widthByPixel, numberOfColumns, rowHeightByPixel, gapByPixel}) {
    if (typeof widthByPixel === 'number') {
      thisWidthByPixel = widthByPixel;
    }
    if (typeof numberOfColumns === 'number') {
      thisNumberOfColumns = numberOfColumns;
    }
    if (typeof rowHeightByPixel === 'number') {
      thisRowHeightByPixel = rowHeightByPixel;
    }
    if (typeof gapByPixel === 'number') {
      thisGapByPixel = gapByPixel;
    }
  }

  function addPaneWithRandomId(newPane) {
    const paneId = genid();
    thisPaneIds.push(paneId);
    thisPaneInstances[paneId] = newPane;
    newPane.belongsToGrid(gridInstance, paneId);
    return paneId;
  }

  function addPaneWithSpecificId(newPane, paneId) {
    if (paneId) {
      thisPaneIds.push(paneId);
      thisPaneInstances[paneId] = newPane;
      newPane.belongsToGrid(gridInstance, paneId);
      return paneId;
    } else {
      throw new Error('Grid.addPaneWithSpecificId: paneId must not be empty');
    }
  }

  function removePane(paneId) {
    const paneIdIndex = thisPaneIds.findIndex((id) => id === paneId);
    thisPaneIds.splice(paneIdIndex, 1);
    thisPaneInstances[paneId].belongsToGrid(null, null);
    delete thisPaneInstances[paneId];
  }

  function setPreviewPaneWithRandomId(previewPane) {
    const previewPaneId = genid();
    thisPreviewPane = previewPane;
    previewPane.belongsToGrid(gridInstance, previewPaneId);
    return previewPaneId;
  }

  function setPreviewPaneWithSpecificId(previewPane, previewPaneId) {
    if (previewPaneId) {
      thisPreviewPane = previewPane;
      previewPane.belongsToGrid(gridInstance, previewPaneId);
      return previewPaneId;
    } else {
      throw new Error('Grid.setPreviewPaneWithSpecificId: previewPaneId must not be empty');
    }
  }

  function attachPreview(paneInstance) {
    paneInstance.increaseZIndexLevel();
    paneInstance.increaseZIndexLevel();
    thisPreviewPane.increaseZIndexLevel();
    thisPanePreviewing = paneInstance;
    thisPreviewPane.setXYByGridCell(paneInstance.getXYByGridCell());
    thisPreviewPane.setWidthHeightByGridCell(paneInstance.getWidthHeightByGridCell());
  }

  function detachPreview() {
    if (thisPanePreviewing) {
      thisPanePreviewing.decreaseZIndexLevel();
      thisPanePreviewing.decreaseZIndexLevel();
      thisPreviewPane.decreaseZIndexLevel();
      thisPanePreviewing = null;
    }
  }

  function isHavingAnyCollision() {
    let panesToConsider = [];
    if (thisPanePreviewing) {
      panesToConsider = (
        thisPaneIds
          .filter((paneId) => (paneId !== thisPanePreviewing.getId()))
          .map((paneId) => getPane(paneId))
      ).concat(
        [getPreviewPane()]
      );
    } else {
      panesToConsider = thisPaneIds.map((paneId) => getPane(paneId));
    }
    for (let i = 0; i < panesToConsider.length - 1; i += 1) {
      for (let j = i + 1; j < panesToConsider.length; j += 1) {
        if (isTwoPanesCollided(panesToConsider[i], panesToConsider[j])) {
          return true;
        }
      }
    }
    return false;
  }

  function isHavingCollisionWithPreviewPane() {
    const previewPane = getPreviewPane();
    let panesToConsider = [];
    if (thisPanePreviewing) {
      panesToConsider = (
        thisPaneIds
          .filter((paneId) => (paneId !== thisPanePreviewing.getId()))
          .map((paneId) => getPane(paneId))
      );
      for (let i = 0; i < panesToConsider.length; i += 1) {
        if (isTwoPanesCollided(previewPane, panesToConsider[i])) {
          return true;
        }
      }
    }
    return false;
  }

  const gridInstance = {
    calculateVectorByPixelFromPixels,
    calculateVectorByGridCellFromPixels,

    getGridData,
    getPaneIds,
    getPane,
    getPreviewPane,
    getCellSizeByPixel,
    getGridHeightByPixel,
    getGridHeightByGridCell,
    getXYByGridCellFromPixel,
    getCurrentState,

    setPreviewPaneWithRandomId,
    setPreviewPaneWithSpecificId,
    attachPreview,
    detachPreview,
    setGridParameter,
    addPaneWithRandomId,
    addPaneWithSpecificId,
    removePane,
    isHavingAnyCollision,
    isHavingCollisionWithPreviewPane,
  };

  return gridInstance;
};

module.exports = {flexiGrid};
