import { SVGProps, useState } from "react"

const EventResponder = (props: SVGProps<SVGCircleElement>) => {
  return <circle
    {...props}
    fill="transparent"
    stroke="none"
    r={12}
  />
}

const activeColor = "rgb(64, 208, 255)";
const inactiveColor = "rgba(255, 255, 255, 1)";
const outlineColor = "rgba(0, 0, 0, 1)";
const inactiveOpacity = 0.6;

const smallMarkerSize = 2;
const roundMarkerSize = 5;
const squareMarkerSize = 5;

export const PointMarker = (props: SVGProps<SVGCircleElement> & {
  isSmooth: boolean,
  isActive: boolean,
}) => {
  const {
    cx: x,
    cy: y,
    isSmooth,
    isActive,
    ...rest
  } = props;
  const r = isSmooth ? roundMarkerSize : squareMarkerSize;
  const [isHovered, setIsHovered] = useState(false);
  return <g transform={`translate(${x} ${y})`}>
    {isSmooth && <g>
      <g
        opacity={isHovered || isActive ? 1 : inactiveOpacity}
      >
        <circle
          cx={0}
          cy={0}
          r={r}
          fill={outlineColor}
          stroke={outlineColor}
          strokeWidth={4}
          pointerEvents={"none"}
        />
        <circle
          cx={0}
          cy={0}
          r={r}
          stroke={isActive ? activeColor : inactiveColor}
          fill={isActive ? activeColor : inactiveColor}
          strokeWidth={2}
          pointerEvents={"none"}
        />
      </g>
      {!isActive && <circle
        cx={0}
        cy={0}
        r={r + 0.5}
        fill={"none"}
        stroke={isActive ? activeColor : inactiveColor}
        strokeWidth={1}
      />}
    </g>}
    {!isSmooth && <g>
      <g
        opacity={isHovered || isActive ? 1 : inactiveOpacity}
      >
        <path
          d={`M ${r} ${0} L ${0} ${r} L ${-r} ${0} L ${0} ${-r} Z`}
          fill={"none"}
          stroke={outlineColor}
          strokeWidth={4}
          // strokeLinejoin="round"
          pointerEvents={"none"}
        />
        <path
          d={`M ${r} ${0} L ${0} ${r} L ${-r} ${0} L ${0} ${-r} Z`}
          fill={isActive ? activeColor : inactiveColor}
          stroke={isActive ? activeColor : inactiveColor}
          strokeWidth={2}
          // strokeLinejoin="round"
          pointerEvents={"none"}
        />
      </g>
      {!isActive && <path
        d={`M ${r + 0.7} ${0} L ${0} ${r + 0.7} L ${-r - 0.7} ${0} L ${0} ${-r - 0.7} Z`}
        fill={"none"}
        stroke={isActive ? activeColor : inactiveColor}
        strokeWidth={1}
        // strokeLinejoin="round"
        pointerEvents={"none"}
      />}
    </g>}
    <EventResponder
      cx={0}
      cy={0}
      style={{ cursor: "move" }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        rest.onMouseLeave?.(e);
      }}
      {...rest}
    />
  </g>
}

export const LinearEditorPointMarker = (props: SVGProps<SVGCircleElement> & {
  isSmooth: boolean,
  isActive: boolean,
  smoothmarkersize?: "small" | "normal",
}) => {
  const {
    cx: x,
    cy: y,
    isSmooth,
    isActive,
    ...rest
  } = props;
  const smoothMarkerSize = props.smoothmarkersize === "small" ? smallMarkerSize : roundMarkerSize;
  const r = isSmooth ? smoothMarkerSize : squareMarkerSize;
  const [isHovered, setIsHovered] = useState(false);
  return <g transform={`translate(${x} ${y})`}>
    {isSmooth && <g>
      <g
        opacity={isHovered || isActive ? 1 : inactiveOpacity}
      >
        <circle
          cx={0}
          cy={0}
          r={r}
          fill={outlineColor}
          stroke={outlineColor}
          strokeWidth={4}
          pointerEvents={"none"}
        />
        <circle
          cx={0}
          cy={0}
          r={r}
          stroke={isActive ? activeColor : inactiveColor}
          fill={isActive ? activeColor : inactiveColor}
          strokeWidth={2}
          pointerEvents={"none"}
        />
      </g>
      {!isActive && <circle
        cx={0}
        cy={0}
        r={r + 0.5}
        fill={"none"}
        stroke={isActive ? activeColor : inactiveColor}
        strokeWidth={1}
      />}
    </g>}
    {!isSmooth && <g>
      <g
        opacity={isHovered || isActive ? 1 : inactiveOpacity}
      >
        <path
          d={`M ${r} ${0} L ${0} ${r} L ${-r} ${0} L ${0} ${-r} Z`}
          fill={"none"}
          stroke={outlineColor}
          strokeWidth={4}
          // strokeLinejoin="round"
          pointerEvents={"none"}
        />
        <path
          d={`M ${r} ${0} L ${0} ${r} L ${-r} ${0} L ${0} ${-r} Z`}
          fill={isActive ? activeColor : inactiveColor}
          stroke={isActive ? activeColor : inactiveColor}
          strokeWidth={2}
          // strokeLinejoin="round"
          pointerEvents={"none"}
        />
      </g>
      {!isActive && <path
        d={`M ${r + 0.7} ${0} L ${0} ${r + 0.7} L ${-r - 0.7} ${0} L ${0} ${-r - 0.7} Z`}
        fill={"none"}
        stroke={isActive ? activeColor : inactiveColor}
        strokeWidth={1}
        // strokeLinejoin="round"
        pointerEvents={"none"}
      />}
    </g>}
    <EventResponder
      cx={0}
      cy={0}
      style={{ cursor: "move" }}
      onMouseEnter={(e) => {
        rest.onMouseEnter?.(e)
        setIsHovered(true)
      }}
      onMouseLeave={(e) => {
        rest.onMouseLeave?.(e)
        setIsHovered(false)
      }}
      {...rest}
    />
  </g>
}

export const AddPointMarker = (props: SVGProps<SVGCircleElement>) => {
  const r = 8;
  return <g transform={`translate(${props.cx} ${props.cy})`}>
    <circle
      cx={0}
      cy={0}
      r={r}
      fill={"rgba(0, 0, 0, 0.5)"}
      pointerEvents={"none"}
    />
    <line
      x1={-r+3}
      x2={r-3}
      y1={0}
      y2={0}
      stroke={"white"}
      strokeWidth={2}
      pointerEvents={"none"}
    />
    <line
      x1={0}
      x2={0}
      y1={-r+3}
      y2={r-3}
      stroke={"white"}
      strokeWidth={2}
      pointerEvents={"none"}
    />
    <circle
      cx={0}
      cy={0}
      r={r}
      fill={"none"}
      stroke={"white"}
      strokeOpacity={0.7}
      strokeWidth={1}
      pointerEvents={"none"}
    />
  </g>
}

export const ColorPickerMarker = (props: SVGProps<SVGCircleElement>) => {
  const {
    cx: x,
    cy: y,
    ...rest
  } = props;
  const r = roundMarkerSize;
  const [isHovered, setIsHovered] = useState(false);
  return <g transform={`translate(${x} ${y})`}>
    <g>
      <g
        opacity={isHovered ? 1 : inactiveOpacity}
      >
        <circle
          cx={0}
          cy={0}
          r={r}
          fill={outlineColor}
          stroke={outlineColor}
          strokeWidth={4}
          pointerEvents={"none"}
        />
        <circle
          cx={0}
          cy={0}
          r={r}
          stroke={inactiveColor}
          fill={inactiveColor}
          strokeWidth={2}
          pointerEvents={"none"}
        />
      </g>
      <circle
        cx={0}
        cy={0}
        r={r + 0.5}
        fill={"none"}
        stroke={inactiveColor}
        strokeWidth={1}
      />
    </g>
    <EventResponder
      cx={0}
      cy={0}
      onMouseEnter={(e) => {
        setIsHovered(true);
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        rest.onMouseLeave?.(e);
      }}
      {...rest}
    />
  </g>
}