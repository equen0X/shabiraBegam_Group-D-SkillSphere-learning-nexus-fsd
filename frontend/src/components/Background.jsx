import "../styles/background.css";

export default function Background() {

  return (

    <>
      <div className="grid"></div>

      <div className="blob blob1"></div>

      <div className="blob blob2"></div>

      <div className="blob blob3"></div>

      <div className="particles">

        {Array.from({ length: 35 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
            }}
          />
        ))}

      </div>

      <div className="scanlines"></div>

    </>

  );

}