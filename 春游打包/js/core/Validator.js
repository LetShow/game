export class Validator {
  constructor(grid) {
    this.grid = grid;
  }

  validatePlacement(item, x, y) {
    const errors = [];
    const warnings = [];

    const boundsCheck = this.checkBounds(item, x, y);
    if (!boundsCheck.valid) {
      return { valid: false, errors: boundsCheck.errors };
    }

    const overlapCheck = this.checkOverlap(item, x, y);
    if (!overlapCheck.valid) {
      return { valid: false, errors: overlapCheck.errors };
    }

    const edgeCheck = this.checkEdge(item, x, y);
    if (!edgeCheck.valid) {
      return { valid: false, errors: edgeCheck.errors };
    }

    const nooverCheck = this.checkNoover(item, x, y);
    if (!nooverCheck.valid) {
      return { valid: false, errors: nooverCheck.errors };
    }

    const noexposedCheck = this.checkNoexposed(item, x, y);
    if (!noexposedCheck.valid) {
      return { valid: false, errors: noexposedCheck.errors };
    }

    return { valid: true, errors: [], warnings: [] };
  }

  checkBounds(item, x, y) {
    const errors = [];
    const shape = item.shape;
    const h = shape.length;
    const w = shape[0].length;

    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = x + dx;
          const absY = y + dy;
          
          if (absX < 0) {
            if (!item.edge) {
              errors.push('这个不能放侧边袋');
            } else if (this.grid.leftPocketSize === 0) {
              errors.push('放不下啦！超出左边边界');
            }
          } else if (absX >= this.grid.width) {
            if (!item.edge) {
              errors.push('这个不能放侧边袋');
            } else if (this.grid.rightPocketSize === 0) {
              errors.push('放不下啦！超出右边边界');
            }
          } else if (absY < 0 || absY >= this.grid.height) {
            errors.push('放不下啦！超出边界');
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  checkOverlap(item, x, y) {
    const errors = [];
    const shape = item.shape;
    const h = shape.length;
    const w = shape[0].length;

    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = x + dx;
          const absY = y + dy;
          const cellIndex = this.grid.getCellIndex(absX, absY);

          if (cellIndex !== -1 && this.grid.cells[cellIndex] !== null) {
            errors.push('这里已经有东西了！');
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  checkEdge(item, x, y) {
    const errors = [];
    
    if (!item.edge) {
      return { valid: true, errors: [] };
    }

    const inLeftPocket = x < 0 && this.grid.leftPocketSize > 0;
    const inRightPocket = x >= this.grid.width && this.grid.rightPocketSize > 0;
    
    if (!inLeftPocket && !inRightPocket) {
      errors.push('这个要靠边放~');
    }

    return { valid: errors.length === 0, errors };
  }

  checkNoover(item, x, y) {
    if (!item.noover) {
      return { valid: true, errors: [] };
    }

    if (y > 0) {
      return { valid: false, errors: ['这个容易被压，放最上面吧！'] };
    }

    return { valid: true, errors: [] };
  }

  checkNoexposed(item, x, y) {
    if (!item.noexposed) {
      return { valid: true, errors: [] };
    }

    if (y === 0) {
      return { valid: false, errors: ['这个不能外露，需要有东西盖在上面'] };
    }

    return { valid: true, errors: [] };
  }

  checkAllPlacements() {
    const allErrors = [];
    
    for (const placed of this.grid.placedItems) {
      const result = this.validatePlacement(placed.item, placed.x, placed.y);
      if (!result.valid) {
        allErrors.push(...result.errors);
      }
    }
    
    return { valid: allErrors.length === 0, errors: allErrors };
  }

  isComplete() {
    return this.grid.getMainGridEmptyCount() === 0;
  }

  canRemoveItemAt(x, y) {
    return this.grid.getCellIndex(x, y) !== -1 && this.grid.cells[this.grid.getCellIndex(x, y)] !== null;
  }
}