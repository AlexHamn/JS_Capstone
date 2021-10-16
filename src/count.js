export default function count() {
  const total = document.getElementById('works').children.length;
  return (`(${total})`);
}