export default function copyToClipboard(content) {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    navigator.clipboard.writeText(content);
  } else {
    const text = document.createElement("textarea");

    document.body.appendChild(text);

    text.innerText = content;
    text.select();

    document.execCommand("copy");
    document.body.removeChild(text);
  }
}
