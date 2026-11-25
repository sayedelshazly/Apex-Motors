const items = [
  'BUGATTI', 'LAMBORGHINI', 'FERRARI', 'McLAREN', 'PORSCHE',
  'MERCEDES-AMG', 'BMW M', 'BENTLEY', 'ASTON MARTIN', 'MASERATI',
];

export default function Marquee({ dark = false }) {
  const row = [...items, ...items];
  return (
    <div
      className={`relative z-10 overflow-hidden border-y py-4 ${
        dark ? 'border-line bg-void' : 'border-void/20 bg-signal text-white'
      }`}
      dir="ltr"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap pr-8">
        {row.map((b, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className={`font-display text-2xl tracking-wide md:text-3xl ${dark ? 'text-bone/85' : 'text-white'}`}>
              {b}
            </span>
            <span className={dark ? 'text-signal' : 'text-void/70'}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
