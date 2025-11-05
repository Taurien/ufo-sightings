export default function Footer() {
  return (
    <footer className=" bg-black py-1.5">
      <p className=" text-center text-xs text-white">
        Data displayed belongs to{" "}
        <a
          href="https://nuforc.org/"
          target="_blank"
          rel="noopener noreferrer"
          className=" underline"
        >
          NUFORC
        </a>
        . No commercial intent.
      </p>
    </footer>
  );
}
