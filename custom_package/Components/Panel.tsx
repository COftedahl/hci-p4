interface PanelProps {
  id?: string;
  text?: string;
  children?: Element;
}

const BASE_COLORS = [
  { r: 255, g: 0, b: 0 }, // red
  { r: 255, g: 165, b: 0 }, // orange
  { r: 255, g: 255, b: 0 }, // yellow
  { r: 0, g: 128, b: 0 }, // green
  { r: 0, g: 0, b: 255 }, // blue
  { r: 128, g: 0, b: 128 }, // purple
  { r: 255, g: 192, b: 203 }, // pink
];

function getRandomizedColor(): string {
  // make 40 percent lighter so inside text is clearly visible
  const whiteBoostFactor = 0.4;
  const clamp = (value: number): number => Math.max(0, Math.min(255, value));

  const perturb = (value: number): number => {
    const offset = Math.floor(Math.random() * 61) - 30;
    const res = clamp(value + offset);
    return res + (255 - res) * whiteBoostFactor;
  };

  const base = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];

  const r = perturb(base.r);
  const g = perturb(base.g);
  const b = perturb(base.b);

  return `rgb(${r}, ${g}, ${b})`;
}

const Panel: React.FC<PanelProps> = (props: PanelProps) => {
  const debugBackgroundColor: string = getRandomizedColor();
  (props as any).log("Log events appear here.");

  const handleClick = (e: Event) => {
    // if a chlid is clicked, do nothing
    if (e.target === e.currentTarget) {
      (props as any).log("Clicked");
    }
  };

  const handlePointerEnter = (e: PointerEvent) => {
    (e.currentTarget as HTMLDivElement).style.backgroundColor = debugBackgroundColor;
  };

  const handlePointerLeave = (e: PointerEvent) => {
    (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
  };

  // (props as any).log(props.children);

  return (
    <div
      className="Panel card margin1 borderBox"
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <p>{props.text ?? "Hello from the Panel!"}</p>
      {props.children}
    </div>
  );
};

export default Panel;
