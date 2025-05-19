const DescIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="down-long"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    className={className}
    style={{
      height: "1em",
    }}
  >
    <path d="M22 334.5c-3.8 8.8-2 19 4.6 26l116 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l116-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L148 0C130.3 0 116 14.3 116 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"></path>
  </svg>
);

export default DescIcon;
