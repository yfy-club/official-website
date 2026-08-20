"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type ShaderVariation = "circle" | "square" | "triangle" | "ring" | 0 | 1 | 2 | 3;

export interface ShaderLensBlurProps {
  className?: string;
  variation?: ShaderVariation;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  invertMask?: boolean;
  interactive?: boolean;
  speed?: number;
  intensity?: number;
  style?: React.CSSProperties;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform int u_variation;
uniform bool u_invert_mask;
uniform float u_intensity;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(
        0.211324865405187,
        0.366025403784439,
        -0.577350269189626,
        0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdEquilateralTriangle(vec2 p, float r) {
    const float k = 1.7320508075688772; // sqrt(3.0)
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) {
        p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    }
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
}

float sdRing(vec2 p, float r, float th) {
    return abs(length(p) - r) - th;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 mouse = (u_mouse - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Multi-stop atmospheric gradient background
    vec3 col = mix(u_color1, u_color2, clamp(st.y + uv.x * 0.2, 0.0, 1.0));
    col = mix(col, u_color3, clamp(st.x - uv.y * 0.2, 0.0, 1.0));

    // Subtle organic noise perturbation
    float n = snoise(uv * 2.8 + u_time * 0.12) * 0.08;
    col += vec3(n);

    // Evaluate geometric shape distance based on variation mode
    float d = 0.0;
    vec2 p = uv - mouse * 0.38;

    if (u_variation == 0) {
        d = sdCircle(p, 0.36);
    } else if (u_variation == 1) {
        d = sdBox(p, vec2(0.32));
    } else if (u_variation == 2) {
        d = sdEquilateralTriangle(p, 0.38);
    } else if (u_variation == 3) {
        d = sdRing(p, 0.34, 0.07);
    }

    // Feathered blur / glow mask
    float f = smoothstep(0.0, 0.38, abs(d));
    if (u_invert_mask) {
        f = 1.0 - f;
    }

    col = mix(u_color4, col, f);

    // Vignette / subtle falloff around edges
    float vignette = smoothstep(1.3, 0.4, length(uv));
    col *= mix(0.75, 1.0, vignette);

    gl_FragColor = vec4(col * u_intensity, 1.0);
}
`;

function parseColorToVec3(colorStr: string, fallback: [number, number, number]): [number, number, number] {
  if (!colorStr) return fallback;
  const trimmed = colorStr.trim();

  // Hex color #RRGGBB or #RGB
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return [r, g, b];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return [r, g, b];
    }
  }

  // rgb(...) or rgba(...)
  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10) / 255,
      parseInt(rgbMatch[2], 10) / 255,
      parseInt(rgbMatch[3], 10) / 255,
    ];
  }

  return fallback;
}

function getVariationIndex(variation?: ShaderVariation): number {
  if (typeof variation === "number") return Math.max(0, Math.min(3, variation));
  switch (variation) {
    case "square":
      return 1;
    case "triangle":
      return 2;
    case "ring":
      return 3;
    case "circle":
    default:
      return 0;
  }
}

export function ShaderLensBlur({
  className,
  variation = "circle",
  color1 = "#022c22", // Emerald night dark
  color2 = "#065f46", // Emerald accent deep
  color3 = "#0d9488", // Teal highlight
  color4 = "#041e16", // Background blend
  invertMask = false,
  interactive = true,
  speed = 0.8,
  intensity = 1.0,
  style,
}: ShaderLensBlurProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const propsRef = useRef({
    variation,
    color1,
    color2,
    color3,
    color4,
    invertMask,
    interactive,
    speed,
    intensity,
  });

  // Keep latest props in ref for render loop without tearing
  propsRef.current = {
    variation,
    color1,
    color2,
    color3,
    color4,
    invertMask,
    interactive,
    speed,
    intensity,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    // Compile Vertex Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) return;
    gl.shaderSource(vertShader, VERTEX_SHADER_SOURCE);
    gl.compileShader(vertShader);

    // Compile Fragment Shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) {
      gl.deleteShader(vertShader);
      return;
    }
    gl.shaderSource(fragShader, FRAGMENT_SHADER_SOURCE);
    gl.compileShader(fragShader);

    // Create & Link Program
    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      return;
    }
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("ShaderLensBlur WebGL link failed:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      return;
    }

    gl.useProgram(program);

    // Vertex Buffer: full-screen quad (-1 to 1)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const aPositionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uColor1Loc = gl.getUniformLocation(program, "u_color1");
    const uColor2Loc = gl.getUniformLocation(program, "u_color2");
    const uColor3Loc = gl.getUniformLocation(program, "u_color3");
    const uColor4Loc = gl.getUniformLocation(program, "u_color4");
    const uVariationLoc = gl.getUniformLocation(program, "u_variation");
    const uInvertMaskLoc = gl.getUniformLocation(program, "u_invert_mask");
    const uIntensityLoc = gl.getUniformLocation(program, "u_intensity");

    let isVisible = true;
    const startTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        if (targetMouseX === 0 && targetMouseY === 0) {
          mouseX = width / 2;
          mouseY = height / 2;
          targetMouseX = width / 2;
          targetMouseY = height / 2;
        }
      }
    };

    updateSize();

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);

    // IntersectionObserver: automatically pause rendering when offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Mouse / Pointer Move listener
    const handlePointerMove = (e: PointerEvent) => {
      if (!propsRef.current.interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      targetMouseX = (e.clientX - rect.left) * dpr;
      targetMouseY = (rect.height - (e.clientY - rect.top)) * dpr; // WebGL Y is inverted
    };

    const parentElement = canvas.parentElement || canvas;
    parentElement.addEventListener("pointermove", handlePointerMove, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const render = (now: number) => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const p = propsRef.current;
      const elapsedTime = (now - startTime) * 0.001 * (p.speed ?? 0.8);

      // Smooth pointer interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      gl.useProgram(program);

      // Uniforms
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouseX, mouseY);
      gl.uniform1f(uTimeLoc, reducedMotion.matches ? 0.5 : elapsedTime);
      gl.uniform1i(uVariationLoc, getVariationIndex(p.variation));
      gl.uniform1i(uInvertMaskLoc, p.invertMask ? 1 : 0);
      gl.uniform1f(uIntensityLoc, p.intensity ?? 1.0);

      const c1 = parseColorToVec3(p.color1, [0.01, 0.17, 0.13]);
      const c2 = parseColorToVec3(p.color2, [0.02, 0.37, 0.27]);
      const c3 = parseColorToVec3(p.color3, [0.05, 0.58, 0.53]);
      const c4 = parseColorToVec3(p.color4, [0.01, 0.12, 0.08]);

      gl.uniform3f(uColor1Loc, c1[0], c1[1], c1[2]);
      gl.uniform3f(uColor2Loc, c2[0], c2[1], c2[2]);
      gl.uniform3f(uColor3Loc, c3[0], c3[1], c3[2]);
      gl.uniform3f(uColor4Loc, c4[0], c4[1], c4[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion.matches) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // Initial render
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parentElement.removeEventListener("pointermove", handlePointerMove);

      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full select-none", className)}
      style={style}
      aria-hidden="true"
    />
  );
}
