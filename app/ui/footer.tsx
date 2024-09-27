export default function Footer({ sources }) {
  return (
    <footer className="mt-20 text-gray-500 text-xs">
      Data provided by{" "}
      {sources.map((source, index) => (
        <span key={index}>
          <a
            href={source.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-300 hover:underline"
          >
            {source.name}
          </a>
          {index < sources.length - 1 ? ", " : ""}{" "}
          {/* Add comma except for the last item */}
        </span>
      ))}
    </footer>
  );
}
