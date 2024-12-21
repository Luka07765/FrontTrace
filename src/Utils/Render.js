export const renderDeltas = (editorRef, deltasArray) => {
  const html = deltasArray
    .map((delta) => {
      const styles = delta.attributes
        ? Object.entries(delta.attributes)
            .map(([attrKey, attrValue]) => {
              switch (attrKey) {
                case 'bold':
                  return attrValue ? 'font-weight: bold;' : '';
                case 'color':
                  return `color: ${attrValue};`;
                case 'fontSize':
                  return `font-size: ${attrValue};`;
                default:
                  return '';
              }
            })
            .join(' ')
        : '';

      return `<span style="${styles}">${delta.insert}</span>`;
    })
    .join('');

  if (editorRef.current) {
    editorRef.current.innerHTML = html;
  }
};
