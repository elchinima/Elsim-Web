class ClickSpark {
	constructor({
		target = document.body,
		sparkColor = '#fff',
		sparkSize = 10,
		sparkRadius = 15,
		sparkCount = 8,
		duration = 400,
		easing = 'ease-out',
		extraScale = 1
	} = {}) {
		this.target = target;
		this.sparkColor = sparkColor;
		this.sparkSize = sparkSize;
		this.sparkRadius = sparkRadius;
		this.sparkCount = sparkCount;
		this.duration = duration;
		this.easing = easing;
		this.extraScale = extraScale;

		this.canvas = null;
		this.ctx = null;
		this.sparks = [];
		this.frameId = null;
		this.resizeObserver = null;
		this.resizeTimer = null;

		this.handleClick = this.handleClick.bind(this);
		this.resizeCanvas = this.resizeCanvas.bind(this);
		this.draw = this.draw.bind(this);

		this.init();
	}

	init() {
		if (!this.target) return;

		this.target.classList.add('click-spark-root');

		this.canvas = document.createElement('canvas');
		this.canvas.className = 'click-spark-canvas';
		this.target.appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');
		this.resizeCanvas();

		this.target.addEventListener('click', this.handleClick);

		if (typeof ResizeObserver !== 'undefined') {
			this.resizeObserver = new ResizeObserver(() => {
				clearTimeout(this.resizeTimer);
				this.resizeTimer = setTimeout(this.resizeCanvas, 100);
			});
			this.resizeObserver.observe(this.target);
		} else {
			window.addEventListener('resize', this.resizeCanvas);
		}
	}

	easeFunc(t) {
		switch (this.easing) {
			case 'linear':
				return t;
			case 'ease-in':
				return t * t;
			case 'ease-in-out':
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
			default:
				return t * (2 - t);
		}
	}

	resizeCanvas() {
		if (!this.canvas || !this.ctx || !this.target) return;

		const rect = this.target.getBoundingClientRect();
		const width = Math.max(1, Math.round(rect.width));
		const height = Math.max(1, Math.round(rect.height));
		const dpr = window.devicePixelRatio || 1;

		this.canvas.width = Math.round(width * dpr);
		this.canvas.height = Math.round(height * dpr);

		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	handleClick(event) {
		if (!this.canvas) return;

		const rect = this.canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const now = performance.now();

		for (let i = 0; i < this.sparkCount; i += 1) {
			this.sparks.push({
				x,
				y,
				angle: (2 * Math.PI * i) / this.sparkCount,
				startTime: now
			});
		}

		if (!this.frameId) {
			this.frameId = requestAnimationFrame(this.draw);
		}
	}

	draw(timestamp) {
		if (!this.canvas || !this.ctx) {
			this.frameId = null;
			return;
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.sparks = this.sparks.filter((spark) => {
			const elapsed = timestamp - spark.startTime;
			if (elapsed >= this.duration) {
				return false;
			}

			const progress = elapsed / this.duration;
			const eased = this.easeFunc(progress);
			const distance = eased * this.sparkRadius * this.extraScale;
			const lineLength = this.sparkSize * (1 - eased);

			const x1 = spark.x + distance * Math.cos(spark.angle);
			const y1 = spark.y + distance * Math.sin(spark.angle);
			const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
			const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

			this.ctx.strokeStyle = this.sparkColor;
			this.ctx.lineWidth = 2;
			this.ctx.beginPath();
			this.ctx.moveTo(x1, y1);
			this.ctx.lineTo(x2, y2);
			this.ctx.stroke();

			return true;
		});

		if (this.sparks.length) {
			this.frameId = requestAnimationFrame(this.draw);
		} else {
			this.frameId = null;
		}
	}

	destroy() {
		if (this.frameId) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		} else {
			window.removeEventListener('resize', this.resizeCanvas);
		}

		clearTimeout(this.resizeTimer);

		if (this.target) {
			this.target.removeEventListener('click', this.handleClick);
		}

		if (this.canvas && this.canvas.parentElement) {
			this.canvas.parentElement.removeChild(this.canvas);
		}

		this.sparks = [];
	}
}

window.ClickSpark = ClickSpark;

document.addEventListener('DOMContentLoaded', () => {
	const pageRoot = document.body;
	if (!pageRoot) return;

	new ClickSpark({
		target: pageRoot,
		sparkColor: '#f0ece4',
		sparkSize: 10,
		sparkRadius: 15,
		sparkCount: 8,
		duration: 400,
		easing: 'ease-out',
		extraScale: 1
	});
});

(function () {
    const VALID_DIRECTIONS = ['diagonal', 'up', 'right', 'down', 'left'];
    const VALID_SHAPES = ['square', 'hexagon', 'circle', 'triangle'];

    const DEFAULT_OPTIONS = {
        direction: 'right',
        speed: 1,
        borderColor: '#999',
        squareSize: 40,
        hoverFillColor: '#222',
        shape: 'square',
        hoverTrailAmount: 0,
        className: '',
        pointerTarget: null
    };

    function getElement(target) {
        if (!target) return null;
        if (typeof target === 'string') return document.querySelector(target);
        if (target instanceof Element) return target;
        return null;
    }

    function normalizeOptions(input) {
        const source = { ...DEFAULT_OPTIONS, ...input };

        if (typeof source.size === 'number' && source.squareSize == null) {
            source.squareSize = source.size;
        }

        const direction = VALID_DIRECTIONS.includes(source.direction)
            ? source.direction
            : DEFAULT_OPTIONS.direction;

        const shape = VALID_SHAPES.includes(source.shape)
            ? source.shape
            : DEFAULT_OPTIONS.shape;

        const speedValue = Number(source.speed);
        const speed = Number.isFinite(speedValue) ? speedValue : DEFAULT_OPTIONS.speed;

        const squareSizeValue = Number(source.squareSize);
        const squareSize = Number.isFinite(squareSizeValue)
            ? Math.max(8, squareSizeValue)
            : DEFAULT_OPTIONS.squareSize;

        const hoverTrailValue = Number(source.hoverTrailAmount);
        const hoverTrailAmount = Number.isFinite(hoverTrailValue)
            ? Math.max(0, Math.floor(hoverTrailValue))
            : DEFAULT_OPTIONS.hoverTrailAmount;

        return {
            ...source,
            direction,
            speed,
            borderColor: typeof source.borderColor === 'string' ? source.borderColor : DEFAULT_OPTIONS.borderColor,
            squareSize,
            hoverFillColor: typeof source.hoverFillColor === 'string' ? source.hoverFillColor : DEFAULT_OPTIONS.hoverFillColor,
            shape,
            hoverTrailAmount,
            className: typeof source.className === 'string' ? source.className : '',
            pointerTarget: source.pointerTarget
        };
    }

    class ShapeGrid {
        constructor(target, options) {
            this.host = getElement(target);
            if (!this.host) {
                throw new Error('ShapeGrid target element not found.');
            }

            this.options = normalizeOptions(options || {});

            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('aria-hidden', 'true');
            this.canvas.className = this.getCanvasClassName();

            this.host.appendChild(this.canvas);

            this.ctx = this.canvas.getContext('2d');

            this.width = 0;
            this.height = 0;
            this.dpr = 1;

            this.gridOffset = { x: 0, y: 0 };
            this.hoveredCell = null;
            this.trailCells = [];
            this.cellOpacities = new Map();

            this.pointerTarget = getElement(this.options.pointerTarget) || this.host;

            this.requestRef = null;
            this.running = false;

            this.handleResize = this.handleResize.bind(this);
            this.handlePointerMove = this.handlePointerMove.bind(this);
            this.handlePointerLeave = this.handlePointerLeave.bind(this);
            this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
            this.tick = this.tick.bind(this);

            this.start();
        }

        getCanvasClassName() {
            return this.options.className
                ? `shapegrid-canvas ${this.options.className}`
                : 'shapegrid-canvas';
        }

        start() {
            if (!this.ctx || this.running) return;

            this.running = true;
            this.handleResize();

            window.addEventListener('resize', this.handleResize, { passive: true });
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            this.pointerTarget.addEventListener('pointermove', this.handlePointerMove, { passive: true });
            this.pointerTarget.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });

            this.requestRef = requestAnimationFrame(this.tick);
        }

        destroy() {
            this.running = false;

            if (this.requestRef) {
                cancelAnimationFrame(this.requestRef);
                this.requestRef = null;
            }

            window.removeEventListener('resize', this.handleResize);
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            this.pointerTarget.removeEventListener('pointermove', this.handlePointerMove);
            this.pointerTarget.removeEventListener('pointerleave', this.handlePointerLeave);

            if (this.canvas.parentNode === this.host) {
                this.host.removeChild(this.canvas);
            }
        }

        updateOptions(nextOptions) {
            this.options = normalizeOptions({ ...this.options, ...(nextOptions || {}) });
            this.canvas.className = this.getCanvasClassName();

            const nextPointerTarget = getElement(this.options.pointerTarget) || this.host;
            if (nextPointerTarget !== this.pointerTarget) {
                this.pointerTarget.removeEventListener('pointermove', this.handlePointerMove);
                this.pointerTarget.removeEventListener('pointerleave', this.handlePointerLeave);
                this.pointerTarget = nextPointerTarget;
                this.pointerTarget.addEventListener('pointermove', this.handlePointerMove, { passive: true });
                this.pointerTarget.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });
            }

            this.handleResize();
        }

        handleVisibilityChange() {
            if (document.hidden) {
                if (this.requestRef) {
                    cancelAnimationFrame(this.requestRef);
                    this.requestRef = null;
                }
                return;
            }

            if (this.running && !this.requestRef) {
                this.requestRef = requestAnimationFrame(this.tick);
            }
        }

        handleResize() {
            const rect = this.host.getBoundingClientRect();
            const width = Math.max(1, Math.round(rect.width));
            const height = Math.max(1, Math.round(rect.height));
            const dpr = Math.max(1, window.devicePixelRatio || 1);

            if (this.width === width && this.height === height && this.dpr === dpr) {
                return;
            }

            this.width = width;
            this.height = height;
            this.dpr = dpr;

            this.canvas.width = Math.max(1, Math.floor(width * dpr));
            this.canvas.height = Math.max(1, Math.floor(height * dpr));
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.ctx.lineWidth = 1;
        }

        tick() {
            if (!this.running) return;

            this.updateAnimation();
            this.updateCellOpacities();
            this.drawGrid();

            this.requestRef = requestAnimationFrame(this.tick);
        }

        updateAnimation() {
            const { direction, speed, shape, squareSize } = this.options;

            const isHex = shape === 'hexagon';
            const isTri = shape === 'triangle';
            const hexHoriz = squareSize * 1.5;
            const hexVert = squareSize * Math.sqrt(3);

            const effectiveSpeed = Math.max(speed, 0.1);
            const wrapX = isHex ? hexHoriz * 2 : squareSize;
            const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize;

            switch (direction) {
                case 'right':
                    this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
                    break;
                case 'left':
                    this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
                    break;
                case 'up':
                    this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
                    break;
                case 'down':
                    this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
                    break;
                case 'diagonal':
                    this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
                    this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
                    break;
                default:
                    break;
            }
        }

        drawHex(cx, cy, size) {
            const ctx = this.ctx;
            ctx.beginPath();
            for (let i = 0; i < 6; i += 1) {
                const angle = (Math.PI / 3) * i;
                const vx = cx + size * Math.cos(angle);
                const vy = cy + size * Math.sin(angle);

                if (i === 0) {
                    ctx.moveTo(vx, vy);
                } else {
                    ctx.lineTo(vx, vy);
                }
            }
            ctx.closePath();
        }

        drawCircle(cx, cy, size) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
            ctx.closePath();
        }

        drawTriangle(cx, cy, size, flip) {
            const ctx = this.ctx;
            ctx.beginPath();
            if (flip) {
                ctx.moveTo(cx, cy + size / 2);
                ctx.lineTo(cx + size / 2, cy - size / 2);
                ctx.lineTo(cx - size / 2, cy - size / 2);
            } else {
                ctx.moveTo(cx, cy - size / 2);
                ctx.lineTo(cx + size / 2, cy + size / 2);
                ctx.lineTo(cx - size / 2, cy + size / 2);
            }
            ctx.closePath();
        }

        drawGrid() {
            const { ctx, width, height } = this;
            const { borderColor, hoverFillColor, shape, squareSize } = this.options;

            if (!width || !height) return;

            const isHex = shape === 'hexagon';
            const isTri = shape === 'triangle';

            const hexHoriz = squareSize * 1.5;
            const hexVert = squareSize * Math.sqrt(3);

            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1;

            if (isHex) {
                const colShift = Math.floor(this.gridOffset.x / hexHoriz);
                const offsetX = ((this.gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
                const offsetY = ((this.gridOffset.y % hexVert) + hexVert) % hexVert;

                const cols = Math.ceil(width / hexHoriz) + 3;
                const rows = Math.ceil(height / hexVert) + 3;

                for (let col = -2; col < cols; col += 1) {
                    for (let row = -2; row < rows; row += 1) {
                        const cx = col * hexHoriz + offsetX;
                        const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;

                        const cellKey = `${col},${row}`;
                        const alpha = this.cellOpacities.get(cellKey);

                        if (alpha) {
                            ctx.globalAlpha = alpha;
                            this.drawHex(cx, cy, squareSize);
                            ctx.fillStyle = hoverFillColor;
                            ctx.fill();
                            ctx.globalAlpha = 1;
                        }

                        this.drawHex(cx, cy, squareSize);
                        ctx.strokeStyle = borderColor;
                        ctx.stroke();
                    }
                }
            } else if (isTri) {
                const halfW = squareSize / 2;
                const colShift = Math.floor(this.gridOffset.x / halfW);
                const rowShift = Math.floor(this.gridOffset.y / squareSize);
                const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
                const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;

                const cols = Math.ceil(width / halfW) + 4;
                const rows = Math.ceil(height / squareSize) + 4;

                for (let col = -2; col < cols; col += 1) {
                    for (let row = -2; row < rows; row += 1) {
                        const cx = col * halfW + offsetX;
                        const cy = row * squareSize + squareSize / 2 + offsetY;
                        const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;

                        const cellKey = `${col},${row}`;
                        const alpha = this.cellOpacities.get(cellKey);

                        if (alpha) {
                            ctx.globalAlpha = alpha;
                            this.drawTriangle(cx, cy, squareSize, flip);
                            ctx.fillStyle = hoverFillColor;
                            ctx.fill();
                            ctx.globalAlpha = 1;
                        }

                        this.drawTriangle(cx, cy, squareSize, flip);
                        ctx.strokeStyle = borderColor;
                        ctx.stroke();
                    }
                }
            } else if (shape === 'circle') {
                const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
                const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;

                const cols = Math.ceil(width / squareSize) + 3;
                const rows = Math.ceil(height / squareSize) + 3;

                for (let col = -2; col < cols; col += 1) {
                    for (let row = -2; row < rows; row += 1) {
                        const cx = col * squareSize + squareSize / 2 + offsetX;
                        const cy = row * squareSize + squareSize / 2 + offsetY;

                        const cellKey = `${col},${row}`;
                        const alpha = this.cellOpacities.get(cellKey);

                        if (alpha) {
                            ctx.globalAlpha = alpha;
                            this.drawCircle(cx, cy, squareSize);
                            ctx.fillStyle = hoverFillColor;
                            ctx.fill();
                            ctx.globalAlpha = 1;
                        }

                        this.drawCircle(cx, cy, squareSize);
                        ctx.strokeStyle = borderColor;
                        ctx.stroke();
                    }
                }
            } else {
                const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
                const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;

                const cols = Math.ceil(width / squareSize) + 3;
                const rows = Math.ceil(height / squareSize) + 3;

                for (let col = -2; col < cols; col += 1) {
                    for (let row = -2; row < rows; row += 1) {
                        const sx = col * squareSize + offsetX;
                        const sy = row * squareSize + offsetY;

                        const cellKey = `${col},${row}`;
                        const alpha = this.cellOpacities.get(cellKey);

                        if (alpha) {
                            ctx.globalAlpha = alpha;
                            ctx.fillStyle = hoverFillColor;
                            ctx.fillRect(sx, sy, squareSize, squareSize);
                            ctx.globalAlpha = 1;
                        }

                        ctx.strokeStyle = borderColor;
                        ctx.strokeRect(sx, sy, squareSize, squareSize);
                    }
                }
            }

            const gradient = ctx.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                Math.sqrt(width ** 2 + height ** 2) / 2
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.76)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        updateCellOpacities() {
            const targets = new Map();

            if (this.hoveredCell) {
                targets.set(`${this.hoveredCell.x},${this.hoveredCell.y}`, 1);
            }

            if (this.options.hoverTrailAmount > 0) {
                for (let i = 0; i < this.trailCells.length; i += 1) {
                    const trailCell = this.trailCells[i];
                    const key = `${trailCell.x},${trailCell.y}`;

                    if (!targets.has(key)) {
                        targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
                    }
                }
            }

            for (const [key] of targets) {
                if (!this.cellOpacities.has(key)) {
                    this.cellOpacities.set(key, 0);
                }
            }

            for (const [key, opacity] of this.cellOpacities) {
                const target = targets.get(key) || 0;
                const next = opacity + (target - opacity) * 0.15;

                if (next < 0.005) {
                    this.cellOpacities.delete(key);
                } else {
                    this.cellOpacities.set(key, next);
                }
            }
        }

        setHoveredCell(nextCell) {
            if (!nextCell) return;

            if (
                !this.hoveredCell ||
                this.hoveredCell.x !== nextCell.x ||
                this.hoveredCell.y !== nextCell.y
            ) {
                if (this.hoveredCell && this.options.hoverTrailAmount > 0) {
                    this.trailCells.unshift({ ...this.hoveredCell });
                    if (this.trailCells.length > this.options.hoverTrailAmount) {
                        this.trailCells.length = this.options.hoverTrailAmount;
                    }
                }

                this.hoveredCell = nextCell;
            }
        }

        getCellByPoint(mouseX, mouseY) {
            const { shape, squareSize } = this.options;
            const isHex = shape === 'hexagon';
            const isTri = shape === 'triangle';

            if (isHex) {
                const hexHoriz = squareSize * 1.5;
                const hexVert = squareSize * Math.sqrt(3);

                const colShift = Math.floor(this.gridOffset.x / hexHoriz);
                const offsetX = ((this.gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
                const offsetY = ((this.gridOffset.y % hexVert) + hexVert) % hexVert;
                const adjustedX = mouseX - offsetX;
                const adjustedY = mouseY - offsetY;

                const col = Math.round(adjustedX / hexHoriz);
                const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
                const row = Math.round((adjustedY - rowOffset) / hexVert);

                return { x: col, y: row };
            }

            if (isTri) {
                const halfW = squareSize / 2;
                const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
                const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;

                const adjustedX = mouseX - offsetX;
                const adjustedY = mouseY - offsetY;

                const col = Math.round(adjustedX / halfW);
                const row = Math.floor(adjustedY / squareSize);

                return { x: col, y: row };
            }

            if (shape === 'circle') {
                const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
                const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;

                const adjustedX = mouseX - offsetX;
                const adjustedY = mouseY - offsetY;

                const col = Math.round(adjustedX / squareSize);
                const row = Math.round(adjustedY / squareSize);

                return { x: col, y: row };
            }

            const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
            const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;

            const adjustedX = mouseX - offsetX;
            const adjustedY = mouseY - offsetY;

            const col = Math.floor(adjustedX / squareSize);
            const row = Math.floor(adjustedY / squareSize);

            return { x: col, y: row };
        }

        handlePointerMove(event) {
            const rect = this.host.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) {
                this.handlePointerLeave();
                return;
            }

            const cell = this.getCellByPoint(mouseX, mouseY);
            this.setHoveredCell(cell);
        }

        handlePointerLeave() {
            if (this.hoveredCell && this.options.hoverTrailAmount > 0) {
                this.trailCells.unshift({ ...this.hoveredCell });
                if (this.trailCells.length > this.options.hoverTrailAmount) {
                    this.trailCells.length = this.options.hoverTrailAmount;
                }
            }

            this.hoveredCell = null;
        }
    }

    window.ShapeGrid = ShapeGrid;
}());

function initShapeGrid() {
    const shapeGridHost = document.getElementById('shapeGridHero');
    if (!shapeGridHost || !window.ShapeGrid) return;

    const heroSection = document.querySelector('.hero');

    new window.ShapeGrid(shapeGridHost, {
        direction: 'down',
        speed: 0.1,
        squareSize: 50,
        borderColor: 'rgba(240, 236, 228, 0.12)',
        hoverFillColor: 'rgba(240, 236, 228, 0.12)',
        shape: 'square',
        hoverTrailAmount: 3,
        pointerTarget: heroSection || shapeGridHost
    });

    if (heroSection) {
        heroSection.classList.add('shapegrid-ready');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShapeGrid, { once: true });
} else {
    initShapeGrid();
}