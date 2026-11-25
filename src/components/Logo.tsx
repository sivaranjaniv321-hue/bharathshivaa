interface LogoProps {
  variant?: 'dark' | 'light';
  showTagline?: boolean;
}

export function Logo({ variant = 'dark', showTagline = false }: LogoProps) {
  const titleColor = variant === 'light' ? 'text-ivory-50' : 'text-maroon-800';
  const ringStroke = variant === 'light' ? '#D49B27' : '#6B1420';
  const leafFill = variant === 'light' ? '#FBF8F3' : '#D49B27';
  const archFill = variant === 'light' ? '#D49B27' : '#6B1420';

  return (
    <span className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Outer traditional temple-inspired circular seal */}
        <circle cx="20" cy="20" r="18.5" stroke={ringStroke} strokeWidth="1.75" />
        <circle cx="20" cy="20" r="15.5" stroke="#D49B27" strokeWidth="0.9" strokeOpacity="0.65" />
        {/* Stylized banana leaf curve */}
        <path
          d="M11 23.5C11 17.5 16.5 13 26.5 12.5C25.5 21 21 26.5 13.5 26.5C12.2 26.5 11.4 25.4 11 23.5Z"
          fill={leafFill}
          fillOpacity="0.9"
        />
        {/* Leaf central rib */}
        <path
          d="M11.5 25.5C15.5 22 20 18 26 13"
          stroke={archFill}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Brass katori / bowl silhouette underneath */}
        <path
          d="M13 28.5H27C26.2 31 23.4 32.5 20 32.5C16.6 32.5 13.8 31 13 28.5Z"
          fill={archFill}
        />
        {/* Subtle rising warmth flame / lamp motif */}
        <path
          d="M20 7.5C20.8 9 21.5 9.8 21.5 10.8C21.5 11.7 20.8 12.4 20 12.4C19.2 12.4 18.5 11.7 18.5 10.8C18.5 9.8 19.2 9 20 7.5Z"
          fill="#D49B27"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-xl font-bold tracking-tight ${titleColor}`}>
          Bharath Delights
        </span>
        {showTagline && (
          <span
            className={`text-[11px] font-medium tracking-wide mt-0.5 ${
              variant === 'light' ? 'text-cream-200' : 'text-brown-500'
            }`}
          >
            Tamil Nadu Kitchen
          </span>
        )}
      </span>
    </span>
  );
}
