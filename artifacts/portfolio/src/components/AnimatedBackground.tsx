export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="aurora-background fixed inset-0 pointer-events-none overflow-hidden"
    >
      <div className="aurora-orb aurora-orb-one" />
      <div className="aurora-orb aurora-orb-two" />
      <div className="aurora-particles absolute inset-0" />
      <div className="absolute inset-0 aurora-grid" />
    </div>
  );
}
