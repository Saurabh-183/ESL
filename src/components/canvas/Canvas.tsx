"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import AccordionSection from "../AccordionSection";

type ShapeKind = "rect" | "square" | "circle" | "line" | "text" | "image";

interface CanvasObject {
  id: number;
  type: ShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  text?: string;
  font?: string;
  fontSize?: number;
  img?: HTMLImageElement;
  originalImg?: HTMLImageElement;
  src?: string;
  filterColor?: string;
}

type Handle =
  | { kind: "move" }
  | { kind: "rotate" }
  | { kind: "corner"; corner: 0 | 1 | 2 | 3 };

const HANDLE_SIZE = 8;
const ROTATE_HANDLE_OFFSET = 24;
const LINE_CLICK_TOLERANCE = 12; // Increased click area for lines

// Helper function to round values to integers
const round = (value: number) => Math.round(value);

// Helper function to normalize rotation to 0-360 degrees
const normalizeRotation = (rotation: number) => {
  const degrees = (rotation * 180) / Math.PI;
  return Math.round(((degrees % 360) + 360) % 360);
};

// Helper function to convert degrees to radians
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const normDeg = (rad: number) => {
  const d = (rad * 180) / Math.PI;
  return ((d % 360) + 360) % 360;
};

export default function Canvas() {
  const [canvasSize, setCanvasSize] = useState({ w: 500, h: 300 });
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  console.log("objects: ", objects);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoverCursor, setHoverCursor] = useState("default");
  const [drag, setDrag] = useState<{
    objId: number;
    handle: Handle;
    startX: number;
    startY: number;
    orig: CanvasObject;
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftText, setDraftText] = useState("");
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [openSection, setOpenSection] = useState<
    "dynamic" | "static" | "layers" | null
  >("layers");

  // Selection box state
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: typeof openSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const toCanvas = (e: MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // Enhanced point-in-object detection with special handling for lines
  const pointInRotatedRect = (o: CanvasObject, px: number, py: number) => {
    const cx = o.x + o.width / 2;
    const cy = o.y + o.height / 2;
    const cos = Math.cos(-toRadians(o.rotation));
    const sin = Math.sin(-toRadians(o.rotation));
    const dx = px - cx;
    const dy = py - cy;
    const lx = dx * cos - dy * sin + o.width / 2;
    const ly = dx * sin + dy * cos + o.height / 2;

    // Special handling for lines - increase click tolerance
    if (o.type === "line") {
      const tolerance = LINE_CLICK_TOLERANCE;
      return lx >= 0 && lx <= o.width && ly >= -tolerance && ly <= tolerance;
    }

    return lx >= 0 && lx <= o.width && ly >= 0 && ly <= o.height;
  };

  const getHandleUnderPointer = (
    o: CanvasObject,
    px: number,
    py: number
  ): Handle | null => {
    const cx = o.x + o.width / 2;
    const cy = o.y + o.height / 2;
    const cos = Math.cos(-toRadians(o.rotation));
    const sin = Math.sin(-toRadians(o.rotation));
    const dx = px - cx;
    const dy = py - cy;
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    if (Math.hypot(lx, ly + o.height / 2 + ROTATE_HANDLE_OFFSET) <= 8)
      return { kind: "rotate" };

    const h = HANDLE_SIZE / 2;
    const cs: [number, number, 0 | 1 | 2 | 3][] = [
      [-o.width / 2, -o.height / 2, 0],
      [o.width / 2, -o.height / 2, 1],
      [o.width / 2, o.height / 2, 2],
      [-o.width / 2, o.height / 2, 3],
    ];
    for (const [hx, hy, idx] of cs) {
      if (Math.abs(lx - hx) <= h && Math.abs(ly - hy) <= h)
        return { kind: "corner", corner: idx };
    }
    return null;
  };

  const drawHandles = (ctx: CanvasRenderingContext2D, o: CanvasObject) => {
    const cx = o.x + o.width / 2;
    const cy = o.y + o.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(toRadians(o.rotation));

    // Draw selection outline
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#007acc";
    ctx.lineWidth = 1;

    // Special handling for line selection outline
    if (o.type === "line") {
      ctx.strokeRect(
        -o.width / 2,
        -LINE_CLICK_TOLERANCE / 2,
        o.width,
        LINE_CLICK_TOLERANCE
      );
    } else {
      ctx.strokeRect(-o.width / 2, -o.height / 2, o.width, o.height);
    }

    // Draw corner handles
    ctx.setLineDash([]);
    ctx.fillStyle = "#007acc";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    const h = HANDLE_SIZE / 2;
    const corners: [number, number][] = [
      [-o.width / 2, -o.height / 2],
      [o.width / 2, -o.height / 2],
      [o.width / 2, o.height / 2],
      [-o.width / 2, o.height / 2],
    ];

    corners.forEach(([x, y]) => {
      ctx.fillRect(x - h, y - h, HANDLE_SIZE, HANDLE_SIZE);
      ctx.strokeRect(x - h, y - h, HANDLE_SIZE, HANDLE_SIZE);
    });

    // Draw rotate handle
    ctx.beginPath();
    ctx.arc(0, -o.height / 2 - ROTATE_HANDLE_OFFSET, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw rotate handle line
    ctx.beginPath();
    ctx.moveTo(0, -o.height / 2);
    ctx.lineTo(0, -o.height / 2 - ROTATE_HANDLE_OFFSET);
    ctx.stroke();

    ctx.restore();
  };

  const drawSelectionBox = (ctx: CanvasRenderingContext2D) => {
    if (!selectionBox) return;

    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#007acc";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      Math.min(selectionBox.startX, selectionBox.endX),
      Math.min(selectionBox.startY, selectionBox.endY),
      Math.abs(selectionBox.endX - selectionBox.startX),
      Math.abs(selectionBox.endY - selectionBox.startY)
    );
    ctx.restore();
  };

  const calculateTextDimensions = (text: string, font: string) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.font = font;
    const metrics = ctx.measureText(text);
    return {
      width: metrics.width,
      height:
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
        20,
    };
  };

  const redraw = useCallback(() => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    objects.forEach((o) => {
      ctx.save();
      ctx.translate(o.x + o.width / 2, o.y + o.height / 2);
      ctx.rotate(toRadians(o.rotation));
      ctx.fillStyle = o.color;

      switch (o.type) {
        case "rect":
        case "square":
          ctx.fillRect(-o.width / 2, -o.height / 2, o.width, o.height);
          break;

        case "circle":
          ctx.beginPath();
          const radius = Math.min(o.width, o.height) / 2;
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "line":
          ctx.beginPath();
          ctx.moveTo(-o.width / 2, 0);
          ctx.lineTo(o.width / 2, 0);
          ctx.lineWidth = 3;
          ctx.strokeStyle = o.color;
          ctx.stroke();
          break;

        case "text":
          if (o.text) {
            const fontSize = o.fontSize || 18;
            ctx.font = `${fontSize}px Arial, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = o.color;

            // Handle text wrapping if needed
            const words = o.text.split(" ");
            const lines = [];
            let currentLine = "";

            for (const word of words) {
              const testLine = currentLine + (currentLine ? " " : "") + word;
              const metrics = ctx.measureText(testLine);

              if (metrics.width > o.width - 10 && currentLine) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }
            if (currentLine) lines.push(currentLine);

            const lineHeight = fontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            const startY = -totalHeight / 2 + lineHeight / 2;

            lines.forEach((line, index) => {
              ctx.fillText(line, 0, startY + index * lineHeight);
            });
          }
          break;

        case "image":
          if (o.img && o.img.complete) {
            ctx.drawImage(
              o.img,
              -o.width / 2,
              -o.height / 2,
              o.width,
              o.height
            );
          } else {
            // fallback (optional): grey box while image loads
            ctx.fillStyle = "#cccccc";
            ctx.fillRect(-o.width / 2, -o.height / 2, o.width, o.height);
          }
          break;
      }

      ctx.restore();

      if (o.id === selectedId) drawHandles(ctx, o);
    });

    drawSelectionBox(ctx);
  }, [objects, selectedId, canvasSize, selectionBox]);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const c = canvasRef.current!;
    c.width = canvasSize.w * dpr;
    c.height = canvasSize.h * dpr;
    c.style.width = `${canvasSize.w}px`;
    c.style.height = `${canvasSize.h}px`;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }, [canvasSize, redraw]);

  const onDown = (e: MouseEvent) => {
    if (editingId) {
      finishTextEditing();
      return;
    }

    const { x, y } = toCanvas(e);

    // Check for handles first
    for (let i = objects.length - 1; i >= 0; i--) {
      const h = getHandleUnderPointer(objects[i], x, y);
      if (h) {
        setSelectedId(objects[i].id);
        setDrag({
          objId: objects[i].id,
          handle: h,
          startX: x,
          startY: y,
          orig: { ...objects[i] },
        });
        return;
      }
    }

    // Check for objects
    for (let i = objects.length - 1; i >= 0; i--) {
      if (pointInRotatedRect(objects[i], x, y)) {
        setSelectedId(objects[i].id);
        setDrag({
          objId: objects[i].id,
          handle: { kind: "move" },
          startX: x,
          startY: y,
          orig: { ...objects[i] },
        });
        return;
      }
    }

    // Start selection box
    setSelectedId(null);
    setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
  };

  const onMove = (e: MouseEvent) => {
    const { x, y } = toCanvas(e);

    // Handle selection box dragging
    if (selectionBox && !drag) {
      setSelectionBox((prev) => (prev ? { ...prev, endX: x, endY: y } : null));
      return;
    }

    // Cursor update when not dragging
    if (!drag) {
      let cur = "default";
      for (let i = objects.length - 1; i >= 0; i--) {
        const h = getHandleUnderPointer(objects[i], x, y);
        if (h) {
          if (h.kind === "rotate") cur = "grab";
          else if (h.kind === "corner")
            cur =
              h.corner === 0 || h.corner === 2 ? "nwse-resize" : "nesw-resize";
          break;
        } else if (pointInRotatedRect(objects[i], x, y)) {
          cur = "move";
          break;
        }
      }
      setHoverCursor(cur);
      return;
    }

    const dx = x - drag.startX;
    const dy = y - drag.startY;
    const { handle, orig } = drag;

    setObjects((prev) =>
      prev.map((o) => {
        if (o.id !== drag.objId) return o;

        if (handle.kind === "rotate") {
          const cx = orig.x + orig.width / 2;
          const cy = orig.y + orig.height / 2;
          const angle = Math.atan2(y - cy, x - cx) + Math.PI / 2;
          return { ...o, rotation: normalizeRotation(angle) };
        }

        if (handle.kind === "move") {
          return { ...o, x: round(orig.x + dx), y: round(orig.y + dy) };
        }

        // Resizing
        let newX = orig.x;
        let newY = orig.y;
        let newW = orig.width;
        let newH = orig.height;

        // Check if we should maintain aspect ratio
        const shouldMaintainAspectRatio =
          e.shiftKey ||
          orig.type === "circle" ||
          orig.type === "square" ||
          orig.type === "image";

        if (shouldMaintainAspectRatio) {
          const aspectRatio = orig.width / orig.height;

          switch (handle.corner) {
            case 0: // Top-left
              newW = Math.max(20, orig.width - dx);
              newH = newW / aspectRatio;
              newX = orig.x + (orig.width - newW);
              newY = orig.y + (orig.height - newH);
              break;
            case 1: // Top-right
              newW = Math.max(20, orig.width + dx);
              newH = newW / aspectRatio;
              newY = orig.y + (orig.height - newH);
              break;
            case 2: // Bottom-right
              newW = Math.max(20, orig.width + dx);
              newH = newW / aspectRatio;
              break;
            case 3: // Bottom-left
              newW = Math.max(20, orig.width - dx);
              newH = newW / aspectRatio;
              newX = orig.x + (orig.width - newW);
              break;
          }

          // Ensure minimum height
          if (newH < 20) {
            newH = 20;
            newW = newH * aspectRatio;

            // Recalculate position for smaller dimensions
            switch (handle.corner) {
              case 0:
                newX = orig.x + (orig.width - newW);
                newY = orig.y + (orig.height - newH);
                break;
              case 1:
                newY = orig.y + (orig.height - newH);
                break;
              case 2:
                break;
              case 3:
                newX = orig.x + (orig.width - newW);
                break;
            }
          }
        } else {
          // Original non-uniform resizing logic
          switch (handle.corner) {
            case 0:
              newW = Math.max(20, orig.width - dx);
              newH = Math.max(20, orig.height - dy);
              newX = orig.x + (orig.width - newW);
              newY = orig.y + (orig.height - newH);
              break;
            case 1:
              newW = Math.max(20, orig.width + dx);
              newH = Math.max(20, orig.height - dy);
              newY = orig.y + (orig.height - newH);
              break;
            case 2:
              newW = Math.max(20, orig.width + dx);
              newH = Math.max(20, orig.height + dy);
              break;
            case 3:
              newW = Math.max(20, orig.width - dx);
              newH = Math.max(20, orig.height + dy);
              newX = orig.x + (orig.width - newW);
              break;
          }
        }

        // Special handling for lines
        if (orig.type === "line") {
          switch (handle.corner) {
            case 0:
            case 3:
              newW = Math.max(20, orig.width - dx);
              newX = orig.x + (orig.width - newW);
              break;
            case 1:
            case 2:
              newW = Math.max(20, orig.width + dx);
              break;
          }
          return {
            ...o,
            x: round(newX),
            y: round(orig.y),
            width: round(newW),
            height: LINE_CLICK_TOLERANCE,
          };
        }

        // Text resizing with font scaling
        if (orig.type === "text") {
          const scaleX = newW / orig.width;
          const scaleY = newH / orig.height;
          const scale = Math.min(scaleX, scaleY);
          const newFontSize = Math.max(
            8,
            Math.min(72, Math.round((orig.fontSize || 18) * scale))
          );

          return {
            ...o,
            x: round(newX),
            y: round(newY),
            width: round(newW),
            height: round(newH),
            fontSize: newFontSize,
          };
        }

        return {
          ...o,
          x: round(newX),
          y: round(newY),
          width: round(newW),
          height: round(newH),
        };
      })
    );
  };

  const onUp = () => {
    if (selectionBox) {
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);

      for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (
          obj.x < maxX &&
          obj.x + obj.width > minX &&
          obj.y < maxY &&
          obj.y + obj.height > minY
        ) {
          setSelectedId(obj.id);
          break;
        }
      }
      setSelectionBox(null);
    }
    setDrag(null);
  };

  const finishTextEditing = () => {
    if (editingId) {
      setObjects((prev) =>
        prev.map((o) => {
          if (o.id === editingId) {
            const fontSize = o.fontSize || 18;
            const dimensions = calculateTextDimensions(
              draftText,
              `${fontSize}px Arial`
            );
            return {
              ...o,
              text: draftText,
              width: Math.max(dimensions.width + 20, 50),
              height: Math.max(dimensions.height + 10, 30),
            };
          }
          return o;
        })
      );
      setEditingId(null);
      setDraftText("");
    }
  };

  const onDoubleClick = (e: MouseEvent) => {
    const { x, y } = toCanvas(e);
    for (const o of objects) {
      if (o.type === "text" && pointInRotatedRect(o, x, y)) {
        setEditingId(o.id);
        setDraftText(o.text || "");
        setTimeout(() => textInputRef.current?.focus(), 0);
        return;
      }
    }
  };

  const PLACEHOLDER_SRC = "./images/store.svg";

  const addShape = async (type: ShapeKind) => {
    if (type === "text") {
      const txt = "Click to edit";
      const fontSize = 18;
      const dimensions = calculateTextDimensions(txt, `${fontSize}px Arial`);
      const newText: CanvasObject = {
        id: Date.now(),
        type,
        text: txt,
        fontSize,
        x: round(100 + Math.random() * 100),
        y: round(100 + Math.random() * 100),
        width: dimensions.width + 20,
        height: dimensions.height + 10,
        rotation: 0,
        color: "#000000",
      };
      setObjects((p) => [...p, newText]);
      setSelectedId(newText.id);
      setTimeout(() => {
        setEditingId(newText.id);
        setDraftText(newText.text || "");
      }, 100);
      return;
    }

    const defaults = {
      rect: { w: 120, h: 80, color: "#3498db" },
      square: { w: 80, h: 80, color: "#e67e22" },
      circle: { w: 80, h: 80, color: "#9b59b6" },
      line: { w: 140, h: LINE_CLICK_TOLERANCE, color: "#2ecc71" },
      image: { w: 50, h: 50, color: "#000000" },
    };

    const { w, h, color } = defaults[type];
    const baseX = round(100 + Math.random() * 100);
    const baseY = round(100 + Math.random() * 100);

    if (type === "image") {
      const img = new Image();
      img.src = PLACEHOLDER_SRC;

      img.onload = () => {
        const blackFiltered = applyColorFilter(img, "#000000");
        blackFiltered.onload = () => {
          const newImageShape: CanvasObject = {
            id: Date.now(),
            type,
            x: baseX,
            y: baseY,
            width: img.width,
            height: img.height,
            rotation: 0,
            color,
            img: blackFiltered,
            originalImg: img,
            src: PLACEHOLDER_SRC,
            filterColor: "#000000",
          };
          setObjects((prev) => [...prev, newImageShape]);
          setSelectedId(newImageShape.id);
        };
      };
      return;
    }

    const newShape: CanvasObject = {
      id: Date.now(),
      type,
      x: baseX,
      y: baseY,
      width: w,
      height: h,
      rotation: 0,
      color,
    };

    setObjects((p) => [...p, newShape]);
    setSelectedId(newShape.id);
  };

  // Converts any image into a monochrome version using the selected hex color
  const applyColorFilter = (
    img: HTMLImageElement,
    hexColor: string = "#000000" // ✅ default to black
  ): HTMLImageElement => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    const { r: tr, g: tg, b: tb } = hexToRgb(hexColor);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (brightness < 128) {
        // dark areas → target color
        data[i] = tr;
        data[i + 1] = tg;
        data[i + 2] = tb;
      } else {
        // light areas → white
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const filteredImage = new Image();
    filteredImage.src = canvas.toDataURL();
    return filteredImage;
  };

  const applyFilterToSelectedImage = (hex: string) => {
    const obj = objects.find((o) => o.id === selectedId);
    if (!obj || obj.type !== "image" || !obj.originalImg) return;

    const filteredImg = applyColorFilter(obj.originalImg, hex);

    filteredImg.onload = () => {
      setObjects((prev) =>
        prev.map((o) =>
          o.id === obj.id
            ? {
                ...o,
                img: filteredImg,
                src: filteredImg.src,
                width: filteredImg.width,
                height: filteredImg.height,
                filterColor: hex,
              }
            : o
        )
      );
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCropFile(e.target.files[0]);
    }
  };

  const addImageObject = (dataUrl: string, w: number, h: number) => {
    const newObj: CanvasObject = {
      id: Date.now(),
      type: "image",
      x: 50,
      y: 50,
      width: w,
      height: h,
      rotation: 0,
      color: "#ffffff",
      src: dataUrl,
    };
    setObjects((p) => [...p, newObj]);
    setSelectedId(newObj.id);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setObjects((prev) => prev.filter((o) => o.id !== selectedId));
      setSelectedId(null);
    }
  };

  const duplicateSelected = () => {
    if (selectedId) {
      const original = objects.find((o) => o.id === selectedId);
      if (original) {
        const duplicate = {
          ...original,
          id: Date.now(),
          x: original.x + 20,
          y: original.y + 20,
        };
        setObjects((prev) => [...prev, duplicate]);
        setSelectedId(duplicate.id);
      }
    }
  };

  const bringForward = (id: number) => {
    setObjects((prev) => {
      const idx = prev.findIndex((o) => o.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const copy = [...prev];
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      return copy;
    });
  };

  const sendBackward = (id: number) => {
    setObjects((prev) => {
      const idx = prev.findIndex((o) => o.id === id);
      if (idx <= 0) return prev;
      const copy = [...prev];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy;
    });
  };

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (editingId) return;
      if (e.key === "Delete" && selectedId) {
        setObjects((p) => p.filter((o) => o.id !== selectedId));
        setSelectedId(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "]" && selectedId) {
        bringForward(selectedId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "[" && selectedId) {
        sendBackward(selectedId);
      }
    },
    [selectedId, editingId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const cursor = drag ? "grabbing" : selectionBox ? "crosshair" : hoverCursor;
  const selectedObject = objects.find((o) => o.id === selectedId);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-80 bg-white border-r border-gray-300 overflow-y-auto">
        {/* <div className="p-4">
          <h2 className="font-semibold text-lg mb-3">Canvas Size</h2>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={canvasSize.w}
              onChange={(e) =>
                setCanvasSize((s) => ({
                  ...s,
                  w: Math.max(200, Number(e.target.value)),
                }))
              }
              className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
            />
            <span className="text-gray-500">×</span>
            <input
              type="number"
              value={canvasSize.h}
              onChange={(e) =>
                setCanvasSize((s) => ({
                  ...s,
                  h: Math.max(150, Number(e.target.value)),
                }))
              }
              className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
            />
          </div>
        </div> */}

        <AccordionSection title="Static Element" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {["rect", "square", "circle", "line", "text", "image"].map((t) => (
              <button
                key={t}
                onClick={() => addShape(t as ShapeKind)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm capitalize transition-colors"
              >
                {t === "rect" ? "Rectangle" : t}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Layer">
          {[...objects].reverse().map((item, index, arr) => {
            const isFirst = index === 0;
            const isLast = index === arr.length - 1;
            const isActive = item.id === selectedId;

            return (
              <div
                key={item.id}
                className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? "bg-blue-100 font-semibold scale-[1.02]"
                    : "scale-100"
                }`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="capitalize">{item.type}</div>
                <div className="flex">
                  {!isFirst && (
                    <span
                      className="cursor-pointer p-1 rounded hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        bringForward(item.id);
                      }}
                    >
                      <i className="tabler-arrow-up" />
                    </span>
                  )}
                  {!isLast && (
                    <span
                      className="cursor-pointer p-1 rounded hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendBackward(item.id);
                      }}
                    >
                      <i className="tabler-arrow-down" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </AccordionSection>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Canvas Editor</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-sm"
              onClick={() => bringForward(selectedId!)}
              disabled={!selectedId}
            >
              Bring Forward
            </button>
            <button
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-sm"
              onClick={() => sendBackward(selectedId!)}
              disabled={!selectedId}
            >
              Send Backward
            </button>
          </div>
        </header>

        <section
          ref={wrapperRef}
          className="flex-1 overflow-auto bg-gray-200 p-4 flex items-center justify-center"
        >
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              className="border border-gray-400 bg-white shadow-lg"
              style={{ cursor }}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              // onDoubleClick={onDoubleClick}
            />

            {editingId && (
              <input
                ref={textInputRef}
                className="absolute border-2 border-blue-500 bg-white px-2 py-1 text-sm rounded shadow-lg"
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                onBlur={finishTextEditing}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    finishTextEditing();
                  }
                }}
                style={{
                  top: (objects.find((o) => o.id === editingId)?.y || 0) - 5,
                  left: (objects.find((o) => o.id === editingId)?.x || 0) - 5,
                  minWidth: 100,
                }}
                autoFocus
              />
            )}
          </div>
        </section>
      </main>
      <aside className="w-80 p-4 border-l overflow-y-auto">
        {selectedObject && (
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-3">Properties</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  value={selectedObject.color}
                  onChange={(e) =>
                    setObjects((prev) =>
                      prev.map((o) =>
                        o.id === selectedId
                          ? { ...o, color: e.target.value }
                          : o
                      )
                    )
                  }
                  className="w-full h-8 rounded border border-gray-300"
                />
              </div>

              {selectedObject.type === "text" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={selectedObject.fontSize || 18}
                    onChange={(e) =>
                      setObjects((prev) =>
                        prev.map((o) =>
                          o.id === selectedId
                            ? { ...o, fontSize: Number(e.target.value) }
                            : o
                        )
                      )
                    }
                    className="w-full outline-none"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedObject.fontSize || 18}px
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={duplicateSelected}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-sm"
                >
                  Duplicate
                </button>
                <button
                  onClick={deleteSelected}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <h2 className="text-lg font-semibold mb-4">Edit Properties</h2>
        {selectedObject ? (
          <div className="space-y-3 text-sm">
            {["x", "y", "width", "height", "rotation"].map((prop) => (
              <div key={prop}>
                <label className="block font-medium capitalize mb-1">
                  {prop}
                </label>
                <input
                  type="number"
                  value={(selectedObject as any)[prop]}
                  onChange={(e) =>
                    setObjects((prev) =>
                      prev.map((o) =>
                        o.id === selectedId
                          ? { ...o, [prop]: Number(e.target.value) }
                          : o
                      )
                    )
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            ))}

            {/* Show text editing for text object */}
            {selectedObject.type === "text" && (
              <>
                <div>
                  <label className="block font-medium mb-1">Text</label>
                  <input
                    type="text"
                    value={selectedObject.text}
                    onChange={(e) =>
                      setObjects((prev) =>
                        prev.map((o) =>
                          o.id === selectedId
                            ? { ...o, text: e.target.value }
                            : o
                        )
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Font Size</label>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    value={selectedObject.fontSize || 18}
                    onChange={(e) =>
                      setObjects((prev) =>
                        prev.map((o) =>
                          o.id === selectedId
                            ? { ...o, fontSize: Number(e.target.value) }
                            : o
                        )
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            {selectedObject.type === "image" && (
              <>
                <div>
                  <label className="block font-medium mb-1">
                    Replace Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        const newOriginalImg = new Image();
                        newOriginalImg.onload = () => {
                          // Apply current filter color (or default to black)
                          const targetColor =
                            selectedObject.filterColor ?? "#000000";
                          const filteredImg = applyColorFilter(
                            newOriginalImg,
                            targetColor
                          );

                          filteredImg.onload = () => {
                            setObjects((prev) =>
                              prev.map((o) =>
                                o.id === selectedId
                                  ? {
                                      ...o,
                                      originalImg: newOriginalImg,
                                      img: filteredImg,
                                      src: reader.result as string,
                                      width: filteredImg.width,
                                      height: filteredImg.height,
                                    }
                                  : o
                              )
                            );
                          };
                        };
                        newOriginalImg.src = reader.result as string;
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4">
                  {["#ff0000", "#ffff00"].map((item) => (
                    <div
                      key={item}
                      className="w-5 h-5 cursor-pointer"
                      style={{ backgroundColor: item }}
                      onClick={() => applyFilterToSelectedImage(item as any)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No shape selected</p>
        )}
      </aside>
    </div>
  );
}

// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   MouseEvent,
// } from "react";

// type ShapeKind = "rect" | "square" | "circle" | "line" | "text";

// interface CanvasObject {
//   id: number;
//   type: ShapeKind;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   rotation: number;
//   color: string;
//   text?: string;
//   font?: string;
// }

// type Handle =
//   | { kind: "move" }
//   | { kind: "rotate" }
//   | { kind: "corner"; corner: 0 | 1 | 2 | 3 };

// const HANDLE_SIZE = 8;
// const ROTATE_HANDLE_OFFSET = 24;

// export default function EditorPage() {
//   const [canvasSize, setCanvasSize] = useState({ w: 400, h: 300 });
//   const [objects, setObjects] = useState<CanvasObject[]>([]);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [hoverCursor, setHoverCursor] = useState("default");
//   const [drag, setDrag] = useState<{
//     objId: number;
//     handle: Handle;
//     startX: number;
//     startY: number;
//     orig: CanvasObject;
//   } | null>(null);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [draftText, setDraftText] = useState("");

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   const toCanvas = (e: MouseEvent) => {
//     const rect = canvasRef.current!.getBoundingClientRect();
//     return { x: e.clientX - rect.left, y: e.clientY - rect.top };
//   };

//   const pointInRotatedRect = (o: CanvasObject, px: number, py: number) => {
//     const cx = o.x + o.width / 2;
//     const cy = o.y + o.height / 2;
//     const cos = Math.cos(-o.rotation);
//     const sin = Math.sin(-o.rotation);
//     const dx = px - cx;
//     const dy = py - cy;
//     const lx = dx * cos - dy * sin + o.width / 2;
//     const ly = dx * sin + dy * cos + o.height / 2;
//     return lx >= 0 && lx <= o.width && ly >= 0 && ly <= o.height;
//   };

//   const getHandleUnderPointer = (
//     o: CanvasObject,
//     px: number,
//     py: number
//   ): Handle | null => {
//     const cx = o.x + o.width / 2;
//     const cy = o.y + o.height / 2;
//     const cos = Math.cos(-o.rotation);
//     const sin = Math.sin(-o.rotation);
//     const dx = px - cx;
//     const dy = py - cy;
//     const lx = dx * cos - dy * sin;
//     const ly = dx * sin + dy * cos;

//     if (Math.hypot(lx, ly + o.height / 2 + ROTATE_HANDLE_OFFSET) <= 8)
//       return { kind: "rotate" };

//     const h = HANDLE_SIZE / 2;
//     const cs: [number, number, 0 | 1 | 2 | 3][] = [
//       [-o.width / 2, -o.height / 2, 0],
//       [o.width / 2, -o.height / 2, 1],
//       [o.width / 2, o.height / 2, 2],
//       [-o.width / 2, o.height / 2, 3],
//     ];
//     for (const [hx, hy, idx] of cs) {
//       if (Math.abs(lx - hx) <= h && Math.abs(ly - hy) <= h)
//         return { kind: "corner", corner: idx };
//     }
//     return null;
//   };

//   const drawHandles = (ctx: CanvasRenderingContext2D, o: CanvasObject) => {
//     const cx = o.x + o.width / 2;
//     const cy = o.y + o.height / 2;

//     ctx.save();
//     ctx.translate(cx, cy);
//     ctx.rotate(o.rotation);

//     ctx.setLineDash([5, 5]);
//     ctx.strokeStyle = "gray";
//     ctx.strokeRect(-o.width / 2, -o.height / 2, o.width, o.height);

//     ctx.fillStyle = "black";
//     const h = HANDLE_SIZE / 2;
//     const corners: [number, number][] = [
//       [-o.width / 2, -o.height / 2],
//       [o.width / 2, -o.height / 2],
//       [o.width / 2, o.height / 2],
//       [-o.width / 2, o.height / 2],
//     ];
//     corners.forEach(([x, y]) =>
//       ctx.fillRect(x - h, y - h, HANDLE_SIZE, HANDLE_SIZE)
//     );

//     ctx.beginPath();
//     ctx.arc(0, -o.height / 2 - ROTATE_HANDLE_OFFSET, 6, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.restore();
//   };

//   const redraw = useCallback(() => {
//     const ctx = canvasRef.current!.getContext("2d")!;
//     ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
//     objects.forEach((o) => {
//       ctx.save();
//       ctx.translate(o.x + o.width / 2, o.y + o.height / 2);
//       ctx.rotate(o.rotation);
//       ctx.fillStyle = o.color;
//       switch (o.type) {
//         case "rect":
//         case "square":
//           ctx.fillRect(-o.width / 2, -o.height / 2, o.width, o.height);
//           break;
//         case "circle":
//           ctx.beginPath();
//           ctx.arc(0, 0, o.width / 2, 0, Math.PI * 2);
//           ctx.fill();
//           break;
//         case "line":
//           ctx.beginPath();
//           ctx.moveTo(-o.width / 2, -o.height / 2);
//           ctx.lineTo(o.width / 2, o.height / 2);
//           ctx.lineWidth = 2;
//           ctx.strokeStyle = o.color;
//           ctx.stroke();
//           break;
//         case "text":
//           ctx.font = o.font || "18px sans-serif";
//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";
//           ctx.fillText(o.text || "", 0, 0);
//           break;
//       }
//       ctx.restore();

//       if (o.id === selectedId) drawHandles(ctx, o);
//     });
//   }, [objects, selectedId, canvasSize]);

//   useEffect(() => {
//     const dpr = window.devicePixelRatio || 1;
//     const c = canvasRef.current!;
//     c.width = canvasSize.w * dpr;
//     c.height = canvasSize.h * dpr;
//     c.style.width = `${canvasSize.w}px`;
//     c.style.height = `${canvasSize.h}px`;
//     c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
//     redraw();
//   }, [canvasSize, redraw]);

//   const onDown = (e: MouseEvent) => {
//     if (editingId) return;
//     const { x, y } = toCanvas(e);
//     for (let i = objects.length - 1; i >= 0; i--) {
//       const h = getHandleUnderPointer(objects[i], x, y);
//       if (h) {
//         setSelectedId(objects[i].id);
//         setDrag({
//           objId: objects[i].id,
//           handle: h,
//           startX: x,
//           startY: y,
//           orig: { ...objects[i] },
//         });
//         return;
//       }
//     }
//     for (let i = objects.length - 1; i >= 0; i--) {
//       if (pointInRotatedRect(objects[i], x, y)) {
//         setSelectedId(objects[i].id);
//         setDrag({
//           objId: objects[i].id,
//           handle: { kind: "move" },
//           startX: x,
//           startY: y,
//           orig: { ...objects[i] },
//         });
//         return;
//       }
//     }
//     setSelectedId(null);
//   };

//   const onMove = (e: MouseEvent) => {
//     const { x, y } = toCanvas(e);

//     // Cursor update when not dragging
//     if (!drag) {
//       let cur = "default";
//       for (let i = objects.length - 1; i >= 0; i--) {
//         const h = getHandleUnderPointer(objects[i], x, y);
//         if (h) {
//           if (h.kind === "rotate") cur = "grab";
//           else if (h.kind === "corner")
//             cur =
//               h.corner === 0 || h.corner === 2 ? "nwse-resize" : "nesw-resize";
//           else cur = "move";
//           break;
//         }
//       }
//       setHoverCursor(cur);
//       return;
//     }

//     const dx = x - drag.startX;
//     const dy = y - drag.startY;
//     const { handle, orig } = drag;

//     setObjects((prev) =>
//       prev.map((o) => {
//         if (o.id !== drag.objId) return o;

//         if (handle.kind === "rotate") {
//           const cx = orig.x + orig.width / 2;
//           const cy = orig.y + orig.height / 2;
//           const angle = Math.atan2(y - cy, x - cx) + Math.PI / 2;
//           return { ...o, rotation: angle };
//         }

//         if (handle.kind === "move") {
//           return { ...o, x: orig.x + dx, y: orig.y + dy };
//         }

//         // Resizing
//         const signX = handle.corner === 1 || handle.corner === 2 ? 1 : -1;
//         const signY = handle.corner === 2 || handle.corner === 3 ? 1 : -1;
//         const moved = (dx * signX + dy * signY) / 2;
//         const newW = Math.max(20, orig.width + moved * 2);
//         const ratio = newW / orig.width;
//         const newH = orig.height * ratio;
//         const newX = orig.x - (newW - orig.width) / 2;
//         const newY = orig.y - (newH - orig.height) / 2;

//         // 🔠 Text-specific resizing logic
//         if (orig.type === "text") {
//           const originalFontSize = parseInt(
//             orig.font?.match(/\d+/)?.[0] || "18",
//             10
//           );
//           const newFontSize = Math.max(
//             10,
//             Math.round(originalFontSize * ratio)
//           );

//           return {
//             ...o,
//             x: newX,
//             y: newY,
//             width: newW,
//             height: newH,
//             font: `${newFontSize}px sans-serif`,
//           };
//         }

//         return { ...o, x: newX, y: newY, width: newW, height: newH };
//       })
//     );
//   };

//   const onUp = () => setDrag(null);

//   const onDoubleClick = (e: MouseEvent) => {
//     const { x, y } = toCanvas(e);
//     for (const o of objects) {
//       if (o.type === "text" && pointInRotatedRect(o, x, y)) {
//         setEditingId(o.id);
//         setDraftText(o.text || "");
//         return;
//       }
//     }
//   };

//   const addShape = (type: ShapeKind) => {
//     if (type === "text") {
//       const txt = "Double-click to edit";
//       const font = "18px sans-serif";
//       const ctx = canvasRef.current!.getContext("2d")!;
//       ctx.font = font;
//       const m = ctx.measureText(txt);
//       const newText: CanvasObject = {
//         id: Date.now(),
//         type,
//         text: txt,
//         font,
//         x: 100,
//         y: 100,
//         width: m.width,
//         height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
//         rotation: 0,
//         color: "#000",
//       };
//       setObjects((p) => [...p, newText]);
//       setSelectedId(newText.id);
//       return;
//     }

//     const defaults = {
//       rect: { w: 120, h: 80, color: "#3498db" },
//       square: { w: 80, h: 80, color: "#e67e22" },
//       circle: { w: 80, h: 80, color: "#9b59b6" },
//       line: { w: 140, h: 0, color: "#2ecc71" },
//     };

//     const { w, h, color } = defaults[type];
//     const newShape: CanvasObject = {
//       id: Date.now(),
//       type,
//       x: 80 + Math.random() * 100,
//       y: 80 + Math.random() * 100,
//       width: w,
//       height: h,
//       rotation: 0,
//       color,
//     };
//     setObjects((p) => [...p, newShape]);
//     setSelectedId(newShape.id);
//   };

//   const cursor = drag ? "grabbing" : hoverCursor;

//   return (
//     <div className="flex h-screen">
//       <aside className="w-80 p-4 border-r space-y-4 overflow-y-auto">
//         <h2 className="font-semibold text-lg mb-2">Canvas Size</h2>
//         <div className="flex gap-2">
//           <input
//             type="number"
//             value={canvasSize.w}
//             onChange={(e) =>
//               setCanvasSize((s) => ({ ...s, w: Number(e.target.value) }))
//             }
//             className="border p-1 w-24"
//           />
//           ×
//           <input
//             type="number"
//             value={canvasSize.h}
//             onChange={(e) =>
//               setCanvasSize((s) => ({ ...s, h: Number(e.target.value) }))
//             }
//             className="border p-1 w-24"
//           />
//         </div>

//         <h2 className="font-semibold text-lg mb-2">Add Shape</h2>
//         <div className="grid grid-cols-2 gap-2">
//           {["rect", "square", "circle", "line", "text"].map((t) => (
//             <button
//               key={t}
//               onClick={() => addShape(t as ShapeKind)}
//               className="bg-slate-400 p-2 rounded capitalize"
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </aside>

//       <main className="flex-1 flex flex-col bg-red-50 p-4">
//         <header className="p-2 bg-gray-500 text-white">Canvas Header</header>
//         <section
//           ref={wrapperRef}
//           className="flex-1 overflow-auto flex items-center justify-center relative"
//         >
//           <div className="min-w-max min-h-max">
//             <canvas
//               ref={canvasRef}
//               width={canvasSize.w}
//               height={canvasSize.h}
//               className="border border-gray-400 bg-white"
//               style={{ cursor }}
//               onMouseDown={onDown}
//               onMouseMove={onMove}
//               onMouseUp={onUp}
//               onMouseLeave={onUp}
//               onDoubleClick={onDoubleClick}
//             />
//           </div>

//           {editingId && (
//             <input
//               className="absolute z-50 border p-1 text-sm"
//               value={draftText}
//               onChange={(e) => setDraftText(e.target.value)}
//               onBlur={() => {
//                 setObjects((prev) =>
//                   prev.map((o) =>
//                     o.id === editingId ? { ...o, text: draftText } : o
//                   )
//                 );
//                 setEditingId(null);
//               }}
//               style={{
//                 top: objects.find((o) => o.id === editingId)?.y ?? 0,
//                 left: objects.find((o) => o.id === editingId)?.x ?? 0,
//               }}
//               autoFocus
//             />
//           )}
//         </section>
//       </main>

// <aside className="w-80 p-4 border-l">
//   <div>Right Panel</div>
//   {selectedId && (
//     <pre className="text-xs whitespace-pre-wrap break-words">
//       {JSON.stringify(
//         objects.find((o) => o.id === selectedId),
//         null,
//         2
//       )}
//     </pre>
//   )}
// </aside>
//     </div>
//   );
// }
