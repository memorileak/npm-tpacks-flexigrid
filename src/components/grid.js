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

  function calculateVectorByPixelOfPixels([sourceXByPixel, sourceYByPixel], [destXByPixel, destYByPixel]) {
    return [destXByPixel - sourceXByPixel, destYByPixel - sourceYByPixel];
  }

  function calculateVectorByGridCellOfPixels([sourceXByPixel, sourceYByPixel], [destXByPixel, destYByPixel]) {
    const [sourceXByGridCell, sourceYByGridCell] = getXYByGridCellOfPixel([sourceXByPixel, sourceYByPixel]);
    const [destXByGridCell, destYByGridCell] = getXYByGridCellOfPixel([destXByPixel, destYByPixel]);
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
      const [, bottomRightYByPixel] = getPane(thisPaneIds[i]).px_getBottomRightxy();
      maxHeightByPixel = (maxHeightByPixel < bottomRightYByPixel) ? bottomRightYByPixel : maxHeightByPixel;
    }
    return maxHeightByPixel;
  }

  function getGridHeightByGridCell() {
    const [, maxYByGridCell] = getXYByGridCellOfPixel([0, getGridHeightByPixel()]);
    return maxYByGridCell + 1;
  }

  function getXYByGridCellOfPixel([xByPixel, yByPixel]) {
    const cellSizeByPixel = getCellSizeByPixel();
    const xByGridCell = Math.floor(xByPixel / (cellSizeByPixel[0] + thisGapByPixel));
    const yByGridCell = Math.floor(yByPixel / (cellSizeByPixel[1] + thisGapByPixel));
    return [xByGridCell, yByGridCell];
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

  function addPane(newPane) {
    const paneId = genid();
    thisPaneIds.push(paneId);
    thisPaneInstances[paneId] = newPane;
    newPane.belongsToGrid(gridInstance, paneId);
    return paneId;
  }

  function removePane(paneId) {
    const paneIdIndex = thisPaneIds.findIndex((id) => id === paneId);
    thisPaneIds.splice(paneIdIndex, 1);
    thisPaneInstances[paneId].belongsToGrid(null, null);
    delete thisPaneInstances[paneId];
  }

  function setPreviewPane(previewPane) {
    const previewPaneId = genid();
    previewPane.increaseZIndexLevel();
    thisPreviewPane = previewPane;
    previewPane.belongsToGrid(gridInstance, previewPaneId);
    return previewPaneId;
  }

  function attachPreview(paneInstance) {
    paneInstance.increaseZIndexLevel();
    paneInstance.increaseZIndexLevel();
    thisPanePreviewing = paneInstance;
    thisPreviewPane.setXYByGridCell(paneInstance.getXYByGridCell());
    thisPreviewPane.setWidthHeightByGridCell(paneInstance.getWidthHeightByGridCell());
  }

  function detachPreview() {
    if (thisPanePreviewing) {
      thisPanePreviewing.decreaseZIndexLevel();
      thisPanePreviewing.decreaseZIndexLevel();
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
    calculateVectorByPixelOfPixels,
    calculateVectorByGridCellOfPixels,

    getGridData,
    getPaneIds,
    getPane,
    getPreviewPane,
    getCellSizeByPixel,
    getGridHeightByPixel,
    getXYByGridCellOfPixel,
    getGridHeightByGridCell,

    setPreviewPane,
    attachPreview,
    detachPreview,
    setGridParameter,
    addPane,
    removePane,
    isHavingAnyCollision,
    isHavingCollisionWithPreviewPane,
  };

  return gridInstance;
};

module.exports = {flexiGrid};
